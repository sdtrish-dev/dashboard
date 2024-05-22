import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import { CreateWidget } from '@/app/ui/widgets/widget-buttons';
import WidgetsTable from '@/app/ui/widgets/widgets-table';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { fetchWidgetsPages } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Settings',
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
  const totalPages = await fetchWidgetsPages(query);
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Settings
      </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          <Search placeholder="Search invoices..." />
            <CreateWidget />
        </div>
      <WidgetsTable query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
