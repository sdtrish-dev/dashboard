'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { insertWidgetIntoDatabase } from '@/app/lib/financeService';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error) {
        return {
            message: 'An error occurred while deleting the invoice.',
        }
    }
  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
export type ApiKeyFormState = {
  errors?: {
    apiKey?: string[];
  };
  message?: string | null;
};
// Define API key schema for validation
const ApiKeySchema = z.object({
  apiKey: z.string().nonempty({
    message: 'API key is required.',
  }),
});
export async function createApiKeyForm(prevState: ApiKeyFormState, formData: FormData) {
  // Validate API key using Zod
  const validatedFields = ApiKeySchema.safeParse({
    apiKey: formData.get('apiKey'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'API Key is required.',
    };
  }

  // Handle API key submission logic
  const apiKey = validatedFields.data.apiKey;

  // Return success message or any additional data
  return {
    message: 'API Key has been successfully validated.',
    apiKey: apiKey,
  };
}
// Update the schema for the widget creation form
const WidgetSchema = z.object({
  id: z.string(),
  dataType: z.enum(['cryptocurrency', 'stock'], {
    invalid_type_error: 'Please select a valid data type (crypto or stock).',
  }),
  tickerSymbol: z.string({
    invalid_type_error: 'Please enter a valid ticker symbol.',
  }),
  widgetName: z.string({
    invalid_type_error: 'Please enter a valid widget name.',
  }),
  refreshInterval: z.coerce
    .number()
    .gt(0, { message: 'Please enter a refresh interval greater than 0.' }),
});

// Update the state type
export type WidgetFormState = {
  errors?: {
    dataType?: string[];
    tickerSymbol?: string[];
    widgetName?: string[];
    refreshInterval?: string[];
  };
  message?: string | null;
};
const CreateWidget = WidgetSchema.omit({ id: true });
// Update the function to create a new widget
export async function createWidget(prevState: WidgetFormState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateWidget.safeParse({
    dataType: formData.get('dataType'),
    tickerSymbol: formData.get('tickerSymbol'),
    widgetName: formData.get('widgetName'),
    refreshInterval: formData.get('refreshInterval'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Widget.',
    };
  }

  // Prepare data for insertion into the database
  const { dataType, tickerSymbol, widgetName, refreshInterval } = validatedFields.data;

  // Insert data into the database
  try {
    await insertWidgetIntoDatabase(dataType, tickerSymbol, widgetName, refreshInterval);
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Widget.',
    };
  }

  // Revalidate the cache for the widgets page and redirect the user.
  revalidatePath('/dashboard/settings');
  redirect('/dashboard/settings');

}