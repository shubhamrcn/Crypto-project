import { z } from 'zod';

// Primitive Validations
const CurrencyAmount = z.number()
    .min(0, { message: "Value cannot be negative" })
    .max(1_000_000_000, { message: "Value exceeds realistic limits" })
    .refine((val) => !isNaN(val) && isFinite(val), { message: "Invalid numeric value" });

const AssetSymbol = z.string()
    .min(2, { message: "Symbol too short" })
    .max(10, { message: "Symbol too long" })
    .regex(/^[A-Z0-9]+$/, { message: "Symbol must be alphanumeric uppercase" });

const TransactionDate = z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date.getFullYear() >= 2009 && date <= new Date();
}, { message: "Invalid date or future date" });

// Transaction Schema
export const TransactionSchema = z.object({
    id: z.string().uuid(),
    date: TransactionDate,
    type: z.enum(['BUY', 'SELL', 'TRANSFER', 'INCOME']),
    asset: AssetSymbol,
    amount: CurrencyAmount,
    price: CurrencyAmount.optional(), // Unit price
    totalInfo: CurrencyAmount, // Total valid in INR
    fee: CurrencyAmount.default(0),
    source: z.string().min(1).max(50),
    hash: z.string().optional()
});

export type Transaction = z.infer<typeof TransactionSchema>;

// CSV Row Schema (Lenient for ingress, STRICT for conversion)
export const CSVRowSchema = z.object({
    Date: z.string(),
    Type: z.string(),
    Asset: z.string(),
    Amount: z.string().or(z.number()),
    Total: z.string().or(z.number()),
    Price: z.string().or(z.number()).optional()
});

// Helper to safely parse and sanitize
export const validateTransaction = (data: unknown): { success: boolean, data?: Transaction, error?: string } => {
    const result = TransactionSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error.errors.map(e => `${e.path}: ${e.message}`).join(', ') };
};
