
import { openDB, DBSchema } from 'idb';

interface TaxPlatformDB extends DBSchema {
    transactions: {
        key: string; // unique ID
        value: {
            id: string;
            date: string; // ISO string
            type: 'BUY' | 'SELL' | 'TRANSFER' | 'INCOME';
            asset: string; // BTC, ETH, etc.
            amount: number;
            price: number; // In INR
            totalInfo: number; // derived or explicit
            fee: number;
            source: string; // Exchange name or 'MANUAL'
            hash?: string; // Tx Hash
        };
        indexes: { 'by-date': string };
    };
    settings: {
        key: string;
        value: {
            key: string;
            value: any;
        };
    };
}

const DB_NAME = 'defi-tax-platform-db';
const DB_VERSION = 1;

export const initDB = async () => {
    const db = await openDB<TaxPlatformDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('transactions')) {
                const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
                txStore.createIndex('by-date', 'date');
            }
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
        },
    });
    return db;
};

export const db = {
    async addTransaction(tx: TaxPlatformDB['transactions']['value']) {
        const db = await initDB();
        return db.put('transactions', tx);
    },

    async getAllTransactions() {
        const db = await initDB();
        return db.getAllFromIndex('transactions', 'by-date');
    },

    async clearAll() {
        const db = await initDB();
        return db.clear('transactions');
    }
};
