// app/dashboard/widgets/WidgetsData.tsx
'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { fetchData } from '@/src/actions/dataActions';

interface WidgetsDataProps {
  symbol: string;
  type: string;
  refreshRate: number;
  showAlert: boolean;
}

const WidgetsData: React.FC<WidgetsDataProps> = ({ symbol, type, refreshRate, showAlert }) => {
  const dispatch = useDispatch<AppDispatch>();
  const widgetState = useSelector((state: RootState) => state.data[symbol] || { data: null, isLoading: true, error: null });
  const { data, isLoading, error } = widgetState;

  useEffect(() => {
    dispatch(fetchData(symbol, type, refreshRate));
    const intervalId = setInterval(() => {
      dispatch(fetchData(symbol, type, refreshRate));
    }, refreshRate);

    return () => clearInterval(intervalId);
  }, [dispatch, symbol, type, refreshRate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data || !data['Meta Data']) {
    if (!isLoading && !showAlert) {
      return <div className="text-red-700">Sorry, your API limit has been reached for today.</div>;
    }
    return null;
  }

  const isCrypto = data['Meta Data']['2. Digital Currency Code'] !== undefined;
  const timeSeriesKey = isCrypto ? 'Time Series (Digital Currency Daily)' : 'Time Series (Daily)';
  const latestDataKey = Object.keys(data[timeSeriesKey])[0];
  const latestData = data[timeSeriesKey][latestDataKey];

  const priceChange = parseFloat(latestData['4. close']) - parseFloat(latestData['1. open']);
  const priceChangeIndicator = priceChange > 0 ? 'green' : 'red';
  const priceChangePercentage = (priceChange / parseFloat(latestData['1. open'])) * 100;

  return (
    <div>
      {showAlert && <PriceAlert symbol={symbol} type={type} priceChangePercentage={priceChangePercentage} priceChangeIndicator={priceChangeIndicator} />}
      {!showAlert && (
        <div>
          <p>Open: ${Number(latestData['1. open']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</p>
          <p>High: ${Number(latestData['2. high']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</p>
          <p>Low: ${Number(latestData['3. low']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</p>
          <p>Close: <span style={{color: priceChangeIndicator}}>${Number(latestData['4. close']).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span></p>
        </div>
      )}
    </div>
  );
};

export default WidgetsData;



interface PriceAlertProps {
    symbol: string;
    type: string;
    priceChangePercentage: number;
    priceChangeIndicator: string;
}

export function PriceAlert({ symbol, type, priceChangePercentage, priceChangeIndicator }: PriceAlertProps) {
    if (Math.abs(priceChangePercentage) > 2) {
        return (
            <div className="font-bold">
                Price change alert for {symbol} ({type}): The price has changed by<span style={{color: priceChangeIndicator}}> {priceChangePercentage.toFixed(2)}%</span>.
            </div>
        );
    } 

    return <div>No alerts for {symbol}</div>;
}