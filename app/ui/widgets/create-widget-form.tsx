'use client';
import React, { useState } from 'react';
import { useFormState } from 'react-dom'; // Assuming this is your custom hook for form state management
import { createWidget } from '@/app/lib/actions';
import { Button } from '@/app/ui/button'; // Import your Button and other UI components


export default function WidgetCreationForm() {
const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createWidget, initialState);

    // Form fields
    const [dataType, setDataType] = useState('');
    const [tickerSymbol, setTickerSymbol] = useState('');
    const [widgetName, setWidgetName] = useState('');
    const [refreshInterval, setRefreshInterval] = useState('');

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     dispatch({ dataType, tickerSymbol, widgetName, refreshInterval });
    // };

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
        <div className="mb-4">
          <label htmlFor="dataType" className="mb-2 block text-sm font-medium">
            Data Type
          </label>
          <select 
            id="dataType" 
            name="dataType" 
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            required
            className="peer block w-1/3 cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          >
            <option value="">Select Data Type</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="stock">Stock</option>
          </select>
        </div>

        {/* Ticker Symbol */}
        <div className="mb-4">
          <label htmlFor="tickerSymbol" className="mb-2 block text-sm font-medium">
            Ticker Symbol
          </label>
          <input 
            id="tickerSymbol" 
            name="tickerSymbol" 
            value={tickerSymbol}
            onChange={(e) => setTickerSymbol(e.target.value)}
            required
            className="peer block w-1/3 cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"

          />
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

        {/* Display form submission message */}
        {state.message && <p className="text-green-500">{state.message}</p>}

        {/* Submit Button */}
        <Button type="submit">Create Widget</Button>
      </div>
    </form>
  );
};
