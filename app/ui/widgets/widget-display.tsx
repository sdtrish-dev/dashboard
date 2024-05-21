// widget-display.tsx
import React from 'react';

interface WidgetData {
  id: number;
  data_type: string;
  ticker_symbol: string;
  widget_name: string;
  refresh_interval: number;
  price: number;
  price_change: number;
}

interface WidgetDisplayProps {
  widgetData: WidgetData;
  loading: boolean;
  error: string | null;
}

const WidgetDisplay: React.FC<WidgetDisplayProps> = ({ widgetData, loading, error }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const priceIndicator = widgetData.price_change > 0 ? '🟢' : '🔴';

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{widgetData.widget_name}</div>
          <p className="block mt-1 text-lg leading-tight font-medium text-black">{widgetData.ticker_symbol}</p>
          <p className="mt-2 text-gray-500">{widgetData.data_type}</p>
          <p className="mt-2 text-gray-500">Refresh Interval: {widgetData.refresh_interval}</p>
          <p className="mt-2 text-gray-500">Price: {widgetData.price} {priceIndicator}</p>
        </div>
      </div>
    </div>
  );
};

export default WidgetDisplay;