export interface seoPages {
  slug: string;
  title: string;
  description: string;
  noindex: boolean;
  nofollow: boolean;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  structured_data: string;
}

const apiUrl = import.meta.env.PUBLIC_DIRECTUS_INTERNAL_URL;

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

export async function getSeoPagesData(slug: string): Promise<seoPages | null> {
  try {
    const url = `${apiUrl}/items/seo_pages?filter[slug][_eq]=${slug}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new DirectusError('Erro ao buscar dados da página de SEO', res.status, url);
    }

    const json = await res.json();

    // A resposta do Directus normalmente vem como { data: [...] }
    const item = Array.isArray(json.data) ? json.data[0] : null;

    if (!item) return null;

    const mapped: seoPages = {
      slug: item.slug,
      title: item.title,
      description: item.description,
      noindex: item.noindex,
      nofollow: item.nofollow,
      og_title: item.og_title,
      og_description: item.og_description,
      og_image: item.og_image,
      twitter_card: item.twitter_card,
      structured_data: item.structured_data,
    };

    return mapped;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
