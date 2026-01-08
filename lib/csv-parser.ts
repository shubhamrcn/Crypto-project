
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

export interface TaxTransaction {
    id: string;
    date: string;
    type: 'BUY' | 'SELL' | 'TRANSFER' | 'INCOME';
    asset: string;
    amount: number;
    price: number;
    totalInfo: number;
    fee: number;
    source: string;
    hash?: string;
}

export const parseCSV = (file: File, source: string): Promise<TaxTransaction[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                try {
                    const transactions: TaxTransaction[] = results.data.map((row: any) => {
                        return mapRowToTransaction(row, source);
                    }).filter(tx => tx !== null) as TaxTransaction[];
                    resolve(transactions);
                } catch (error) {
                    reject(error);
                }
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};

const mapRowToTransaction = (row: any, source: string): TaxTransaction | null => {
    const id = uuidv4();

    try {
        switch (source) {
            case 'WAZIRX':
                // Example WazirX mapping (simplified)
                // Date, Volume, Symbol, Price, Fee, Total
                if (!row.Date || !row.Volume) return null;
                return {
                    id,
                    date: new Date(row.Date).toISOString(),
                    type: row.Side === 'buy' ? 'BUY' : 'SELL',
                    asset: row.Market.split('/')[0].toUpperCase(),
                    amount: parseFloat(row.Volume),
                    price: parseFloat(row.Price),
                    totalInfo: parseFloat(row.Total),
                    fee: parseFloat(row.Fee || '0'),
                    source: 'WAZIRX'
                };

            case 'COINDCX':
                // Example CoinDCX mapping
                return {
                    id,
                    date: new Date(row.createdAt).toISOString(),
                    type: row.side === 'buy' ? 'BUY' : 'SELL',
                    asset: row.market.replace('INR', ''),
                    amount: parseFloat(row.quantity),
                    price: parseFloat(row.price),
                    totalInfo: parseFloat(row.total_price),
                    fee: parseFloat(row.fee || '0'),
                    source: 'COINDCX'
                };

            case 'BINANCE':
                // Example Binance mapping
                return {
                    id,
                    date: new Date(row['Date(UTC)']).toISOString(),
                    type: row.Side === 'BUY' ? 'BUY' : 'SELL',
                    asset: row.Market.replace('USDT', ''), // Simplified
                    amount: parseFloat(row.Amount),
                    price: parseFloat(row.Price),
                    totalInfo: parseFloat(row.Total),
                    fee: parseFloat(row.Fee || '0'),
                    source: 'BINANCE'
                };

            default:
                return null; // Unknown source
        }
    } catch (e) {
        console.error("Error parsing row", row, e);
        return null;
    }
};
