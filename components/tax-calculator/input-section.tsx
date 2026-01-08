"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function InputSection() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="asset">Asset Symbol</Label>
                    <Input id="asset" placeholder="e.g. ETH" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" placeholder="0.00" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input id="price" type="number" placeholder="0.00" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" className="bg-background/50" />
                </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
        </div>
    );
}
