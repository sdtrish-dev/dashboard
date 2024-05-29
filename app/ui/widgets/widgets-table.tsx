import { UpdateWidget, DeleteWidget } from '@/app/ui/widgets/widget-buttons';
import { fetchFilteredWidgets } from '@/app/lib/data';
import {
    CurrencyDollarIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import type { WidgetsTable } from '@/app/lib/definitions';
import WidgetsData from '@/app/ui/widgets/widgets-data';
import DragDropWidgetsTable from '@/app/ui/widgets/drag-and-drop-widgets';

export default async function WidgetsTable({
    query,
    currentPage,
    onlyShowAlerts = false,
}: {
    query: string;
    currentPage: number;
    onlyShowAlerts?: boolean;
}) {
    const widgets = await fetchFilteredWidgets(query, currentPage);
    const stocks = widgets?.filter((widget) => widget.type === 'stock');
    const cryptocurrencies = widgets?.filter((widget) => widget.type === 'cryptocurrency');


    return (
        <DragDropWidgetsTable onlyShowAlerts={onlyShowAlerts}/>
    );
}

export function WidgetCard({ widget, onlyShowAlerts }: { widget: WidgetsTable, onlyShowAlerts: boolean }) {
  return (
    <>
    {!onlyShowAlerts ? (
    <div key={widget.id} className="mb-2 w-full rounded-md bg-white p-4 shadow-lg">
      <div className="xl:flex justify-between items-start">
        <div className="flex items-start xl:gap-8 gap-12 pb-4">
            <>
              {widget.type === 'cryptocurrency' ? (
                <CurrencyDollarIcon className="lg:mr-4 mr-0 lg:h-6 lg:w-6 h-10 w-10" />
              ) : (
                <BanknotesIcon className="lg:mr-4 mr-0 lg:h-6 lg:w-6 h-10 w-10" />
              )}
              <div className="lg:flex xl:gap-20 lg:gap-8">
                <div>
                  <h3 className="text-lg font-medium">{widget.name}</h3>
                  <p className="text-sm text-gray-500"><b>Symbol:</b> {widget.symbol}</p>
                  <p className="text-sm text-gray-500"><b>Refresh Rate:</b> {widget.refresh_rate / 3600000}hrs</p>
                  <p className="text-sm text-gray-500"><b>Type:</b> {widget.type}</p>
                </div>
              </div>
            </>
          <WidgetsData 
            symbol={widget.symbol} 
            type={widget.type} 
            refreshRate={widget.refresh_rate}
            showAlert={false}
          /> 
        </div>
          <div className="flex gap-2 justify-end">
            <UpdateWidget id={widget.id} />
            <DeleteWidget id={widget.id} />
          </div>
       
      </div>
    </div>
      ) : (
        <div className="mb-2">
          <WidgetsData 
              symbol={widget.symbol} 
              type={widget.type} 
              refreshRate={widget.refresh_rate}
              showAlert={true}
            />
        </div>
          )}
        </>
  );
}

