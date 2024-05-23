import WidgetCreationForm from '@/app/ui/widgets/create-widget';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Create Widget',
}; 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Settings', href: '/dashboard/settings' },
          {
            label: 'Create Widget',
            href: '/dashboard/settings/create',
            active: true,
          },
        ]}
      />
      <WidgetCreationForm symbol={[]} />
    </main>
  );
}