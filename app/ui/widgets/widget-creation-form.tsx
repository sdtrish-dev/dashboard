'use client';
import { useFormState } from 'react-dom';
import { Button } from '@/app/ui/button';
import { createWidget } from '@/app/lib/actions'; // Assuming you have a createWidget action

export default function WidgetCreationForm({ onCreate }: { onCreate: (data: any) => void }) {
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    onCreate(data);
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Widget Type */}
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
            Choose Data Type
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby='type-error'
            >
              <option value="" disabled>
                Select a data type
              </option>
              <option value="cryptocurrency">Cryptocurrency</option>
              <option value="stock">Stock</option>
            </select>
          </div>
          {/* <div id="type-error" aria-live="polite" aria-atomic="true">
            {state.errors?.type &&
              state.errors.type.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div> */}
        </div>

        {/* Ticker Symbol */}
        <div className="mb-4">
          <label htmlFor="symbol" className="mb-2 block text-sm font-medium">
            Ticker Symbol
          </label>
          <input
            id="symbol"
            name="symbol"
            type="text"
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            placeholder="Enter ticker symbol"
            aria-describedby='symbol-error'
          />
          {/* <div id="symbol-error" aria-live="polite" aria-atomic="true">
            {state.errors?.symbol &&
              state.errors.symbol.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div> */}
        </div>

        {/* <div id="message-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500" key={state.message}>
              {state.message}
            </p>
          )}
        </div> */}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button type="reset">Cancel</Button>
        <Button type="submit">Create Widget</Button>
      </div>
    </form>
  );
}