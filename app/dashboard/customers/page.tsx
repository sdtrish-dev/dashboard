import { Metadata } from 'next';
import { Suspense } from 'react';
import CustomersTable from '@/app/ui/customers/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchFilteredCustomers, fetchInvoicesPages } from '@/app/lib/data';
import Pagination from '@/app/ui/invoices/pagination';

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
  const currentPage = Number(searchParams?.page) || 1;
  const { customers, totalPages } = await fetchFilteredCustomers(query, currentPage);


  return (
    <>
    <Suspense fallback={<InvoicesTableSkeleton />}>
      <CustomersTable customers={customers} />
    </Suspense>
    <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
      </>
  );
}
