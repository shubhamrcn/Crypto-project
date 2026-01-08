"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function SimpleTaxForm() {
    const [salePrice, setSalePrice] = useState<string>("");
    const [purchasePrice, setPurchasePrice] = useState<string>("");

    const sale = parseFloat(salePrice) || 0;
    const purchase = parseFloat(purchasePrice) || 0;
    const profit = sale - purchase;
    const tax = profit > 0 ? profit * 0.30 : 0;

    return (
        <div className="w-full max-w-lg mx-auto relative z-20">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

            <Card className="relative bg-[#0B0C10]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                <CardHeader className="space-y-1 pb-8 text-center border-b border-white/5 bg-white/5">
                    <CardTitle className="text-2xl font-space-grotesk font-bold text-white">
                        Tax Estimator
                    </CardTitle>
                    <p className="text-sm text-gray-400">
                        Calculate your 30% tax liability instantly
                    </p>
                </CardHeader>

                <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sale-price" className="text-gray-300">Sale Price (₹)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <Input
                                    id="sale-price"
                                    type="number"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(e.target.value)}
                                    placeholder="0.00"
                                    className="pl-8 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary focus-visible:border-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purchase-price" className="text-gray-300">Purchase Price (₹)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <Input
                                    id="purchase-price"
                                    type="number"
                                    value={purchasePrice}
                                    onChange={(e) => setPurchasePrice(e.target.value)}
                                    placeholder="0.00"
                                    className="pl-8 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-primary focus-visible:border-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Results Container */}
                    <div className="rounded-xl bg-white/5 border border-white/10 p-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Net Profit</span>
                            <span className={cn("font-mono font-medium", profit >= 0 ? "text-green-400" : "text-red-400")}>
                                {profit >= 0 ? "+" : ""}₹{profit.toLocaleString('en-IN')}
                            </span>
                        </div>

                        <div className="h-px bg-white/10" />

                        <div className="flex justify-between items-center">
                            <span className="text-gray-200 font-medium">Est. Tax (30%)</span>
                            <span className="text-2xl font-space-grotesk font-bold text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                                ₹{tax.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
