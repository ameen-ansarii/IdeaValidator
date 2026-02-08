"use server";

import Groq from "groq-sdk";
import { ValidationReport, TechStack, PivotStrategy } from "./types";

// Groq Configuration - Super fast and generous free tier!
const MODEL_NAME = "llama-3.3-70b-versatile";

const getGroq = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GROQ_API_KEY in .env.local");
    }

    return new Groq({
        apiKey: apiKey,
    });
};

import { searchWeb } from "./utils/search";

export async function validateIdea(idea: string, mode: "default" | "roast" = "default"): Promise<ValidationReport> {
    const client = getGroq();

    // 1. Perform Real-Time Search (The "Brain" part)
    console.log("🔍 Searching web for:", idea);

    // Search queries: Focus on NEWS and REPORTS, not just competitor homepages
    const searchQueries = [
        `${idea} industry news trends 2025 2026`,
        `${idea} market report analysis`,
        `future of ${idea} startup landscape 2026`
    ];

    // Run searches in parallel (if we had multiple) - for now just one robust one
    const searchResults = await searchWeb(`${idea} industry news market trends competitors 2025 2026`);

    // Format context for the LLM
    const contextString = searchResults.map(r =>
        `[Source: ${r.title}](${r.url}): ${r.content.substring(0, 200)}...`
    ).join("\n\n");

    console.log("✅ Search complete. Context length:", contextString.length);

    let systemPrompt = `You are an expert startup analyst and product validator. 
Your task is to provide a strict, realistic, non-motivational evaluation of a startup idea.

IMPORTANT: You have access to REAL-TIME SEARCH CONTEXT below. 
You MUST use this context to cite REAL competitors and REAL market trends. 
Do not hallucinate. If the search results show a competitor, list them.

---
REAL-TIME MARKET CONTEXT:
${contextString || "No specific search results found. Rely on your general knowledge."}
---

Rules:
- Avoid hype, encouragement, or emotional language.
- Be blunt but constructive.
- If the idea is weak, clearly say so.
- Do not give legal or financial advice.
- CITATIONS: When you mention a fact or competitor from the context, try to include the URL or Source Name.

You MUST respond with ONLY a valid JSON object matching this exact schema:
{
  "summary": "string",
  "targetUsers": "string",
  "problemSeverity": number (1-10),
  "severityJustification": "string",
  "marketDemand": "string (High/Medium/Low)",
  "demandJustification": "string",
  "monetizationPaths": ["string"],
  "alternatives": ["string (Real competitors found in search)"],
  "risks": "string",
  "mvpScope": "string",
  "verdict": "string (Promising/Questionable/Weak)",
  "verdictJustification": "string",
  "viabilityScore": number (0-100),
  "confidenceJustification": "string",
  "whyItFails": "string",
  "whoShouldNotBuild": "string",
  "marketTrends": "string (Specific 2025-26 market shifts relevant to this)",
  "sources": ["string (Format: 'Article Headline: URL' - Do NOT list competitor homepages here, only news/blogs/reports)"]
}`;

    if (mode === 'roast') {
        systemPrompt = `You are a savage, cynical, witty, and brutally honest startup validator (ROAST MODE ACTIVE).
Your task is to provide a strict, realistic evaluation, but wrapped in top-tier sarcasm, internet culture references, and dark humor.

---
REAL-TIME CONTEXT (Use this to roast them accurately):
${contextString}
---

Rules:
- ⚡ USE SIMPLE LANGUAGE: Write like a savvy Twitter/X user.
- Be Witty & Sarcastic: Use modern internet slang.
- Be Brutally Honest: If the idea has a competitor (check context), MOCK THEM for copying.
- One-Liners: Use short, cutting sentences.
- ACCURACY IS KEY: The ratings must be real. The roast must be based on facts (e.g. "You're building another To-Do app in 2025?").

You MUST respond with ONLY a valid JSON object matching this exact schema:
{
  "summary": "string (A short, stinging paragraph roasting the concept)",
  "targetUsers": "string",
  "problemSeverity": number (1-10),
  "severityJustification": "string",
  "marketDemand": "string (High/Medium/Low)",
  "demandJustification": "string",
  "monetizationPaths": ["string"],
  "alternatives": ["string"],
  "risks": "string",
  "mvpScope": "string",
  "verdict": "string (Promising/Questionable/Weak)",
  "verdictJustification": "string",
  "viabilityScore": number (0-100),
  "confidenceJustification": "string",
  "whyItFails": "string",
  "whoShouldNotBuild": "string",
  "roast": {
    "summary": "Full roast paragraph",
    "sarcasticVerdict": "Funny title",
    "humorousAnalogy": "Analogy",
    "burn": "Savage one-liner"
  },
  "marketTrends": "string",
  "sources": ["string (Format: 'Article Headline: URL' - Do NOT list competitor homepages here, only news/blogs/reports)"]
}`;
    }

    try {
        console.log("🚀 Starting validation with Groq...");
        console.log("📋 Model:", MODEL_NAME);

        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Evaluate this startup idea: "${idea}"` }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        console.log("✅ Received response from Groq");
        const response = completion.choices[0]?.message?.content || "";

        // Clean up markdown code blocks if present
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();

        if (!cleanContent || cleanContent === "{}") {
            throw new Error("Received empty response from AI");
        }

        const parsed = JSON.parse(cleanContent) as ValidationReport;

        // Fallback: If AI didn't fill sources but we found some, inject them
        if ((!parsed.sources || parsed.sources.length === 0) && searchResults.length > 0) {
            parsed.sources = searchResults.slice(0, 3).map(r => r.title + ": " + r.url);
        }

        console.log("✅ Successfully parsed JSON response");
        return parsed;
    } catch (error: any) {
        console.error("❌ Groq Validation Error:");
        console.error("Error message:", error.message);
        throw new Error(`Validation failed: ${error.message || "Unknown error"}`);
    }
}

export async function pivotIdea(originalIdea: string): Promise<PivotStrategy> {
    const client = getGroq();

    const systemPrompt = `You are a world-class startup strategist known for turning failed ideas into unicorns (like Slack from Glitch, or Twitter from Odeo).
Your goal is to "pivot" a given idea into a significantly better, high-growth direction based on 2025 market trends.

Rules:
1. Retain the core industry or insight but change the execution/model.
2. Focus on high-value problems (B2B Saas, AI Agents, Marketplace liquidity).
3. The new idea must be "investible" and scalable.

You MUST respond with ONLY a valid JSON object:
{
  "originalConcept": "Short summary of the bad idea",
  "pivotConcept": "The new, better idea (2 lines max)",
  "whyItWorks": "Why this new angle wins in the current market",
  "targetAudienceShift": "How the customer changes (e.g. 'From Teens to Enterprise HR')",
  "complexityScore": "Low/Medium/High"
}`;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Pivot this idea: "${originalIdea}"` }
            ],
            temperature: 0.8,
            max_tokens: 500,
        });

        const response = completion.choices[0]?.message?.content || "";
        const clean = response.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(clean);
    } catch (error: any) {
        console.error("Pivot Error:", error);
        throw new Error("Failed to generate pivot.");
    }
}

