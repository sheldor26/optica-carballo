import { NextResponse, type NextRequest } from 'next/server';
import { searchCatalog } from '@/lib/catalog/search';

/**
 * Search del header y del comparador. GET liviano (no Server Action):
 * cada tecleo solo pega a este endpoint, sin disparar el refresh de ruta
 * completo que Next.js hace en cada invocación de una Server Action.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  const results = await searchCatalog(q);

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
