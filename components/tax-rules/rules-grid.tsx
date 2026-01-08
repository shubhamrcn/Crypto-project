"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface RuleDetail {
    title: string;
    subtitle: string;
    description: string;
    accent: string;
    border: string;
    content: {
        whatItMeans: string;
        clarifications: string[];
        examples?: string[]; // Used for "What counts as a transfer" or "Examples"
        implication: string;
        extraSection?: { title: string; items: string[] }; // For specific sections like "When TDS applies" or "What is allowed"
    }
}

const rules: RuleDetail[] = [
    {
        title: "Flat Rate (30%)",
        subtitle: "Section 115BBH",
        description: "A flat 30% tax applies to all income from transfers of Virtual Digital Assets (VDAs). No slab rates apply.",
        accent: "text-purple-500",
        border: "hover:border-purple-500/50",
        content: {
            whatItMeans: "All income arising from the transfer of Virtual Digital Assets (VDAs) is taxed at a flat 30% rate, irrespective of your total income, holding period, or frequency of trading.",
            clarifications: [
                "No basic exemption limit applies",
                "No slab rates apply",
                "Long-term vs short-term distinction does not exist",
                "Business income treatment is not allowed"
            ],
            extraSection: {
                title: "What counts as a 'transfer'",
                items: [
                    "Selling crypto for INR or fiat",
                    "Swapping one crypto for another",
                    "Using crypto to purchase goods or services",
                    "Gifting crypto (taxable in recipient’s hands)"
                ]
            },
            implication: "Even a ₹1,000 gain is taxed at 30%, unlike equities or mutual funds."
        }
    },
    {
        title: "On-Chain TDS (1%)",
        subtitle: "Section 194S",
        description: "1% TDS is deducted on every Buy, Sell, or Crypto-to-Crypto transfer exceeding threshold limits.",
        accent: "text-blue-500",
        border: "hover:border-blue-500/50",
        content: {
            whatItMeans: "A 1% Tax Deducted at Source (TDS) applies on the gross value of crypto transactions to track market activity.",
            extraSection: {
                title: "When TDS applies",
                items: [
                    "Buy, sell, or crypto-to-crypto transfers",
                    "Applies once aggregate transactions exceed ₹10,000 per year (general) or ₹50,000 per year (specified persons)"
                ]
            },
            clarifications: [
                "TDS is deducted on transaction value, not profit",
                "It is not an additional tax — it is adjustable against final liability",
                "In DeFi or self-custody transactions, TDS compliance may fall on the user"
            ],
            implication: "Frequent traders face liquidity blockage even if they are in losses."
        }
    },
    {
        title: "Isolated Losses",
        subtitle: "No Set-Off Rule",
        description: "Losses from one crypto asset cannot be set off against gains from another. Loss mining is ineffective.",
        accent: "text-red-500",
        border: "hover:border-red-500/50",
        content: {
            whatItMeans: "Losses from crypto transactions cannot be set off against any income, cannot be set off against gains from another crypto, and cannot be carried forward.",
            extraSection: {
                title: "What is allowed",
                items: [
                    "Only cost of acquisition can be deducted",
                    "No deduction for gas fees, exchange fees, or network charges",
                    "No deduction for portfolio losses"
                ]
            },
            clarifications: [],
            implication: "₹1,00,000 loss + ₹1,00,000 gain = tax on ₹1,00,000 (loss ignored). This makes loss harvesting ineffective."
        }
    },
    {
        title: "NFT & VDA",
        subtitle: "Broad Legal Definition",
        description: "NFTs, tokens, and any 'information or code or number or token' generated through cryptographic means are taxable.",
        accent: "text-pink-500",
        border: "hover:border-pink-500/50",
        content: {
            whatItMeans: "Indian law defines VDAs very broadly, covering cryptocurrencies, NFTs, governance tokens, utility tokens, and any cryptographic token representing value or rights.",
            clarifications: [
                "NFT sales are fully taxable",
                "Creator royalties are taxable income",
                "No distinction between 'art' NFTs and 'utility' NFTs",
                "Indian Central Bank Digital Currency (CBDC) is excluded"
            ],
            implication: "If it’s blockchain-based and transferable, it is likely taxable as a VDA."
        }
    },
    {
        title: "Cross-Border",
        subtitle: "Foreign Reporting",
        description: "Foreign exchange holdings must be declared in Schedule FA of your ITR. Penalties apply for non-disclosure.",
        accent: "text-cyan-500",
        border: "hover:border-cyan-500/50",
        content: {
            whatItMeans: "Crypto held on foreign exchanges or wallets may trigger foreign asset reporting obligations.",
            extraSection: {
                title: "Where reporting applies",
                items: [
                    "Schedule FA of Income Tax Return",
                    "Applies even if no sale occurred and no profit was made"
                ]
            },
            clarifications: [
                "Common examples: Binance holdings, Offshore exchanges, Self-custody wallets with foreign nexus",
                "Non-disclosure can attract penalties under the Income Tax Act",
                "Reporting obligation is separate from tax liability"
            ],
            implication: "Holding crypto abroad without selling may still require disclosure."
        }
    },
    {
        title: "Stablecoins & RWAs",
        subtitle: "Asset Classification",
        description: "USDT, USDC, and Tokenized Real World Assets are treated strictly as VDAs with full tax incidence.",
        accent: "text-orange-500",
        border: "hover:border-orange-500/50",
        content: {
            whatItMeans: "Stablecoins (USDT, USDC) and tokenized real-world assets are treated as VDAs. Stability or asset-backing does not create an exemption.",
            clarifications: [
                "Stability does not change tax treatment",
                "Transfers are treated as VDA transfers",
                "USDT → INR = taxable event",
                "USDC → ETH = taxable event",
                "Tokenized gold = taxable VDA transfer"
            ],
            implication: "“Low volatility” ≠ “low tax exposure”."
        }
    }
];

