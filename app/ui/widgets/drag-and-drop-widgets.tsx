'use client';
import { useState, useEffect } from 'react';
import { fetchFilteredWidgets } from '@/app/lib/data';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { WidgetCard } from '@/app/ui/widgets/widgets-table';
import type { WidgetsTable } from '@/app/lib/definitions';

export function ReorderableWidgetList({ widgets, onReorder }: { widgets: any, onReorder: (newWidgets: any) => void }) {
  const onDragEnd = (result: any) => {
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
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {widgets.map((widget: { id: any; refresh_rate: number; type: string; name: string; symbol: string; }, index: number) => (
              <Draggable key={widget.id} draggableId={widget.id} index={index}>
                {(provided) => (
                  <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <WidgetCard widget={widget} onlyShowAlerts={false}/>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default function DragDropWidgetsTable() {
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
    <div className="mt-6 flow-root">
            <div className="inline-block w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 mb-8 xl:flex justify-between">
                    <div className="xl:w-1/2 pr-2">
                        <h2 className="text-lg font-medium mb-2">Stocks</h2>
                        <ReorderableWidgetList widgets={stocks} onReorder={setStocks} />
                    </div>
                    <div className="xl:w-1/2 xl:pl-2 pl-0">
                        <h2 className="text-lg font-medium mb-2">Cryptocurrencies</h2>
                        <ReorderableWidgetList widgets={cryptocurrencies} onReorder={setCryptocurrencies} />
                    </div>
                </div>
            </div>
        </div>
      
      
    </>
  );
}