// pages/api/financial-data.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFinancialData } from './financial-services';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { symbol, type, refreshRate } = req.query;

    try {
        const data = await fetchFinancialData(String(symbol), String(type), Number(refreshRate));
        // console.log(data);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
}