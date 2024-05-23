import EditWidget from '@/app/ui/widgets/edit-widget';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchWidgetById } from '@/app/lib/data';
import { updateWidget } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Edit Widget',
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
          { label: 'Settings', href: '/dashboard/settings' },
          {
            label: 'Edit Widget',
            href: `/dashboard/settings/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditWidget widget={widget} />
    </main>
  );
}