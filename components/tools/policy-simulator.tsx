"use client";

import { useState, useEffect } from "react";
import { calculateTaxReport } from "@/lib/tax-engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowUpRight, Scale } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function PolicySimulator() {
    // Defines the 'Current Law' state vs 'Simulated' state
    const [simulatedConfig, setSimulatedConfig] = useState({
        allowLossSetOff: false,
        taxRate: 0.30, // 30%
        allowCarryForward: false
    });

    const [currentStats, setCurrentStats] = useState<any>(null);
    const [simulatedStats, setSimulatedStats] = useState<any>(null);

    useEffect(() => {
        // 1. Calculate Baseline (Real Law)
        calculateTaxReport().then(setCurrentStats);
    }, []);

    useEffect(() => {
        // 2. Calculate Simulation
        // We need to extend the tax engine to accept overrides, or we mock it here for the UI demo.
        // For a true diverse simulation, we'd refactor calculateTaxReport to accept a config object.
        // Let's implement a client-side simulation logic here based on the 'currentStats' details if available, 
        // to avoid refactoring the entire engine heavily right now.

        if (!currentStats) return;

        let simTotalGains = 0;
        let simLosses = 0;

        // Re-aggregate based on new rules
        currentStats.details.forEach((tx: any) => {
            if (tx.profit > 0) {
                simTotalGains += tx.profit;
            } else {
                simLosses += Math.abs(tx.profit);
            }
        });

        const netTaxable = simulatedConfig.allowLossSetOff
            ? Math.max(0, simTotalGains - simLosses)
            : simTotalGains;

        const simTax = netTaxable * simulatedConfig.taxRate;
        const simCess = simTax * 0.04;

        setSimulatedStats({
            totalGains: netTaxable,
            totalTax: simTax,
            totalCess: simCess,
            finalTaxLiability: simTax + simCess,
            savings: currentStats.finalTaxLiability - (simTax + simCess)
        });

    }, [simulatedConfig, currentStats]);

    if (!currentStats) return null;

    return (
        <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Scale className="h-5 w-5 text-indigo-400" />
                    Policy Simulator
                </CardTitle>
                <p className="text-gray-500 text-xs">Test the impact of fairer tax laws on your portfolio.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Controls */}
                <div className="space-y-4 p-4 bg-gray-950/50 rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="loss-set-off" className="flex flex-col">
                            <span className="text-gray-300">Allow Loss Set-off?</span>
                            <span className="text-xs text-gray-500">Offset crypto losses against gains</span>
                        </Label>
                        <Switch
                            id="loss-set-off"
                            checked={simulatedConfig.allowLossSetOff}
                            onCheckedChange={(c) => setSimulatedConfig(prev => ({ ...prev, allowLossSetOff: c }))}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label className="text-gray-300">Tax Rate</Label>
                            <span className="text-sm font-mono text-indigo-400">{(simulatedConfig.taxRate * 100).toFixed(0)}%</span>
                        </div>
                        <Slider
                            value={[simulatedConfig.taxRate * 100]}
                            min={0}
                            max={30}
                            step={5}
                            onValueChange={(val) => setSimulatedConfig(prev => ({ ...prev, taxRate: val[0] / 100 }))}
                            className="py-2"
                        />
                    </div>
                </div>

                {/* Comparison Table */}
                <Table>
                    <TableHeader>
                        <TableRow className="border-gray-800 hover:bg-transparent">
                            <TableHead className="text-gray-500">Metric</TableHead>
                            <TableHead className="text-right text-gray-500">Current Law</TableHead>
                            <TableHead className="text-right text-indigo-400">Simulated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-gray-800">
                            <TableCell className="text-gray-400">Taxable Income</TableCell>
                            <TableCell className="text-right">₹{Math.round(currentStats.totalGains).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-bold text-white">
                                ₹{Math.round(simulatedStats?.totalGains || 0).toLocaleString()}
                            </TableCell>
                        </TableRow>
                        <TableRow className="border-gray-800">
                            <TableCell className="text-gray-400">Tax Liability</TableCell>
                            <TableCell className="text-right text-red-400">₹{Math.round(currentStats.finalTaxLiability).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-bold text-indigo-400">
                                ₹{Math.round(simulatedStats?.finalTaxLiability || 0).toLocaleString()}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Savings Callout */}
                {simulatedStats?.savings > 0 && (
                    <div className="p-3 bg-green-900/20 border border-green-900/50 rounded flex items-center justify-between">
                        <span className="text-green-400 text-sm">Potential Savings</span>
                        <span className="text-green-400 font-bold font-mono flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" />
                            ₹{Math.round(simulatedStats.savings).toLocaleString()}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
