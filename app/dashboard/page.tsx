
"use client";

import { useState, useCallback, useEffect } from "react";
import { ManualEntryForm } from "@/components/dashboard/manual-entry-form";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseCSV } from "@/lib/csv-parser";
import { db } from "@/lib/db";
import { calculateTaxReport } from "@/lib/tax-engine";
import { generateAuditReport } from "@/lib/report-generator";
import { Download, Upload, AlertTriangle, CheckCircle, Calculator, Info, ShieldCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { v4 as uuidv4 } from "uuid";
import { PolicySimulator } from "@/components/tools/policy-simulator";
import Link from "next/link";

export default function Dashboard() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [stats, setStats] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Refresh stats whenever transactions change
    useEffect(() => {
        calculateTaxReport().then(setStats);
    }, [refreshTrigger]);

    const handleManualEntry = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const loadSampleData = async () => {
        const sampleTxs = [
            { id: uuidv4(), date: new Date("2025-04-10").toISOString(), type: 'BUY', asset: 'BTC', amount: 0.5, price: 3000000, totalInfo: 1500000, fee: 0, source: 'SAMPLE' },
            { id: uuidv4(), date: new Date("2025-06-15").toISOString(), type: 'SELL', asset: 'BTC', amount: 0.2, price: 4000000, totalInfo: 800000, fee: 0, source: 'SAMPLE' }, // Gain
            { id: uuidv4(), date: new Date("2026-01-20").toISOString(), type: 'BUY', asset: 'ETH', amount: 10, price: 150000, totalInfo: 1500000, fee: 0, source: 'SAMPLE' },
            { id: uuidv4(), date: new Date("2026-03-10").toISOString(), type: 'SELL', asset: 'ETH', amount: 5, price: 100000, totalInfo: 500000, fee: 0, source: 'SAMPLE' }, // Loss (Ignored)
        ];

        for (const tx of sampleTxs) {
            await db.addTransaction(tx as any);
        }
        setRefreshTrigger(prev => prev + 1);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, source: string) => {
        if (!e.target.files?.length) return;
        setIsUploading(true);
        try {
            const file = e.target.files[0];
            const txs = await parseCSV(file, source);

            for (const tx of txs) {
                await db.addTransaction(tx as any);
            }

            setRefreshTrigger(prev => prev + 1);
            alert(`Successfully imported ${txs.length} transactions from ${source}`);
        } catch (error) {
            console.error(error);
            alert("Failed to parse CSV. Please check the format.");
        } finally {
            setIsUploading(false);
        }
    };

    const downloadReport = async () => {
        try {
            const blob = await generateAuditReport();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Tax_Audit_Report_${new Date().getFullYear()}.zip`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (e) {
            console.error(e);
            alert("Failed to generate report");
        }
    };

    const clearData = async () => {
        if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
            await db.clearAll();
            setRefreshTrigger(prev => prev + 1);
        }
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-[#0B0C10] text-gray-100 p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold font-space-grotesk text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                                Your Private Tax Vault
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Privacy-First. Local Storage. No Server Tracking.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <Link href="/dashboard/ca-mode" className="w-full md:w-auto">
                                <Button variant="outline" className="w-full md:w-auto border-indigo-500/50 text-indigo-400 hover:bg-indigo-950/30">
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    CA Mode
                                </Button>
                            </Link>
                            <Button variant="outline" onClick={loadSampleData} className="flex-1 md:flex-none border-gray-700 hover:bg-gray-800 text-gray-300">
                                Load Sample Data
                            </Button>
                            <Button variant="destructive" onClick={clearData} className="flex-1 md:flex-none">
                                Reset
                            </Button>
                            <Button onClick={downloadReport} className="w-full md:w-auto bg-green-600 hover:bg-green-700">
                                <Download className="mr-2 h-4 w-4" />
                                Download Zip
                            </Button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="p-6 bg-gray-900/50 border-gray-800">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Gains</h3>
                            <div className="text-2xl font-bold text-green-500">
                                ₹{stats?.totalGains.toLocaleString() || "0.00"}
                            </div>
                            <p className="text-xs text-secondary mt-1 font-mono bg-secondary/10 inline-block px-1 rounded">
                                Strictly calculated per Sec 115BBH
                            </p>
                        </Card>

                        <Card className="p-6 bg-gray-900/50 border-gray-800">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Tax Payable (30%)</h3>
                            <div className="text-2xl font-bold text-red-500">
                                ₹{stats?.totalTax.toLocaleString() || "0.00"}
                            </div>
                        </Card>

                        <Card className="p-6 bg-gray-900/50 border-gray-800">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-sm font-medium text-gray-500">Cess (4%)</h3>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="h-3 w-3 text-gray-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Health & Education Cess charged<br />on the income tax amount.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="text-2xl font-bold text-orange-500">
                                ₹{stats?.totalCess.toLocaleString() || "0.00"}
                            </div>
                        </Card>

                        <Card className="p-6 bg-gray-900/50 border-white/10 relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-sm font-medium text-gray-400">Final Liability</h3>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="h-3 w-3 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Total Tax + Cess to be paid.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="text-3xl font-bold text-white relative z-10">
                                ₹{stats?.finalTaxLiability.toLocaleString() || "0.00"}
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <Calculator size={100} />
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Input Methods */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="p-6 bg-gray-900/50 border-gray-800">
                                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                                    <Upload className="mr-2 h-5 w-5 text-primary" />
                                    Import Exchange Data
                                </h3>

                                <Tabs defaultValue="wazirx" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                                        <TabsTrigger value="wazirx">WazirX</TabsTrigger>
                                        <TabsTrigger value="coindcx">CoinDCX</TabsTrigger>
                                        <TabsTrigger value="binance">Binance</TabsTrigger>
                                    </TabsList>
                                    <p className="text-xs text-gray-500 mt-2 text-center">Spot trades only. Wallet CSV support (Coming Soon)</p>

                                    {['wazirx', 'coindcx', 'binance'].map((exchange) => (
                                        <TabsContent key={exchange} value={exchange} className="space-y-4 pt-4">
                                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                                <Input
                                                    type="file"
                                                    accept=".csv"
                                                    className="hidden"
                                                    id={`file-${exchange}`}
                                                    onChange={(e) => handleFileUpload(e, exchange.toUpperCase())}
                                                    disabled={isUploading}
                                                />
                                                <Label htmlFor={`file-${exchange}`} className="cursor-pointer">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Upload className="h-8 w-8 text-gray-400" />
                                                        <span className="text-sm text-gray-400">
                                                            {isUploading ? "Processing..." : `Upload ${exchange} csv`}
                                                        </span>
                                                    </div>
                                                </Label>
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </Card>

                            <ManualEntryForm onEntryAdded={handleManualEntry} />

                            <PolicySimulator />
                        </div>

                        {/* Right Column: Transaction List */}
                        <div className="lg:col-span-2">
                            <TransactionList refreshTrigger={refreshTrigger} />
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
