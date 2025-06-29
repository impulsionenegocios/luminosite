import { clearCache } from '../../lib/cache';

export const GET = async ({ request }) => {
  const auth = request.headers.get('authorization');

  // Proteção simples por token
  if (auth !== `Bearer ${import.meta.env.API_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  await clearCache('home_page_data');

  return new Response('Cache da home limpo com sucesso!');
};
