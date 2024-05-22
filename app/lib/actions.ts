'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 
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

export async function deleteWidget(id: string) {
    try {
        await sql`DELETE FROM widgets WHERE id = ${id}`;
    } catch (error) {
        return {
            message: 'An error occurred while deleting the widget.',
        }
    }
  revalidatePath('/dashboard/settings');
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

const CreateWidgetSchema = z.object({
  id: z.string(),
  widgetName: z.string({
    invalid_type_error: 'Please enter a name for your financial widget.',
  }),
  symbol: z.string({
    invalid_type_error: 'Please select a symbol for your financial widget.',
  }),
  refreshRate: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than 0' }),
  dataType: z.enum(['cryptocurrency', 'stock'], {
    invalid_type_error: 'Please select a data type.',
  }),
  date: z.string(),
});

export type WidgetState = {
  errors?: {
    widgetName?: string[];
    symbol?: string[];
    refreshRate?: string[];
    dataType?: string[];
  };
  message?: string | null;
};
 
const CreateWidget = CreateWidgetSchema.omit({ id: true, date: true });
export async function createWidget(prevState: WidgetState, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateWidget.safeParse({
    widgetName: formData.get('widgetName'),
    symbol: formData.get('symbol'),
    refreshRate: formData.get('refreshRate'),
    dataType: formData.get('dataType'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Widget.',
    };
  }

  // Create table if it doesn't exist
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS widgets (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        symbol TEXT NOT NULL,
        refresh_rate INTEGER NOT NULL,
        type TEXT NOT NULL,
        date DATE NOT NULL
      )
    `;
  } catch (error) {
  console.error('Error creating table:', error);
  return {
    message: `Database Error: Failed to Create Table.`,
  };
}

  // Prepare data for insertion into the database
  const { widgetName, symbol, refreshRate, dataType } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];

  

  // Insert data into the database
  try {
    await sql`
      INSERT INTO widgets (name, symbol, refresh_rate, type, date)
      VALUES (${widgetName}, ${symbol}, ${refreshRate}, ${dataType}, ${date})
    `;
  } catch (error) {
    console.error(error);
    // If a database error occurs, return a more specific error.
    return {
      message: `Database Error: Failed to Create Widget.`,
    };
  }

 
  // Revalidate the cache for the widgets page and redirect the user.
  revalidatePath('/dashboard/settings');
  redirect('/dashboard/settings');
}

const UpdateWidget = CreateWidgetSchema.omit({ id: true, date: true });
export async function updateWidget(
  id: string,
  prevState: WidgetState,
  formData: FormData,
) {
  const validatedFields = UpdateWidget.safeParse({
    widgetName: formData.get('widgetName'),
    symbol: formData.get('symbol'),
    refreshRate: formData.get('refreshRate'),
    dataType: formData.get('dataType'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Widget.',
    };
  }

  const { widgetName, symbol, refreshRate, dataType } = validatedFields.data;

  try {
    await sql`
      UPDATE widgets
      SET name = ${widgetName}, symbol = ${symbol}, refresh_rate = ${refreshRate}, type = ${dataType}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Widget.' };
  }

  revalidatePath('/dashboard/settings');
  redirect('/dashboard/settings');
}
