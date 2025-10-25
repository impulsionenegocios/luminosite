import { clearCache, redis } from '../../lib/cache';

export const GET = async ({ request }) => {
  const auth = request.headers.get('authorization');

  // Proteção simples por token
  if (auth !== `Bearer ${import.meta.env.API_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Limpa cache da home
  await clearCache('home_page_data');

  // Limpa cache da lista de serviços
  await clearCache('services:list');

  // Limpa todos os serviços individuais (service:*)
  const serviceKeys = await redis.keys('service:*');
  if (serviceKeys.length > 0) {
    await redis.del(...serviceKeys);
  }

  return new Response(`Todos os caches limpos com sucesso! (home + ${serviceKeys.length} serviços)`);
};