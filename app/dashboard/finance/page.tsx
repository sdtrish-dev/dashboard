import { Metadata } from 'next';
import { lusitana } from '@/app/ui/fonts';
import WidgetCreationForm from '@/app/ui/widgets/widget-creation-form';
import WidgetConfiguration from '@/app/ui/widgets/widget-configuration';
import WidgetDisplay from '@/app/ui/widgets/widget-display';
export const metadata: Metadata = {
  title: 'Build your own Finance Widget here',
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Finance Widget</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <p>Build your own Finance Widget here. This will appear on the home screen when you login.</p>
      </div>
      {/* <WidgetCreationForm /> */}
    </div>
  );
}