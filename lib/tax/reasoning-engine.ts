
export interface TaxLog {
    ruleId: string;
    sectionReference: string;
    explanation: string;
    type: 'TAXABLE' | 'NON_TAXABLE' | 'LOSS_IGNORED' | 'TDS_APPLICABLE';
}

export const TAX_LAW_MAP = {
    '115BBH_GAIN': {
        section: "Section 115BBH(1)",
        text: "Income from transfer of Virtual Digital Assets is taxed at a flat rate of 30%."
    },
    '115BBH_LOSS': {
        section: "Section 115BBH(2)(b)",
        text: "No set-off of loss from transfer of VDA allowed against any other income (including other VDA gains)."
    },
    '194S_TDS': {
        section: "Section 194S",
        text: "TDS @ 1% is applicable on consideration for transfer of VDA if aggregate value exceeds threshold."
    }
};

export function getReasoning(profit: number, type: string): TaxLog {
    if (profit > 0) {
        return {
            ruleId: '115BBH_GAIN',
            sectionReference: TAX_LAW_MAP['115BBH_GAIN'].section,
            explanation: "Taxable Gain. Flat 30% tax applies.",
            type: 'TAXABLE'
        };
    } else if (profit < 0) {
        return {
            ruleId: '115BBH_LOSS',
            sectionReference: TAX_LAW_MAP['115BBH_LOSS'].section,
            explanation: "Loss Ignored. Cannot be set off against gains.",
            type: 'LOSS_IGNORED'
        };
    }
    return {
        ruleId: 'NEUTRAL',
        sectionReference: "N/A",
        explanation: "No PnL event.",
        type: 'NON_TAXABLE'
    };
}
