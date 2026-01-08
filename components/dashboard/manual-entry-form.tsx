
"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/db";
import { Loader2 } from "lucide-react";

export function ManualEntryForm({ onEntryAdded }: { onEntryAdded: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: "",
        type: "BUY",
        asset: "",
        amount: "",
        price: "",
        fee: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const totalInfo = parseFloat(formData.amount) * parseFloat(formData.price);

            await db.addTransaction({
                id: uuidv4(),
                date: new Date(formData.date).toISOString(),
                type: formData.type as any,
                asset: formData.asset.toUpperCase(),
                amount: parseFloat(formData.amount),
                price: parseFloat(formData.price),
                totalInfo,
                fee: parseFloat(formData.fee || "0"),
                source: "MANUAL",
            });

            setFormData({
                date: "",
                type: "BUY",
                asset: "",
                amount: "",
                price: "",
                fee: "",
            });

            onEntryAdded();
        } catch (error) {
            console.error("Failed to add transaction", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <h3 className="text-lg font-medium text-white mb-4">Manual Entry</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                        type="datetime-local"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(val) => setFormData({ ...formData, type: val })}
                    >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BUY">Buy</SelectItem>
                            <SelectItem value="SELL">Sell</SelectItem>
                            <SelectItem value="TRANSFER">Transfer</SelectItem>
                            <SelectItem value="INCOME">Income</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Asset (e.g. BTC)</Label>
                    <Input
                        required
                        placeholder="BTC"
                        value={formData.asset}
                        onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white uppercase"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                        type="number"
                        step="any"
                        required
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label>INR Value</Label>
                    <Input
                        type="number"
                        step="any"
                        required
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Fee (INR)</Label>
                    <Input
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={formData.fee}
                        onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                    />
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Add Transaction"}
            </Button>
        </form>
    );
}
