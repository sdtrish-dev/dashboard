import { UpdateWidget, DeleteWidget } from '@/app/ui/widgets/widget-buttons';
import { fetchFilteredWidgets } from '@/app/lib/data';
import {
    CurrencyDollarIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import type { WidgetsTable } from '@/app/lib/definitions';

export default async function WidgetsTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const widgets = await fetchFilteredWidgets(query, currentPage);
    const stocks = widgets?.filter((widget) => widget.type === 'stock');
    const cryptocurrencies = widgets?.filter((widget) => widget.type === 'cryptocurrency');

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 flex justify-between">
                    <div className="w-1/2 pr-2">
                        <h2 className="text-lg font-medium mb-2">Stocks</h2>
                        {stocks?.map((widget) => (
                            <WidgetCard key={widget.id} widget={widget} />
                        ))}
                    </div>
                    <div className="w-1/2 pl-2">
                        <h2 className="text-lg font-medium mb-2">Cryptocurrencies</h2>
                        {cryptocurrencies?.map((widget) => (
                            <WidgetCard key={widget.id} widget={widget} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function WidgetCard({ widget }: { widget: WidgetsTable }) {
  return (
    <div key={widget.id} className="mb-2 w-full rounded-md bg-white p-4 shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {widget.type === 'cryptocurrency' ? (
            <CurrencyDollarIcon className="h-6 w-6" />
          ) : (
            <BanknotesIcon className="h-6 w-6" />
          )}
          <div className="ml-4">
            <h3 className="text-lg font-medium">{widget.name}</h3>
            <p className="text-sm text-gray-500">Symbol: {widget.symbol}</p>
            <p className="text-sm text-gray-500">Refresh Rate: {widget.refresh_rate} ms</p>
            <p className="text-sm text-gray-500">Type: {widget.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <UpdateWidget id={widget.id} />
          <DeleteWidget id={widget.id} />
        </div>
      </div>
    </div>
  );
}

