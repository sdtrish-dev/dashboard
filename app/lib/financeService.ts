import axios from 'axios';
import { db } from '@vercel/postgres';
// Function to insert financial data (both cryptocurrencies and stocks) into the database
export async function insertFinancialData(symbol: string, type: string, data: any): Promise<void> {
    try {
        const client = await db.connect();

        // Check if the appropriate table exists based on the type (crypto or stock)
        let tableName = '';
        if (type === 'crypto') {
            tableName = 'cryptocurrency_prices';
        } else if (type === 'stock') {
            tableName = 'stock_prices';
        } else {
            throw new Error('Invalid type specified.');
        }

        const checkTableQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_name = $1
            );
        `;
        const { rows } = await client.query(checkTableQuery, [tableName]);
        const tableExists = rows[0].exists;

        // If the table doesn't exist, create it
        if (!tableExists) {
            // Create table based on type
            let createTableQuery = '';
            if (type === 'crypto') {
                createTableQuery = `
                    CREATE TABLE cryptocurrency_prices (
                        id SERIAL PRIMARY KEY,
                        symbol VARCHAR(10) NOT NULL,
                        date DATE NOT NULL,
                        open_price NUMERIC NOT NULL,
                        high_price NUMERIC NOT NULL,
                        low_price NUMERIC NOT NULL,
                        close_price NUMERIC NOT NULL
                    );
                `;
            } else if (type === 'stock') {
                createTableQuery = `
                    CREATE TABLE stock_prices (
                        id SERIAL PRIMARY KEY,
                        symbol VARCHAR(10) NOT NULL,
                        date DATE NOT NULL,
                        open_price NUMERIC NOT NULL,
                        high_price NUMERIC NOT NULL,
                        low_price NUMERIC NOT NULL,
                        close_price NUMERIC NOT NULL
                    );
                `;
            }
            await client.query(createTableQuery);
            console.log(`Created ${tableName} table`);
        }

        // Extract relevant data from the API response
        const metaData = data['Meta Data'];
        const timeSeries = type === 'crypto' ? data['Time Series (Digital Currency Daily)'] : data['Time Series (Daily)'];

        // Iterate over each data point in the time series
        for (const date in timeSeries) {
            const financialData = timeSeries[date];
            const openPrice = parseFloat(financialData['1. open']);
            const highPrice = parseFloat(financialData['2. high']);
            const lowPrice = parseFloat(financialData['3. low']);
            const closePrice = parseFloat(financialData['4. close']);

            // Construct the SQL query to insert data into the database
            const insertQuery = `
                INSERT INTO ${tableName} (symbol, date, open_price, high_price, low_price, close_price)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT DO NOTHING;
            `;

            // Execute the SQL query with the extracted data
            await client.query(insertQuery, [
                symbol,
                new Date(date),
                openPrice,
                highPrice,
                lowPrice,
                closePrice
            ]);
        }

        // Release the database connection
        await client.release();

        console.log(`Financial data for ${symbol} inserted successfully`);
    } catch (error) {
        console.error('Error inserting financial data:', error);
        throw error;
    }
}

// Function to fetch financial data (both cryptocurrencies and stocks) from Alpha Vantage API
export async function fetchFinancialData(symbol: string, type: string): Promise<any> {
    try {
        const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        let apiUrl = '';
        if (type === 'crypto') {
            apiUrl = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${apiKey}`;
        } else if (type === 'stock') {
            apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
        } else {
            throw new Error('Invalid type specified.');
        }
        
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch financial data');
        }
    } catch (error) {
        console.error('Error fetching financial data:', error);
        throw error;
    }
}
