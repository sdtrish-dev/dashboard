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
      <ReorderableWidgetList widgets={stocks} onReorder={setStocks} />
      <ReorderableWidgetList widgets={cryptocurrencies} onReorder={setCryptocurrencies} />
    </>
  );
}