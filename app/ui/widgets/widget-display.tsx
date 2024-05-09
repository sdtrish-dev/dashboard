import { useState } from 'react';
import { fetchFinancialData } from '@/app/lib/data';

interface WidgetData {
  type: string;
  symbol: string;
  interval: string;
  name: string;
}

interface WidgetDisplayProps {
  widget: WidgetData;
}

async function WidgetDisplay({ widget }: WidgetDisplayProps) {
  const [data, setData] = useState(null);
const [error, setError] = useState<Error | null>(null);

try {
    const data = await fetchFinancialData(widget.symbol, widget.interval);
    setData(data);
} catch (error) {
    setError(error as Error);
}

if (error) {
    return <div>Error: {error.message}</div>;
}

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{widget.name}</h2>
      {/* Display the data here */}
    </div>
  );
}

export default WidgetDisplay;