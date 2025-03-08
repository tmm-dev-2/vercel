import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  const response = await fetch(
    `https://symbol-search.tradingview.com/symbol_search/v2/suggest?text=${encodeURIComponent(query as string)}&type=stock,crypto,forex,index`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Origin': 'https://www.tradingview.com'
      }
    }
  );

  const data = await response.json();
  res.json(data);
}
