# Legal & Usage Assumptions (India FY 2026-27)

**DISCLAIMER:** This software provides *computational assistance* based on a strict interpretation of Indian Tax Law. It is NOT legal advice.

## 1. Core Tax Rules (Section 115BBH)
We assume the strict reading of Section 115BBH:
*   **Flat Rate:** 30% on all gains.
*   **No Slab Benefits:** The 30% rate applies from ₹1 of profit, regardless of user's income slab.
*   **No Loss Set-Off:** Losses in one asset (e.g., ETH) CANNOT offset gains in another (e.g., BTC).
    *   *Implementation:* We allow `profit` to be taxed, but `losses` are capped at 0 taxable value.
    *   *Result:* Your "Taxable Income" may be higher than your "Net Portfolio Profit".

## 2. Cost Basis Method
*   **FIFO (First-In, First-Out):** We strictly use FIFO for all calculations. This is standard accounting practice in India absent specific guidance permitting Weighted Average.
*   **Inventory Tracking:** We track "batches" of inventory per asset.

## 3. Section 194S (TDS)
*   **Assumption:** We do NOT calculate TDS liability for you to pay. We assume exchanges have deducted it.
*   **Display:** We calculate the *tax liability* (30%) but do not subtract TDS paid from the final figure, as we don't know if TDS was actually deducted.
*   **Responsibility:** You must cross-verify TDS credits in Form 26AS.

## 4. Transfers & Self-Transfers
*   **Assumption:** Transfers between *own wallets* are tax-neutral.
*   **Warning:** If you transfer to a *DEX* (Swap), that is a taxable "Transfer" event, not a self-transfer.
*   **Gas Fees:** We currently do NOT treat gas fees as a deductible expense ("Cost of Transfer"), as 115BBH allows strict "Cost of Acquisition" only. This is a conservative stance to prevent under-reporting.

## 5. Stablecoins / Classification
*   **Rule:** USDT/USDC are treated exactly as VDAs (Virtual Digital Assets).
*   **Implication:** Selling USDT for INR is a taxable event if (Sale Price > Purchase Price).
