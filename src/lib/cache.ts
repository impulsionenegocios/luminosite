import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

export async function getCachedData<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const cached = await redis.get(key);

  if (cached) {
    console.log(`[CACHE] Usando cache de Redis para a chave: ${key}`);
    return JSON.parse(cached);
  }

  console.log(`[CACHE] Nada em cache para chave: ${key}. Buscando dados do Directus...`);

  const freshData = await fetchFn();
  await redis.set(key, JSON.stringify(freshData));
  console.log(`[CACHE] Dados salvos em cache com a chave: ${key}`);
  return freshData;
}

export async function clearCache(key: string) {
  await redis.del(key);
  console.log(`[CACHE] Cache removido para a chave: ${key}`);
}