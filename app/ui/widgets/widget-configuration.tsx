import { useState, FormEvent } from 'react';

interface WidgetData {
  type: string;
  symbol: string;
  interval: string;
  name: string;
}

interface WidgetConfigurationProps {
  widget: WidgetData;
  onUpdate: (data: WidgetData) => void;
}

function WidgetConfiguration({ widget, onUpdate }: WidgetConfigurationProps) {
  const [type, setType] = useState(widget.type);
  const [symbol, setSymbol] = useState(widget.symbol);
  const [interval, setInterval] = useState(widget.interval);
  const [name, setName] = useState(widget.name);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onUpdate({ type, symbol, interval, name });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add fields for type, symbol, interval, and name here */}
    </form>
  );
}

export default WidgetConfiguration;