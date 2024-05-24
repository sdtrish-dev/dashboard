import axios from 'axios';
import { db } from '@vercel/postgres';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export async function fetchFinancialData(symbol: string, type: string, refreshRate: number): Promise<any> {
    try {
        // Convert refreshRate from milliseconds to hours
        const refreshRateInHours = refreshRate / 3600000;
        // Validate refreshRateInHours
        if (typeof refreshRateInHours !== 'number' || refreshRateInHours <= 0 || refreshRateInHours > 24) {
            throw new Error(`Invalid refreshRate specified: ${refreshRateInHours}. It should be in hours and a reasonable value between 1 and 24.`);
        }

        const now = Date.now();
        const thresholdTimestamp = now - refreshRate * 60 * 60 * 1000;
        // Check the cache
        const { rows } = await pool.query('SELECT * FROM cache WHERE symbol = $1 AND type = $2 AND timestamp > $3', [symbol, type, thresholdTimestamp]);

        if (rows.length > 0 && now - rows[0].timestamp < refreshRate * 3600000) {
            return rows[0].data;
        }

        const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        let apiUrl = '';
        if (type === 'cryptocurrency') {
            apiUrl = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=CAD&apikey=${apiKey}`;
        } else if (type === 'stock') {
            apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
        } else {
            throw new Error('Invalid type specified.');
        }
        const response = await axios.get(apiUrl);

        if (response.status === 200 && response.data) {

           await pool.query('INSERT INTO cache (symbol, type, timestamp, data) VALUES ($1, $2, $3, $4) ON CONFLICT (symbol, type) DO UPDATE SET timestamp = $3, data = $4', [symbol, type, now, response.data]);

            return response.data;
        } else {
            throw new Error('Failed to fetch financial data');
        }
    } catch (error: unknown) {
    if (error instanceof Error) {
        console.log(error.message);
    } else {
        throw error;
    }
}
}