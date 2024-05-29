'use client';
import { useState, useEffect } from 'react';
import { fetchFilteredWidgets } from '@/app/lib/data';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { WidgetCard } from '@/app/ui/widgets/widgets-table';
import type { WidgetsTable } from '@/app/lib/definitions';

export function ReorderableWidgetList({ widgets, onReorder, droppableId, onlyShowAlerts }: { widgets: any, onReorder: (newWidgets: any) => void, droppableId: string, onlyShowAlerts: boolean }) {  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newWidgets = Array.from(widgets);
    const [reorderedWidget] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, reorderedWidget);

    onReorder(newWidgets);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {widgets.length > 0 && (
        <Droppable droppableId={droppableId}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {widgets.map((widget: { id: string; refresh_rate: number; type: string; name: string; symbol: string; }, index: number) => (
              <Draggable key={widget.id} draggableId={widget.id.toString()} index={index}>
                {(provided) => (
                  <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <WidgetCard widget={widget} onlyShowAlerts={onlyShowAlerts}/>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable> )}
    </DragDropContext>
  );
}

export default function DragDropWidgetsTable({ onlyShowAlerts }: { onlyShowAlerts: boolean }) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [stocks, setStocks] = useState<WidgetsTable[]>([]);
  const [cryptocurrencies, setCryptocurrencies] = useState<WidgetsTable[]>([]);

  useEffect(() => {
    fetch(`/api/widgets?query=${query}&currentPage=${currentPage}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((widgets) => {
        const stocks = widgets.filter((widget: { type: string; }) => widget.type === 'stock');
        const cryptocurrencies = widgets.filter((widget: { type: string; }) => widget.type === 'cryptocurrency');
        
        setStocks(stocks);
        setCryptocurrencies(cryptocurrencies);
      })
      .catch((error) => {
        console.error('Failed to fetch widgets:', error);
      });
  }, [query, currentPage]);

  return (
    <>
      <div className="flow-root">
        <div className="inline-block w-full align-middle">
          <div className="rounded-lg bg-gray-50 mb-8 xl:flex justify-between">
            <div className="xl:w-1/2 p-2">
              <h2 className="text-lg font-medium mb-2">Stocks</h2>
              <ReorderableWidgetList widgets={stocks} onReorder={setStocks} droppableId="stocks" onlyShowAlerts={onlyShowAlerts} />
            </div>
            <div className="xl:w-1/2 p-2">
              <h2 className="text-lg font-medium mb-2">Cryptocurrencies</h2>
              <ReorderableWidgetList widgets={cryptocurrencies} onReorder={setCryptocurrencies} droppableId="cryptocurrencies"  onlyShowAlerts={onlyShowAlerts}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}