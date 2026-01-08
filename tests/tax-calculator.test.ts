import { describe, it, expect } from 'vitest';
import { computeTaxLiability } from '../lib/tax/calculator';
import { Transaction } from '../lib/validation';
import { TaxConfig } from '../lib/tax-config';

// Mock Config
const MOCK_CONFIG: TaxConfig = {
    fiscalYear: "2026-27",
    taxRate: 0.30,
    cess: 0.04,
    tds: 0.01,
    allowLossSetOff: false,
    allowCarryForward: false,
    defaultAssetClass: "VDA"
};

describe('India Crypto Tax Calculator (Section 115BBH)', () => {

    it('should calculate 30% tax on a simple profitable trade', () => {
        const txs: Transaction[] = [
            {
                id: '1', date: '2024-01-01', type: 'BUY', asset: 'BTC', amount: 1, totalInfo: 100000,
                price: 100000, fee: 0, source: 'Manual'
            },
            {
                id: '2', date: '2024-02-01', type: 'SELL', asset: 'BTC', amount: 1, totalInfo: 150000,
                price: 150000, fee: 0, source: 'Manual'
            }
        ];

        const report = computeTaxLiability(txs, MOCK_CONFIG);

        expect(report.totalGains).toBe(50000); // 150k - 100k
        expect(report.totalTax).toBe(15000);   // 30% of 50k
        expect(report.totalCess).toBe(600);    // 4% of 15k
        expect(report.finalTaxLiability).toBe(15600);
    });

    it('should ignore losses (No Set-Off Rule)', () => {
        const txs: Transaction[] = [
            // Trade 1: Profit of 50k
            { id: '1', date: '2024-01-01', type: 'BUY', asset: 'BTC', amount: 1, totalInfo: 100000, price: 100000, fee: 0, source: 'Manual' },
            { id: '2', date: '2024-02-01', type: 'SELL', asset: 'BTC', amount: 1, totalInfo: 150000, price: 150000, fee: 0, source: 'Manual' },

            // Trade 2: Loss of 50k
            { id: '3', date: '2024-01-01', type: 'BUY', asset: 'ETH', amount: 10, totalInfo: 200000, price: 20000, fee: 0, source: 'Manual' },
            { id: '4', date: '2024-02-01', type: 'SELL', asset: 'ETH', amount: 10, totalInfo: 150000, price: 15000, fee: 0, source: 'Manual' }
        ];

        const report = computeTaxLiability(txs, MOCK_CONFIG);

        // Gain: 50,000. Loss: -50,000. Net Profit: 0.
        // BUT Taxable Income = 50,000 (Loss ignored).

        expect(report.totalGains).toBe(50000);
        const tax = 50000 * 0.30;
        expect(report.finalTaxLiability).toBe(tax + (tax * 0.04));
    });

    it('should correctly handle FIFO cost basis', () => {
        const txs: Transaction[] = [
            // Buy 1: 1 BTC @ 10k
            { id: '1', date: '2024-01-01', type: 'BUY', asset: 'BTC', amount: 1, totalInfo: 10000, price: 10000, fee: 0, source: 'Manual' },
            // Buy 2: 1 BTC @ 20k
            { id: '2', date: '2024-02-01', type: 'BUY', asset: 'BTC', amount: 1, totalInfo: 20000, price: 20000, fee: 0, source: 'Manual' },
            // Sell 1: 1 BTC @ 30k (Should consume Buy 1)
            { id: '3', date: '2024-03-01', type: 'SELL', asset: 'BTC', amount: 1, totalInfo: 30000, price: 30000, fee: 0, source: 'Manual' }
        ];

        const report = computeTaxLiability(txs, MOCK_CONFIG);
        const sellDetails = report.details.find(d => d.type === 'SELL');

        expect(sellDetails).toBeDefined();
        // Cost basis should be 10,000 (from first buy), not 20,000 or 15,000
        expect(sellDetails?.costBasis).toBe(10000);
        expect(sellDetails?.profit).toBe(20000); // 30k - 10k
    });

    it('should handle partial sells (Split Cost Basis)', () => {
        const txs: Transaction[] = [
            // Buy: 2 BTC @ 100k total (50k each)
            { id: '1', date: '2024-01-01', type: 'BUY', asset: 'BTC', amount: 2, totalInfo: 100000, price: 50000, fee: 0, source: 'Manual' },
            // Sell: 1 BTC @ 60k
            { id: '2', date: '2024-02-01', type: 'SELL', asset: 'BTC', amount: 1, totalInfo: 60000, price: 60000, fee: 0, source: 'Manual' }
        ];

        const report = computeTaxLiability(txs, MOCK_CONFIG);
        const sellDetails = report.details[0];

        // Cost basis for 1 BTC should be 50k
        expect(sellDetails.costBasis).toBe(50000);
        expect(sellDetails.profit).toBe(10000); // 60k - 50k
    });

    it('should zero out taxable amount for pure loss trades', () => {
        const txs: Transaction[] = [
            { id: '1', date: '2024-01-01', type: 'BUY', asset: 'DOGE', amount: 1000, totalInfo: 10000, price: 10, fee: 0, source: 'Manual' },
            { id: '2', date: '2024-02-01', type: 'SELL', asset: 'DOGE', amount: 1000, totalInfo: 5000, price: 5, fee: 0, source: 'Manual' }
        ];

        const report = computeTaxLiability(txs, MOCK_CONFIG);

        expect(report.totalGains).toBe(0); // No gains to report
        expect(report.finalTaxLiability).toBe(0);
        expect(report.details[0].taxableAmount).toBe(0); // 0 despite -5000 profit
    });

});
