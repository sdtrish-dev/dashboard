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
export async function insertApiKey(userId: string, apiKey: string): Promise<void> {
    try {
        const client = await db.connect();

        const insertQuery = `
            INSERT INTO api_keys (user_id, api_key)
            VALUES ($1, $2)
            ON CONFLICT (user_id) DO UPDATE SET api_key = $2;
        `;

        await client.query(insertQuery, [userId, apiKey]);

        await client.release();

        console.log(`API key for user ${userId} inserted/updated successfully`);
    } catch (error) {
        console.error('Error inserting API key:', error);
        throw error;
    }
}

export async function fetchApiKey(userId: string): Promise<string | null> {
    try {
        const client = await db.connect();

        const fetchQuery = `
            SELECT api_key
            FROM api_keys
            WHERE user_id = $1;
        `;

        const { rows } = await client.query(fetchQuery, [userId]);

        await client.release();

        if (rows.length > 0) {
            return rows[0].api_key;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching API key:', error);
        throw error;
    }
}

// Function to insert a new widget into the database
export async function insertWidgetIntoDatabase(dataType: string, tickerSymbol: string, widgetName: string, refreshInterval: number): Promise<void> {
  try {
    const client = await db.connect();

    const insertQuery = `
      INSERT INTO widgets (data_type, ticker_symbol, widget_name, refresh_interval)
      VALUES ($1, $2, $3, $4);
    `;

    await client.query(insertQuery, [
      dataType,
      tickerSymbol,
      widgetName,
      refreshInterval
    ]);

    await client.release();

    console.log(`Widget with name ${widgetName} inserted successfully`);
  } catch (error) {
    console.error('Error inserting widget into database:', error);
    throw new Error(`Database Error: Failed to create widget. ${error}`);
  }
}
// Function to fetch the latest data for a widget from the database
export async function fetchLatestWidgetData(widgetId: number) {
  try {
    const client = await db.connect();

    const fetchQuery = `
      SELECT *
      FROM widgets
      ORDER BY id DESC
      LIMIT 1
    `;

    const { rows } = await client.query(fetchQuery, [widgetId]);

    await client.release();

    if (rows.length > 0) {
      const id = Number(rows[0].id ?? '0');
      const data_type = rows[0].data_type ?? '';
      const ticker_symbol = rows[0].ticker_symbol ?? '';
      const widget_name = rows[0].widget_name ?? '';
      const refresh_interval = Number(rows[0].refresh_interval ?? '0');

      // Fetch the financial data for the widget's ticker symbol and type
      const financialData = await fetchFinancialData(ticker_symbol, data_type);

      // Extract the latest price and price change from the financial data
      const timeSeries = data_type === 'crypto' ? financialData['Time Series (Digital Currency Daily)'] : financialData['Time Series (Daily)'];
      const latestDate = Object.keys(timeSeries)[0];
      const latestData = timeSeries[latestDate];
      const price = parseFloat(latestData['4. close']);
      const previousData = timeSeries[Object.keys(timeSeries)[1]];
      const previousPrice = parseFloat(previousData['4. close']);
      const price_change = price - previousPrice;

      return {
        id,
        data_type,
        ticker_symbol,
        widget_name,
        refresh_interval,
        price,
        price_change,
      };
    } else {
      throw new Error('No data found for this widget');
    }
  } catch (error) {
    console.error('Failed to fetch financial data:', error);
    return {
      alert: 'Failed to fetch financial data',
    };
  }
}

export const FETCH_WIDGET_DATA_START = 'FETCH_WIDGET_DATA_START';
export const FETCH_WIDGET_DATA_SUCCESS = 'FETCH_WIDGET_DATA_SUCCESS';
export const FETCH_WIDGET_DATA_FAILURE = 'FETCH_WIDGET_DATA_FAILURE';

export const fetchWidgetDataStart = () => ({
  type: FETCH_WIDGET_DATA_START,
});

export const fetchWidgetDataSuccess = (data: any) => ({
  type: FETCH_WIDGET_DATA_SUCCESS,
  payload: data,
});

export const fetchWidgetDataFailure = (error: unknown) => ({
  type: FETCH_WIDGET_DATA_FAILURE,
  payload: error,
});

export const fetchWidgetData = (widgetId: any) => {
  return async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch(fetchWidgetDataStart());

    try {
      const response = await axios.get(`/api/widgets/${widgetId}`);
      dispatch(fetchWidgetDataSuccess(response.data));
    } catch (error) {
      dispatch(fetchWidgetDataFailure(error));
    }
  };
};