
export const TAX_CONFIG = {
    // Fiscal Year for reporting
    fiscalYear: "2026-2027",

    // Tax Rates (as decimals)
    taxRate: 0.30,      // 30% Flat Tax
    cess: 0.04,         // 4% Health & Education Cess
    tds: 0.01,          // 1% TDS on Transfer

    // Strict Rules
    allowLossSetOff: false, // Cannot set off losses against gains
    allowCarryForward: false, // Cannot carry forward losses

    // Asset Classifications
    defaultAssetClass: "VDA", // Virtual Digital Asset
};

export type TaxConfig = typeof TAX_CONFIG;
