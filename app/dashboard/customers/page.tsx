import { Metadata } from 'next';
import { Suspense } from 'react';
import CustomersTable from '@/app/ui/customers/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchFilteredCustomers } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';

  // Fetch customers based on the query
  const customers = await fetchFilteredCustomers(query);

  return (
    <Suspense fallback={<InvoicesTableSkeleton />}>
      <CustomersTable customers={customers} />
    </Suspense>
  );
}
