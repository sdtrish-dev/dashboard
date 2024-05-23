import axios from 'axios';

export async function fetchFinancialData(symbol: string, type: string): Promise<any> {
    try {
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