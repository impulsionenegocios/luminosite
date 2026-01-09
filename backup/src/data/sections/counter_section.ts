export interface counterItems {
  value: number;
  description: string;
}

export class DirectusError extends Error {
  constructor(
    message: string,
    public status?: number,
    public url?: string,
  ) {
    super(message);
    this.name = 'DirectusError';
  }
}

const apiUrl = import.meta.env.PUBLIC_DIRECTUS_INTERNAL_URL;

export async function getCounterItems(): Promise<counterItems[]> {
  // Retorna array em vez de item único
  try {
    const url = `${apiUrl}/items/counter_items/`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new DirectusError(`Erro ao buscar: ${res.statusText}`, res.status, url);
    }

    const json = await res.json();
    const items = json.data; // Assumindo que retorna um array de items

    if (!items || !Array.isArray(items)) return [];

    const mappedCounterItems: counterItems[] = items.map((item: any) => ({
      value: item.value,
      description: item.description,
    }));

    return mappedCounterItems;
  } catch (err) {
    console.error('Erro ao buscar counter items:', err);
    throw err;
  }
}
