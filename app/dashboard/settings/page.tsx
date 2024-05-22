import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import { CreateWidget } from '@/app/ui/widgets/widget-buttons';
import WidgetsTable from '@/app/ui/widgets/widgets-table';
export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Page() {

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Settings
      </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            <CreateWidget />
        </div>
      <WidgetsTable query="" currentPage={1} />
    </main>
  );
}
