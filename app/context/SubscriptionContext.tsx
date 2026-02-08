"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SubscriptionTier = "free" | "pro" | "enterprise";

interface SubscriptionContextType {
    tier: SubscriptionTier;
    setTier: (tier: SubscriptionTier) => void;
    isPro: boolean;
    isEnterprise: boolean;
    canAccess: (requiredTier: "pro" | "enterprise") => boolean;
    validationsRemaining: number;
    decrementValidations: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const TIER_LEVELS: Record<SubscriptionTier, number> = {
    free: 0,
    pro: 1,
    enterprise: 2,
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [tier, setTierState] = useState<SubscriptionTier>("free");
    const [validationsRemaining, setValidationsRemaining] = useState(5);

    // Load from localStorage on mount
    useEffect(() => {
        const savedTier = localStorage.getItem("subscription_tier") as SubscriptionTier;
        const savedValidations = localStorage.getItem("validations_remaining");

        if (savedTier && ["free", "pro", "enterprise"].includes(savedTier)) {
            setTierState(savedTier);
        }

        if (savedValidations) {
            setValidationsRemaining(parseInt(savedValidations, 10));
        }
    }, []);

    const setTier = (newTier: SubscriptionTier) => {
        setTierState(newTier);
        localStorage.setItem("subscription_tier", newTier);

        // Reset validations based on tier
        if (newTier === "enterprise") {
            setValidationsRemaining(999); // Unlimited
            localStorage.setItem("validations_remaining", "999");
        } else if (newTier === "pro") {
            setValidationsRemaining(50);
            localStorage.setItem("validations_remaining", "50");
        }
    };

    const decrementValidations = () => {
        if (tier === "enterprise") return; // Unlimited for enterprise

        const newCount = Math.max(0, validationsRemaining - 1);
        setValidationsRemaining(newCount);
        localStorage.setItem("validations_remaining", newCount.toString());
    };

    const isPro = TIER_LEVELS[tier] >= TIER_LEVELS.pro;
    const isEnterprise = TIER_LEVELS[tier] >= TIER_LEVELS.enterprise;

    const canAccess = (requiredTier: "pro" | "enterprise"): boolean => {
        return TIER_LEVELS[tier] >= TIER_LEVELS[requiredTier];
    };

    return (
        <SubscriptionContext.Provider
            value={{
                tier,
                setTier,
                isPro,
                isEnterprise,
                canAccess,
                validationsRemaining,
                decrementValidations,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error("useSubscription must be used within a SubscriptionProvider");
    }
    return context;
}
