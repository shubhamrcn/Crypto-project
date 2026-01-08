import { Transaction } from "@/lib/validation";
import { TaxConfig } from "@/lib/tax-config";
import { getReasoning, TaxLog } from "@/lib/tax/reasoning-engine";

export interface TaxReportDetails {
    txId: string;
    asset: string;
    date: string;
    type: string;
    costBasis: number;
    saleValue: number;
    profit: number;
    taxableAmount: number; // 0 if loss
    reasoning: TaxLog;
}

export interface TaxReport {
    totalGains: number;
    totalTax: number;
    totalCess: number;
    finalTaxLiability: number;
    details: TaxReportDetails[];
}

interface BalanceBatch {
    quantity: number;
    cost: number; // Total cost for this batch
    date: string;
}

/**
 * PURE FUNCTION: Calculates Tax Report based on input transactions and config.
 * Deterministic: Identical inputs always produce identical outputs.
 * No Side Effects: Does not read DB or external APIs.
 */
export function computeTaxLiability(
    transactions: Transaction[],
    config: TaxConfig
): TaxReport {
    // 1. Sort by date (Strict FIFO requirement)
    // Create a copy to avoid mutating the input array
    const sortedTxs = [...transactions].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 2. FIFO Bucket Strategy (Inventory Tracking)
    const balances: Record<string, BalanceBatch[]> = {};
    const reportDetails: TaxReportDetails[] = [];

    let totalGains = 0;

    for (const tx of sortedTxs) {
        if (!balances[tx.asset]) balances[tx.asset] = [];

        // --- BUY / INCOME LOGIC ---
        if (tx.type === 'BUY' || tx.type === 'INCOME') {
            balances[tx.asset].push({
                quantity: tx.amount,
                cost: tx.totalInfo, // cost basis in INR
                date: tx.date
            });

            // Income is fully taxable on receipt (e.g. Airdrop, Salary)
            if (tx.type === 'INCOME') {
                totalGains += tx.totalInfo;
                reportDetails.push({
                    txId: tx.id,
                    asset: tx.asset,
                    date: tx.date,
                    type: tx.type,
                    costBasis: 0,
                    saleValue: tx.totalInfo,
                    profit: tx.totalInfo,
                    taxableAmount: tx.totalInfo,
                    reasoning: getReasoning(tx.totalInfo, 'INCOME')
                });
            }

            // --- SELL LOGIC ---
        } else if (tx.type === 'SELL') {
            let remainingToSell = tx.amount;
            let costBasis = 0;

            // FIFO Consumption Loop
            while (remainingToSell > 0 && balances[tx.asset].length > 0) {
                const batch = balances[tx.asset][0]; // First in

                if (batch.quantity <= remainingToSell) {
                    // Consume whole batch
                    costBasis += batch.cost;
                    remainingToSell -= batch.quantity;
                    balances[tx.asset].shift(); // Remove batch from inventory
                } else {
                    // Consume partial batch
                    const ratio = remainingToSell / batch.quantity;
                    const partialCost = batch.cost * ratio;

                    costBasis += partialCost;

                    // Update batch state
                    batch.cost -= partialCost;
                    batch.quantity -= remainingToSell;
                    remainingToSell = 0;
                }
            }

            // Calculation
            const saleValue = tx.totalInfo;
            const profit = saleValue - costBasis;

            // Rule: Section 115BBH - No Loss Set-off
            // If profit is negative (Loss), it cannot offset other gains. Taxable amount is 0.
            const taxableAmount = profit > 0 ? profit : 0;

            if (profit > 0) {
                totalGains += profit;
            }

            reportDetails.push({
                txId: tx.id,
                asset: tx.asset,
                date: tx.date,
                type: tx.type,
                costBasis: costBasis,
                saleValue: saleValue,
                profit: profit,
                taxableAmount: taxableAmount,
                reasoning: getReasoning(profit, 'SELL')
            });
        }
        // Transfers are usually tax-neutral self-transfers, but in some strict interpretations 
        // gas fees might be realized. For now, we assume self-transfers are ignored PnL events.
    }

    const totalTax = totalGains * config.taxRate;
    const totalCess = totalTax * config.cess;
    const finalTaxLiability = totalTax + totalCess;

    return {
        totalGains,
        totalTax,
        totalCess,
        finalTaxLiability,
        details: reportDetails
    };
}
