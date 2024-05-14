'use client';
import { useFormState } from 'react-dom';
import { createApiKeyForm } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';

const ApiKeyForm = () => {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createApiKeyForm, initialState);

  return (
    <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-6">
          <label htmlFor="apiKey" className="mb-2 block text-sm font-medium">
            Add your API key here
          </label>
          <div className='flex'>
            <div>
              <input 
                id='apiKey'
                type="text" 
                placeholder="Enter your API key" 
                required 
                name="apiKey"
                defaultValue=""
                aria-describedby='apikey-error'
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"

              />
            </div>
            {/* Display the error message for apiKey */}
            <div id="apikey-error" aria-live="polite" aria-atomic="true">
            {state.errors?.apiKey &&  (
              <p className="text-red-500">{state.errors?.apiKey}</p>
            )}
            </div>
            {/* Display the success message */}
            {state.message && <p className="text-green-500">{state.message}</p>}
            <Button className='ml-6' type="submit">Save</Button>
          </div>
        </div>
    </form>
  );
};

export default ApiKeyForm;
