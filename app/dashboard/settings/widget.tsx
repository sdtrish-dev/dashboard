// ParentComponent.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWidgetData, fetchLatestWidgetData } from '@/app/lib/financeService';
import WidgetDisplay from '@/app/ui/widgets/widget-display';

const Widget: React.FC = () => {
  const dispatch = useDispatch();
  const { widgetData, loading, error } = useSelector((state: any) => state);
  const [widgetId, setWidgetId] = useState<string | null>(null);

useEffect(() => {
    if (widgetId === null) return;

    fetchLatestWidgetData(Number(widgetId)).then(data => {
        setWidgetId(data.id.toString());
    }).catch(error => {
        console.error('Failed to fetch latest widget data:', error);
    });
}, [widgetId]);

  useEffect(() => {
    if (widgetId === null) return;

    dispatch(fetchWidgetData(widgetId));

    const intervalId = setInterval(() => {
      dispatch(fetchWidgetData(widgetId));
    }, 5000); // Fetch new data every 5 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, [dispatch, widgetId]);

  return (
    <WidgetDisplay widgetData={widgetData} loading={loading} error={error} />
  );
};

export default Widget;