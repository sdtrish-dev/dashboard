import EditWidget from '@/app/ui/widgets/edit-widget';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchWidgetById } from '@/app/lib/data';
import { updateInvoice } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [widget] = await Promise.all([
    fetchWidgetById(id)
  ]);
  if (!widget) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Widgets', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* <Form invoice={invoice} customers={customers} /> */}
    </main>
  );
}