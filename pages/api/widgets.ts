import {fetchFilteredWidgets} from '@/app/lib/data';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function widgetHandler(req: NextApiRequest, res: NextApiResponse) {
    const { query = '', currentPage = '' } = req.query;

    try {
        const data = await fetchFilteredWidgets(String(query), Number(currentPage));
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}