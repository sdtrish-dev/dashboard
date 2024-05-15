import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import ApiKeyForm from '@/app/ui/widgets/api-key-form';
import WidgetCreationForm from '@/app/ui/widgets/create-widget-form';

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Settings</h1>
      </div>
      <ApiKeyForm />
      <div className="flex w-full items-center justify-between my-6">
        <h2 className={`${lusitana.className} text-xl`}>Create Widget</h2>
      </div>
      <WidgetCreationForm />
    </div>
  );
}