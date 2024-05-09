import axios from 'axios';
import { db } from '@vercel/postgres';

// Function to insert cryptocurrency data into the database
export async function insertCryptoData(symbol: string, data: any): Promise<void> {
    try {
        // Connect to the database
        const client = await db.connect();

        // Check if the cryptocurrency_prices table exists
        const checkTableQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_name = 'cryptocurrency_prices'
            );
        `;
        const { rows } = await client.query(checkTableQuery);
        const tableExists = rows[0].exists;

        // If the table doesn't exist, create it
        if (!tableExists) {
            await client.query(`
                CREATE TABLE cryptocurrency_prices (
                    id SERIAL PRIMARY KEY,
                    symbol VARCHAR(10) NOT NULL,
                    date DATE NOT NULL,
                    open_price NUMERIC NOT NULL,
                    high_price NUMERIC NOT NULL,
                    low_price NUMERIC NOT NULL,
                    close_price NUMERIC NOT NULL
                );
            `);
            console.log('Created cryptocurrency_prices table');
        }

        // Extract relevant data from the API response
        const metaData = data['Meta Data'];
        const timeSeries = data['Time Series (Digital Currency Daily)'];

        // Iterate over each data point in the time series
        for (const date in timeSeries) {
            const cryptoData = timeSeries[date];
            const openPrice = parseFloat(cryptoData['1a. open (USD)']);
            const highPrice = parseFloat(cryptoData['2a. high (USD)']);
            const lowPrice = parseFloat(cryptoData['3a. low (USD)']);
            const closePrice = parseFloat(cryptoData['4a. close (USD)']);

            // Construct the SQL query to insert data into the database
            const insertQuery = `
                INSERT INTO cryptocurrency_prices (symbol, date, open_price, high_price, low_price, close_price)
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

        console.log(`Cryptocurrency data for ${symbol} inserted successfully`);
    } catch (error) {
        console.error('Error inserting cryptocurrency data:', error);
        throw error;
    }
}


// Function to fetch cryptocurrency data from the Alpha Vantage API
export async function fetchCryptoData(symbol: string): Promise<any> {
    try {
        // Construct the API URL with the symbol and your API key
        const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        const apiUrl = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${apiKey}`;
        
        // Make the HTTP GET request
        const response = await axios.get(apiUrl);

        // Check if the response is successful
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch cryptocurrency data');
        }
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
        throw error;
    }
}
