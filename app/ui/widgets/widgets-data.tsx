'use client';
import { useEffect, useState } from 'react';

export default function WidgetsData({symbol, type, refreshRate}: {symbol: string, type: string, refreshRate: number}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
    setIsLoading(true);
    try {
        const res = await fetch(`/api/financial-data?symbol=${symbol}&type=${type}&refreshRate=${refreshRate}`);
        const newData = await res.json();
        if (newData && newData['Meta Data']) {
            setData(newData);
            setError(null); 
        } else {
            setError(null); 
        }
    } catch (err: any) { 
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
    };

    fetchData();
    const intervalId = setInterval(fetchData, refreshRate);
    return () => clearInterval(intervalId);
  }, [symbol, type, refreshRate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

    if (!data || !data['Meta Data']) {
        return <div className="text-red-700">Sorry, your API limit has been reached for today.</div>;
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