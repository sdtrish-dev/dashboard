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
}

const WidgetDisplay: React.FC<WidgetDisplayProps> = ({ widgetData }) => {
  const priceIndicator = widgetData.price_change > 0 ? '🟢' : '🔴';

  return (
    <div>
      <h2>{widgetData.widget_name}</h2>
      <p>Type: {widgetData.data_type}</p>
      <p>Ticker Symbol: {widgetData.ticker_symbol}</p>
      <p>Refresh Interval: {widgetData.refresh_interval}</p>
      <p>Price: {widgetData.price} {priceIndicator}</p>
    </div>
  );
};

export default WidgetDisplay;