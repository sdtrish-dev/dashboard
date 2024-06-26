'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { createWidget } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import {
  CurrencyDollarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { TickerSymbol } from '@/app/lib/definitions';
import { stockSymbols, cryptoSymbols } from '@/app/lib/ticker-symbols';


export default function WidgetCreationForm({ symbol }: { symbol: TickerSymbol[] }) {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createWidget, initialState);
    const [dataType, setDataType] = useState('stock');
    const handleDataTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataType(event.target.value);
  };
    let symbols;
    if (dataType === 'stock') {
        symbols = stockSymbols;
    } else if (dataType === 'cryptocurrency') {
        symbols = cryptoSymbols;
    } else {
        symbols = [...stockSymbols, ...cryptoSymbols];
    }
    const MIN_REFRESH_RATE_HOURS = 6;

    return (
       <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
            {/* widget name */}
            <div className="mb-4">
                <label htmlFor="widgetName" className="mb-2 block text-sm font-medium">
                    Widget Name
                </label>
                <input
                    id="widgetName"
                    name="widgetName"
                    type="text"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby='name-error'
                />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.widgetName &&
                        state.errors.widgetName.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>
            {/* data type: radio button with icons for cryptocurrency or stock */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">
                    Data Type
                </label>
                <div>
                    <div className="flex items-center space-x-4 mb-2">
                        <input
                            id="cryptocurrency"
                            name="dataType"
                            type="radio"
                            value="cryptocurrency"
                            className="peer cursor-pointer"
                            onChange={handleDataTypeChange}
                        />
                        <label htmlFor="cryptocurrency" className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                            
                            <CurrencyDollarIcon className="h-6 w-6" /> 
                            Cryptocurrency
                        </label>
                    </div>
                    <div className="flex items-center space-x-4">
                        <input
                            id="stock"
                            name="dataType"
                            type="radio"
                            value="stock"
                            className="peer cursor-pointer"
                            onChange={handleDataTypeChange}
                        />
                        <label htmlFor="stock" className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                            
                            <BanknotesIcon className="h-6 w-6" />
                            Stock
                        </label>
                    </div>
                </div>
                <div id="dataType-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.dataType &&
                        state.errors.dataType.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>

            {/* symbol: drop down of stockSymbols and cryptoSymbols */}
            <div className="mb-4">
                <label htmlFor="symbol" className="mb-2 block text-sm font-medium">
                    Symbol
                </label>
                <select
                    id="symbol"
                    name="symbol"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue=""
                    aria-describedby='symbol-error'
                >
                    <option value="" disabled>
                        Select a symbol
                    </option>
                    {symbols?.map((symbol) => (
                        <option key={symbol} value={symbol}>
                            {symbol}
                        </option>
                    ))}
                </select>
                <div id="symbol-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.symbol &&
                        state.errors.symbol.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>
            {/* refresh rate */}
            <div className="mb-4">
                <label htmlFor="refreshRate" className="mb-2 block text-sm font-medium">
                    Refresh Rate
                </label>
                <input
                    id="refreshRate"
                    name="refreshRate"
                    type="number"
                    step="0.5"
                    placeholder={`Minimum ${MIN_REFRESH_RATE_HOURS} hours`}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby='refreshRate-error'
                />
                <div id="refreshRate-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.refreshRate &&
                        state.errors.refreshRate.map((error: string) => (
                            <p className="mt-2 text-sm text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            
            </div>
            <div className="mt-6 flex justify-start gap-4">
                <Link
                href="/dashboard/settings"
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                Cancel
                </Link>
                <Button type="submit">Create Widget</Button>
            </div>
        </div>
    </form>
);
}