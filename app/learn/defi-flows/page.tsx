"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function DeFiFlowsPage() {
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true, theme: 'dark' });
        mermaid.contentLoaded();
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0C10] text-gray-100 p-8 font-space-grotesk">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center mb-6 text-sm font-mono">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Vault
                    </Link>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Visualizing DeFi Tax Traps
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                        DeFi protocols compose money like lego blocks. Unfortunately, Indian tax law sees every Lego snap as a taxable event.
                    </p>
                </div>

                <div className="grid gap-12">
                    {/* Scenario 1: Swapping */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Badge className="bg-blue-900/50 text-blue-300 border-blue-800">Scenario A</Badge>
                            <h2 className="text-2xl font-bold text-white">Token Swap (Uniswap)</h2>
                        </div>
                        <Card className="bg-gray-900 border-gray-800 p-6">
                            <div className="mermaid flex justify-center py-8 bg-gray-950 rounded-lg">
                                {`
                                graph LR
                                    A[USDC Wallet] -- "Swap" --> B((Uniswap Pool))
                                    B -- "Receive ETH" --> C[ETH Wallet]
                                    
                                    style A fill:#1e1e1e,stroke:#333
                                    style B fill:#3b0764,stroke:#a855f7
                                    style C fill:#1e1e1e,stroke:#333
                                    
                                    linkStyle 0 stroke:#666,stroke-width:2px;
                                    linkStyle 1 stroke:#22c55e,stroke-width:2px;
                                `}
                            </div>
                            <CardContent className="pt-6 space-y-2">
                                <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-lg">
                                    <h4 className="font-bold text-red-400 mb-1 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2" /> Tax Event: Transfer of VDA
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Swapping USDC for ETH is treated as <strong>selling USDC</strong>. Any gain on the USDC value since acquisition is taxable at 30%.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Scenario 2: Liquidity Provision */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Badge className="bg-purple-900/50 text-purple-300 border-purple-800">Scenario B</Badge>
                            <h2 className="text-2xl font-bold text-white">Liquidity Provision (LP)</h2>
                        </div>
                        <Card className="bg-gray-900 border-gray-800 p-6">
                            <div className="mermaid flex justify-center py-8 bg-gray-950 rounded-lg">
                                {`
                                graph LR
                                    A[ETH + USDC] -- "Deposit" --> B((Liquidity Pool))
                                    B -- "Mint LP Token" --> C[LP Token Wallet]
                                    C -- "Stake" --> D{Farm Contract}
                                    
                                    style A fill:#1e1e1e,stroke:#333
                                    style B fill:#3b0764,stroke:#a855f7
                                    style C fill:#1e1e1e,stroke:#333
                                    style D fill:#172554,stroke:#3b82f6
                                `}
                            </div>
                            <CardContent className="pt-6 space-y-4">
                                <div className="p-4 bg-orange-950/20 border border-orange-900/50 rounded-lg">
                                    <h4 className="font-bold text-orange-400 mb-1 flex items-center">
                                        <ArrowRight className="h-4 w-4 mr-2" /> Tax Event: Crypto-to-Crypto Trade
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Depositing tokens to receive an "LP Token" is technically an exchange of assets. You "sold" ETH+USDC to "buy" the LP Token. Taxable at 30% if value appreciated.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
}
