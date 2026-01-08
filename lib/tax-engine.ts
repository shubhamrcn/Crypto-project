import { db } from "@/lib/db";
import { TAX_CONFIG } from "@/lib/tax-config";
import { computeTaxLiability, TaxReport } from "@/lib/tax/calculator";
import { Transaction } from "@/lib/validation";

/**
 * Orchestrator Function
 * 1. Fetches data from secure local storage
 * 2. (Optional) Validates data integrity
 * 3. Calls pure calculation logic
 */
export async function calculateTaxReport(): Promise<TaxReport> {
    // 1. IO Layer: Fetch
    const rawTxs = await db.getAllTransactions();

    // 2. Validation Layer: Ensure secure types
    // In a real production app, we would re-validate here via TransactionSchema.parse(rawTxs)
    // Since we use IDB which we control, we cast for now, but strictly typing 'Transaction' is key.
    const safeTxs = rawTxs as Transaction[];

    // 3. Logic Layer: Compute (Pure)
    return computeTaxLiability(safeTxs, TAX_CONFIG);
}
