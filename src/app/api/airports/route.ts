import { NextRequest, NextResponse } from 'next/server';
import { getAirportByIata } from 'airport-data-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const codes = req.nextUrl.searchParams.get('codes');
  if (!codes) {
    return NextResponse.json({ error: 'Missing codes parameter' }, { status: 400 });
  }

  const iataList = codes
    .split(',')
    .map((c) => c.trim().toUpperCase())
    .filter((c) => c.length === 3);

  if (iataList.length === 0) {
    return NextResponse.json({ airports: {} });
  }

  const airports: Record<
    string,
    {
      iata: string;
      name: string;
      latitude: number;
      longitude: number;
      city: string;
      country: string;
      timezone: string;
      type: string;
    }
  > = {};

  await Promise.all(
    iataList.map(async (code) => {
      try {
        const results = await getAirportByIata(code);
        if (results && results.length > 0) {
          const a = results[0];
          airports[code] = {
            iata: a.iata,
            name: a.airport,
            latitude: parseFloat(a.latitude),
            longitude: parseFloat(a.longitude),
            city: a.airport?.split(' ')[0] || '',
            country: a.country_code,
            timezone: a.time,
            type: a.type,
          };
        }
      } catch {
        // Airport not found, skip
      }
    })
  );

  return NextResponse.json(
    { airports },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    }
  );
}
