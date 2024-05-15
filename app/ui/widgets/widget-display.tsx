// widget-display.tsx
import React from 'react';

interface WidgetData {
  id: number;
  data_type: string;
  ticker_symbol: string;
  widget_name: string;
  refresh_interval: number;
  // Add any other properties that are part of the widget data
}

interface WidgetDisplayProps {
  widgetData: WidgetData;
}

const WidgetDisplay: React.FC<WidgetDisplayProps> = ({ widgetData }) => {
  return (
    <div>
      <h2>{widgetData.widget_name}</h2>
      <p>Type: {widgetData.data_type}</p>
      <p>Ticker Symbol: {widgetData.ticker_symbol}</p>
      <p>Refresh Interval: {widgetData.refresh_interval}</p>
      {/* Display any other properties of the widget data */}
    </div>
  );
};

export default WidgetDisplay;