export function TaxRulesGrid() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rules.map((rule, index) => (
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <Card
                                className={cn(
                                    "bg-white/5 border-white/10 backdrop-blur-sm transition-all duration-300 group cursor-pointer h-full hover:bg-white/10",
                                    rule.border
                                )}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-mono text-gray-600">0{index + 1}</span>
                                        <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5", rule.accent)}>
                                            {rule.subtitle}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl font-space-grotesk text-white group-hover:text-primary transition-colors flex items-center justify-between">
                                        {rule.title}
                                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {rule.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0B0C10] border-gray-800 text-white max-w-2xl">
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xs font-mono text-gray-500">0{index + 1}</span>
                                    <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5", rule.accent)}>
                                        {rule.subtitle}
                                    </span>
                                </div>
                                <DialogTitle className="text-3xl font-space-grotesk">{rule.title}</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Comprehensive guide to {rule.subtitle} under current Indian law.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 mt-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                                {/* What it means */}
                                <section>
                                    <h4 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-2">What it means</h4>
                                    <p className="text-gray-300 leading-relaxed text-lg">
                                        {rule.content.whatItMeans}
                                    </p>
                                </section>

                                {/* Extra Section (if any) */}
                                {rule.content.extraSection && (
                                    <section>
                                        <h4 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-2">{rule.content.extraSection.title}</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-gray-300">
                                            {rule.content.extraSection.items.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </section>
                                )}

                                {/* Key Clarifications */}
                                <section>
                                    <h4 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-2">Key Clarifications</h4>
                                    <ul className="grid grid-cols-1 gap-2">
                                        {rule.content.clarifications.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-300 bg-gray-900/50 p-3 rounded text-sm border border-gray-800">
                                                <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0", rule.accent.replace('text-', 'bg-'))} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* Practical Implication */}
                                <section className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                                    <h4 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-2 flex items-center gap-2">
                                        <span className="text-xl">💡</span> Practical Implication
                                    </h4>
                                    <p className="text-white font-medium italic">
                                        "{rule.content.implication}"
                                    </p>
                                </section>
                            </div>
                        </DialogContent>
                    </Dialog>
                ))}
            </div>

            <div className="text-center pt-8 border-t border-gray-800/50">
                <p className="text-gray-500 italic text-lg font-light">
                    "Indian crypto taxation prioritizes traceability and revenue certainty over investment incentives. Understanding the rules matters more than optimizing trades."
                </p>
            </div>
        </div>
    );
}
