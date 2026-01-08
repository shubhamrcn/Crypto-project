"use client";

import { useEffect, useState } from "react";
import { calculateTaxReport } from "@/lib/tax-engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function CAModePage() {
    const [report, setReport] = useState<any>(null);

    useEffect(() => {
        calculateTaxReport().then(setReport);
    }, []);

    if (!report) return <div className="p-8 text-white">Generating Audit Trail...</div>;

    return (
        <div className="min-h-screen bg-[#0B0C10] text-gray-100 p-8 font-mono text-sm">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center border-b border-gray-800 pb-6">
                    <div>
                        <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white mb-2">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-widest">
                            CA Audit Mode // FY 2026-27
                        </h1>
                        <p className="text-gray-500 text-xs mt-1">
                            Strict Compliance View • Section 115BBH • FIFO Basis
                        </p>
                    </div>
                    <Button variant="outline" className="border-gray-700 font-mono text-xs">
                        <Download className="h-3 w-3 mr-2" />
                        Export Audit Log
                    </Button>
                </div>

                {/* Summary Table */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-mono text-gray-400 uppercase">Assessment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-800 hover:bg-transparent">
                                    <TableHead className="text-gray-500">Head</TableHead>
                                    <TableHead className="text-right text-gray-500">Value (INR)</TableHead>
                                    <TableHead className="text-gray-500">Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="border-gray-800">
                                    <TableCell>Total Taxable Gains</TableCell>
                                    <TableCell className="text-right text-green-500">₹{report.totalGains.toLocaleString()}</TableCell>
                                    <TableCell className="text-gray-600 text-xs">Aggregated positive PnL only</TableCell>
                                </TableRow>
                                <TableRow className="border-gray-800">
                                    <TableCell>Tax Liability (30%)</TableCell>
                                    <TableCell className="text-right text-red-500">₹{report.totalTax.toLocaleString()}</TableCell>
                                    <TableCell className="text-gray-600 text-xs">u/s 115BBH(1)</TableCell>
                                </TableRow>
                                <TableRow className="border-gray-800">
                                    <TableCell>Cess (4%)</TableCell>
                                    <TableCell className="text-right text-orange-500">₹{report.totalCess.toLocaleString()}</TableCell>
                                    <TableCell className="text-gray-600 text-xs">Health & Education Cess</TableCell>
                                </TableRow>
                                <TableRow className="border-gray-800 font-bold bg-white/5">
                                    <TableCell>Net Payable</TableCell>
                                    <TableCell className="text-right text-white">₹{report.finalTaxLiability.toLocaleString()}</TableCell>
                                    <TableCell className="text-gray-600 text-xs">Final Demand</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Detailed Line Items */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-mono text-gray-400 uppercase">Transaction Audit Trail</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-800 hover:bg-transparent">
                                    <TableHead className="w-[100px] text-gray-500">Date</TableHead>
                                    <TableHead className="text-gray-500">Ref ID</TableHead>
                                    <TableHead className="text-gray-500">Event</TableHead>
                                    <TableHead className="text-right text-gray-500">Cost Basis</TableHead>
                                    <TableHead className="text-right text-gray-500">Sale Value</TableHead>
                                    <TableHead className="text-right text-gray-500">PnL (Real)</TableHead>
                                    <TableHead className="text-right text-gray-500">Taxable</TableHead>
                                    <TableHead className="w-[200px] text-gray-500">Legal Remark</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {report.details.map((tx: any) => (
                                    <TableRow key={tx.txId} className="border-gray-800 hover:bg-gray-800/50">
                                        <TableCell className="text-gray-400">{new Date(tx.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-gray-600 text-xs font-mono">{tx.txId.slice(0, 8)}...</TableCell>
                                        <TableCell>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] border ${tx.type === 'SELL' ? 'border-blue-900 text-blue-400' : 'border-green-900 text-green-400'
                                                }`}>
                                                {tx.type} {tx.asset}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-gray-400">₹{Math.round(tx.costBasis).toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-gray-400">₹{Math.round(tx.saleValue).toLocaleString()}</TableCell>

                                        {/* Real PnL Column */}
                                        <TableCell className={`text-right ${tx.profit < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {tx.profit > 0 ? '+' : ''}{Math.round(tx.profit).toLocaleString()}
                                        </TableCell>

                                        {/* Taxable Amount Column (Loss Ignored) */}
                                        <TableCell className="text-right font-bold text-white">
                                            ₹{Math.round(tx.taxableAmount).toLocaleString()}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-gray-500">{tx.reasoning.ruleId}</span>
                                                <span className="text-xs text-gray-300">{tx.reasoning.explanation}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
