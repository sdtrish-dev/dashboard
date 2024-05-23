import { fetchFinancialData } from "@/app/lib/financial-services";

export default async function WidgetsData({symbol, type, refreshRate}: {symbol: string, type: string, refreshRate: number}) {
    // Fetch the data
    const data = await fetchFinancialData(symbol, type, refreshRate);

    if (!data || !data['Meta Data']) {
        return Promise.resolve(<div>Error: Unable to fetch data</div>);
    }

    const isCrypto = data['Meta Data']['2. Digital Currency Code'] !== undefined;
    const timeSeriesKey = isCrypto ? 'Time Series (Digital Currency Daily)' : 'Time Series (Daily)';
    const latestDataKey = Object.keys(data[timeSeriesKey])[0];
    const latestData = data[timeSeriesKey][latestDataKey];

    const priceChange = parseFloat(latestData['4. close']) - parseFloat(latestData['1. open']);
    const priceChangeIndicator = priceChange > 0 ? 'green' : 'red';

    return (
        <div>
            <p>Open: {Number(latestData['1. open']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>High: {Number(latestData['2. high']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Low: {Number(latestData['3. low']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>Close: <span style={{color: priceChangeIndicator}}>{Number(latestData['4. close']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
        </div>
    );
};