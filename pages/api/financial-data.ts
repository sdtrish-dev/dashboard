import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFinancialData } from '../../app/lib/financial-services';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { symbol, type, refreshRate } = req.query;

    if (!symbol || !type || !refreshRate) {
        res.status(400).json({ message: 'Missing required query parameters' });
        return;
    }

    try {
        const data = await fetchFinancialData(String(symbol), String(type), Number(refreshRate));
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}
