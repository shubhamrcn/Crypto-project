"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const rules = [
    {
        title: "profit.tax = 30%",
        subtitle: "Flat Rate",
        description: "No exemptions. 30% tax on gains from Trading, NFTs, DeFi, and Gifts.",
        accent: "text-purple-500",
        border: "hover:border-purple-500/50"
    },
    {
        title: "On-Chain Deduction",
        subtitle: "1% TDS",
        description: "1% TDS deducted on every Buy, Sell, or Transfer to track activity.",
        accent: "text-blue-500",
        border: "hover:border-blue-500/50"
    },
    {
        title: "Isolated Losses",
        subtitle: "Zero Sett-Off",
        description: "Cannot subtract losses from gains. No carry forward to next year.",
        accent: "text-red-500",
        border: "hover:border-red-500/50"
    },
    {
        title: "NFT & Token Standard",
        subtitle: "VDA Clarity",
        description: "NFT sales and creator royalties are fully taxable as Virtual Digital Assets.",
        accent: "text-pink-500",
        border: "hover:border-pink-500/50"
    },
    {
        title: "Cross-Border Watch",
        subtitle: "Global Compliance",
        description: "Mandatory reporting for holdings in overseas exchanges and wallets.",
        accent: "text-cyan-500",
        border: "hover:border-cyan-500/50"
    },
    {
        title: "Asset Inclusion",
        subtitle: "Stablecoins & RWAs",
        description: "Tokenized gold and asset-backed tokens fall under the same strict tax framework.",
        accent: "text-orange-500",
        border: "hover:border-orange-500/50"
    }
];

export function TaxRulesGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.map((rule, index) => (
                <Card
                    key={index}
                    className={cn(
                        "bg-white/5 border-white/10 backdrop-blur-sm transition-all duration-300 group",
                        rule.border
                    )}
                >
                    <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                            {/* Mono-style decorative index */}
                            <span className="text-xs font-mono text-gray-600">0{index + 1}</span>
                            <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5", rule.accent)}>
                                {rule.subtitle}
                            </span>
                        </div>
                        <CardTitle className="text-xl font-space-grotesk text-white group-hover:text-primary transition-colors">
                            {rule.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {rule.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
