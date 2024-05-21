'use client';
import React, { useState } from 'react';
import { useFormState } from 'react-dom'; // Assuming this is your custom hook for form state management
import { createWidget } from '@/app/lib/actions';
import { Button } from '@/app/ui/button'; // Import your Button and other UI components
import {
  CurrencyDollarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { TickerSymbol } from '@/app/lib/definitions';
import { stockSymbols, cryptoSymbols } from '@/app/lib/ticker-symbols';


export default function WidgetCreationForm({ ticker_symbols }: { ticker_symbols: TickerSymbol[] }) {
const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createWidget, initialState);

    // Form fields
    const [dataType, setDataType] = useState('');
    const [tickerSymbol, setTickerSymbol] = useState('');
    const [widgetName, setWidgetName] = useState('');
    const [refreshInterval, setRefreshInterval] = useState('');

  // Function to handle data type change
  const handleDataTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataType(event.target.value);
  };

  // Get the ticker symbols based on the selected data type
  let tickerSymbols;
    if (dataType === 'cryptocurrency') {
      tickerSymbols = cryptoSymbols;
    } else if (dataType === 'stock') {
      tickerSymbols = stockSymbols;
    } else {
      tickerSymbols = [...cryptoSymbols, ...stockSymbols];
    }


    return (
       <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
                <label htmlFor="widgetName" className="mb-2 block text-sm font-medium">
                    Widget Name
                </label>
                <input 
                    id="widgetName" 
                    name="widgetName" 
                    value={widgetName}
                    onChange={(e) => setWidgetName(e.target.value)}
                    required
                    className="peer block w-1/3 cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"

                />
            </div>
        {/* Data Type */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium" aria-describedby='status-error'>
            Data Type
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="cryptocurrency"
                  name="dataType"
                  type="radio"
                  value="cryptocurrency"
                  onChange={handleDataTypeChange}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="cryptocurrency"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Cryptocurrency 
                  <CurrencyDollarIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="stock"
                  name="dataType"
                  type="radio"
                  value="stock"
                  onChange={handleDataTypeChange}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="stock"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Stock 
                  <BanknotesIcon className="h-4 w-4" />
                  
                </label>
              </div>
            </div>
          </div>
         
        </fieldset>
        

        {/* Ticker Symbol */}
        <div className="mb-4">
          <label htmlFor="ticker_symbol" className="mb-2 block text-sm font-medium">
            Ticker Symbol
          </label>
          <div className="relative">
           <select
              id="tickerSymbol"
              name="tickerSymbol"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              // aria-describedby='ticker_symbol-error'
            >
              <option value="" disabled>
                Select a Ticker Symbol
              </option>
              {tickerSymbols.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
            {/* <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
          </div>
        </div>
        

       <div className="mb-4">
                <label htmlFor="refreshInterval" className="mb-2 block text-sm font-medium">
                    Refresh Interval (in seconds)
                </label>
                <input 
                    id="refreshInterval" 
                    name="refreshInterval" 
                    type="number"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    required
                    className="peer block w-1/3 cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"

                />
            </div>

        {/* Submit Button */}
        <Button type="submit">Create Widget</Button>
      </div>
    </form>
  );
};
