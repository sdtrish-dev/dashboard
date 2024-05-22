import Image from 'next/image';
import { UpdateWidget, DeleteWidget } from '@/app/ui/widgets/widget-buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredWidgets } from '@/app/lib/data';

export default async function WidgetsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const widgets = await fetchFilteredWidgets(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {widgets?.map((widget) => (
              <div
                key={widget.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">{widget.widgetName}</h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <UpdateWidget id={widget.id} />
                    <DeleteWidget id={widget.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
    </div>
    );
}

