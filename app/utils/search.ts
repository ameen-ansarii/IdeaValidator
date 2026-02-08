
interface SearchResult {
    title: string;
    url: string;
    content: string;
    score: number;
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
        console.warn("⚠️ No TAVILY_API_KEY found. Skipping real-time search.");
        return [];
    }

    try {
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_key: apiKey,
                query: query,
                search_depth: "basic",
                include_answer: true,
                max_results: 5,
            }),
        });

        if (!response.ok) {
            // If 403/401, key is bad. If 400, bad request.
            console.error(`Tavily API Error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        // Map to a cleaner format
        return data.results.map((result: any) => ({
            title: result.title,
            url: result.url,
            content: result.content, // Snippet
            score: result.score,
        }));

    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}