export async function generateRoadmap(idea: string): Promise<any[]> {
    const client = getGroq();

    const systemPrompt = `You are an expert startup CTO and Project Manager.
Create a strict 4-Week Execution Plan (Roadmap) for this idea with enhanced details.

You MUST respond with ONLY a valid JSON array in this exact format:
[
  { 
    "week": "Week 1", 
    "title": "Validation & Foundations", 
    "tasks": ["Task 1", "Task 2", "Task 3"],
    "estimatedCost": "$500-1000",
    "teamSize": 2,
    "skillsRequired": ["Product Design", "Market Research"],
    "keyMilestones": ["User interviews completed", "MVP scope defined"]
  },
  { 
    "week": "Week 2", 
    "title": "MVP Build (Core)", 
    "tasks": ["Task 1", "Task 2", "Task 3"],
    "estimatedCost": "$2000-5000",
    "teamSize": 3,
    "skillsRequired": ["Full-stack Development", "UI/UX Design"],
    "keyMilestones": ["Core feature working", "Basic UI complete"]
  },
  { 
    "week": "Week 3", 
    "title": "Launch & Feedback", 
    "tasks": ["Task 1", "Task 2", "Task 3"],
    "estimatedCost": "$1000-2000",
    "teamSize": 2,
    "skillsRequired": ["Marketing", "Customer Success"],
    "keyMilestones": ["First 50 users", "Feedback loop established"]
  },
  { 
    "week": "Week 4", 
    "title": "Iterate & Scale", 
    "tasks": ["Task 1", "Task 2", "Task 3"],
    "estimatedCost": "$3000-7000",
    "teamSize": 4,
    "skillsRequired": ["DevOps", "Growth Marketing", "Engineering"],
    "keyMilestones": ["Product-market fit signal", "Scaling infrastructure"]
  }
]`;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Create a detailed roadmap for: "${idea}"` }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const response = completion.choices[0]?.message?.content || "";
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();

        return JSON.parse(cleanContent);
    } catch (error: any) {
        console.error("Roadmap Error:", error);
        throw new Error("Failed to generate roadmap.");
    }
}

export async function analyzeCompetitors(idea: string) {
    const client = getGroq();

    // 1. Search for REAL competitors
    const searchResults = await searchWeb(`${idea} competitors alternatives market share 2025 2026`);
    const contextString = searchResults.map(r =>
        `[Source: ${r.title}](${r.url}): ${r.content}`
    ).join("\n\n");

    const systemPrompt = `You are a market research analyst and competitive intelligence expert.
Analyze the competitive landscape for this startup idea.

IMPORTANT: Use the REAL-TIME CONTEXT below to identify actual existing companies.
If the context lists competitors, YOU MUST INCLUDE THEM.
If you cannot find a specific URL, leave the field empty string "".

---
REAL-TIME CONTEXT:
${contextString}
---

You MUST respond with ONLY a valid JSON object in this exact format:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "url": "https://competitor.com (or empty if unknown)",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"]
    }
  ],
  "marketPosition": "Description of where this idea fits in the market",
  "differentiationStrategy": "How to stand out from competitors",
  "competitiveAdvantages": ["Advantage 1", "Advantage 2", "Advantage 3"],
  "threats": ["Threat 1", "Threat 2"]
}`;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Analyze competitors for: "${idea}"` }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const response = completion.choices[0]?.message?.content || "";
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();

        return JSON.parse(cleanContent);
    } catch (error: any) {
        console.error("Competitive Analysis Error:", error);
        throw new Error("Failed to analyze competitors.");
    }
}

