export interface localizationData {
  title: string; // Corrigido de number para string
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

export async function getLocalizationData(): Promise<localizationData | null> {
  try {
    const url = `${apiUrl}/items/localization_section/`;
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
    const item = json.data;

    if (!item) return null;

    const mappedLocalizationData: localizationData = {
      title: item.title, // Corrigido de item.value para item.title
      description: item.description,
    };

    return mappedLocalizationData;
  } catch (err) {
    console.error('Erro ao buscar dados de localização:', err);
    throw err;
  }
}
