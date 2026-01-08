import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge"; // Ensure you have this or use standard div
import { getReasoning } from "@/lib/tax/reasoning-engine";

export function TransactionList({ refreshTrigger }: { refreshTrigger: number }) {
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        const fetchTx = async () => {
            const txs = await db.getAllTransactions();
            setTransactions(txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        };
        fetchTx();
    }, [refreshTrigger]);

    if (transactions.length === 0) {
        return (
            <Card className="p-8 text-center text-gray-500 bg-gray-900/30 border-gray-800">
                No transactions found. Upload a CSV or add manually.
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center text-gray-400 text-sm px-2">
                <span>Recent Activity</span>
                <span>{transactions.length} entries</span>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
                {transactions.map((tx) => {
                    // Calculate quick profit for display context (simplified)
                    // Note: Real profit calc is complex (FIFO), this is just for the reasoning context preview
                    // We assume 'SELL' has PnL context.
                    const isSell = tx.type === 'SELL';
                    const estimatedProfit = isSell ? (tx.totalInfo - (tx.amount * 0)) : 0; // Cost basis is unknown here without full engine run.
                    // Actually, let's just show general reasoning for the TYPE.

                    let reasoning = getReasoning(0, tx.type);
                    if (tx.type === 'SELL') {
                        // Default to taxable assumption for display
                        reasoning = getReasoning(1, tx.type);
                    } else if (tx.type === 'INCOME') {
                        reasoning = getReasoning(1, tx.type);
                    }

                    return (
                        <AccordionItem key={tx.id} value={tx.id} className="border-gray-800 border rounded-lg bg-gray-900/50 px-4">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex justify-between items-center w-full pr-4">
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-bold text-white flex items-center gap-2">
                                            {tx.type} {tx.asset}
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${reasoning.type === 'TAXABLE' ? 'border-red-500/50 text-red-400' :
                                                    reasoning.type === 'LOSS_IGNORED' ? 'border-orange-500/50 text-orange-400' :
                                                        'border-gray-700 text-gray-500'
                                                }`}>
                                                {reasoning.type.replace('_', ' ')}
                                            </span>
                                        </span>
                                        <span className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-white font-mono">{tx.amount} {tx.asset}</div>
                                        <div className="text-xs text-gray-400">₹{tx.totalInfo.toLocaleString()}</div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 border-t border-gray-800 mt-2">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-4 p-3 rounded bg-gray-950/50 border border-gray-800/50">
                                        <div className="min-w-[4px] h-full bg-blue-500 rounded-full" />
                                        <div>
                                            <p className="text-xs font-mono text-blue-400 mb-1">
                                                LEGAL REASONING // {reasoning.sectionReference}
                                            </p>
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                {reasoning.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