export async function calculateMarketSize(idea: string) {
    const client = getGroq();

    // 1. Search for Market Data
    const searchResults = await searchWeb(`${idea} market size tam sam som report 2025 2026`);
    const contextString = searchResults.map(r =>
        `[Source: ${r.title}](${r.url}): ${r.content}`
    ).join("\n\n");

    const systemPrompt = `You are a venture capital analyst and market sizing expert.
Calculate TAM, SAM, SOM and revenue projections for this startup idea.

IMPORTANT: Use the REAL-TIME CONTEXT below to find actual market numbers (in Billions/Millions).
If the context has specific numbers (e.g. "The Global AI market is $196B"), USE THEM.

---
REAL-TIME CONTEXT:
${contextString}
---

You MUST respond with ONLY a valid JSON object in this exact format:
{
  "tam": "$10B",
  "sam": "$1B",
  "som": "$50M",
  "tamJustification": "Explanation of total addressable market calculation (cite sources if available)",
  "samJustification": "Explanation of serviceable addressable market",
  "somJustification": "Explanation of serviceable obtainable market",
  "revenueProjection": {
    "year1": "$100K",
    "year2": "$500K",
    "year3": "$2M"
  }
}`;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Calculate market size for: "${idea}"` }
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });

        const response = completion.choices[0]?.message?.content || "";
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();

        return JSON.parse(cleanContent);
    } catch (error: any) {
        console.error("Market Size Error:", error);
        throw new Error("Failed to calculate market size.");
    }
}

export async function roastIdea(idea: string): Promise<string> {
    const client = getGroq();
    const prompt = `
    You are a savage, cynical, and brutally honest startup venture capitalist who has seen it all. 
    Roast the following startup idea. Be mean, funny, and devastatingly accurate about why it might fail. 
    Don't hold back. Use slang like "vaporware", "feature not a product", "solution in search of a problem".
    Keep it under 300 characters.

    Idea: "${idea}"
  `;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
            temperature: 1, // High temp for creativity
            max_tokens: 300,
        });
        return completion.choices[0]?.message?.content || "Your idea is so bad I can't even roast it. (AI Error)";
    } catch (error) {
        console.error("Roast error:", error);
        return "Your idea is so bad I can't even roast it. (AI Error)";
    }
}

export async function generateBrandVibe(idea: string): Promise<{ colors: string[], fontPair: string, slogan: string, designStyle: string }> {
    const client = getGroq();
    const prompt = `
    For the following startup idea, generate a "Brand Vibe" kit.
    Return strictly a JSON object with these fields:
    - colors: array of 4 hex codes (e.g. ["#ffffff", ...]) that fit the mood.
    - fontPair: a string describing a font pairing (e.g. "Space Mono + Inter").
    - slogan: a punchy, 3-5 word slogan.
    - designStyle: a short 2-3 word description of the aesthetic (e.g. "Corporate Memphis", "Cyberpunk Neon", "Minimalist Swiss").

    Idea: "${idea}"
    
    Response must be valid JSON only. Do not wrap in markdown blocks.
  `;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            max_tokens: 500,
        });

        const response = completion.choices[0]?.message?.content || "{}";
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanContent);
    } catch (error) {
        console.error("Brand vibe error:", error);
        return {
            colors: ["#000000", "#333333", "#666666", "#999999"],
            fontPair: "Arial + Times",
            slogan: "Just build it.",
            designStyle: "Generic Fallback"
        };
    }
}


export async function recommendTechStack(idea: string): Promise<TechStack> {
    const client = getGroq();

    const systemPrompt = `You are a Senior CTO and Software Architect.
Recommend the best technology stack for this startup idea, focusing on speed to market (MVP) and scalability.

You MUST respond with ONLY a valid JSON object in this exact format:
{
  "frontend": "e.g. Next.js, React Native, Flutter",
  "backend": "e.g. Node.js, Supabase, Firebase, Go",
  "database": "e.g. PostgreSQL, MongoDB, Redis",
  "infrastructure": "e.g. Vercel, AWS, Google Cloud",
  "tools": ["Tool 1", "Tool 2", "Tool 3"],
  "justification": "Brief explanation of why this stack is best for this specific idea."
}`;

    try {
        const completion = await client.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Recommend tech stack for: "${idea}"` }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const response = completion.choices[0]?.message?.content || "";
        const cleanContent = response.replace(/```json\n?|\n?```/g, "").trim();

        return JSON.parse(cleanContent);
    } catch (error: any) {
        console.error("Tech Stack Error:", error);
        throw new Error("Failed to recommend tech stack.");
    }
}

export async function checkDomainAvailability(domain: string): Promise<boolean> {
    try {
        console.log(`Checking availability for ${domain} via AI Search...`);

        // Search for recent availability info
        const searchResults = await searchWeb(`site:${domain} OR "is ${domain} available" OR "whois ${domain}"`);
        
        // If we find the site indexed, it's definitely taken
        const siteIndexed = searchResults.some(r => r.url.includes(domain));
        if (siteIndexed) {
             console.log(`Domain ${domain} is indexed, so it is taken.`);
             return false;
        }

        // Use Groq to analyze the search snippets
        const groq = getGroq();
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a Domain Name availability analyzer. Analyze the search results to determine if a domain is AVAILABLE or TAKEN. Output JSON: { \"available\": boolean }"
                },
                {
                    role: "user",
                    content: `Domain: ${domain}\nSearch Results: ${JSON.stringify(searchResults)}\n\nIs it available?`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        
        const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
        console.log(`AI Verdict for ${domain}:`, result);

        // If AI explicitly says valid: false (taken), return false.
        // If available: true, return true.
        // If undefined/null, assume available (optimistic fallback).
        return result.available !== false; 
        
    } catch (e) {
        console.error("Domain check error", e);
        return false; // Fail safe
    }
}
