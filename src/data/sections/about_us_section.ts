export interface AboutUsItem {
  id: number;
  title: string;
  description: string;
  sort?: number;
}

export interface AboutUsData {
  title?: string;
  title_accent?: string;
  subtitle?: string;
  description?: string;
  imagem?: string;
  items: AboutUsItem[];
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

export async function getAboutUsData(): Promise<AboutUsData | null> {
  try {
    const url = `${apiUrl}/items/about_us_section/1?fields=*,items.about_us_section_items_id.*&deep[items][about_us_section_items_id]=true`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new DirectusError(`Erro ao buscar dados da seção Sobre`, res.status, url);
    }

    const json = await res.json();
    const item = json.data;

    if (!item) return null;

    const mapped: AboutUsData = {
      title: item.title,
      title_accent: item.title_accent,
      subtitle: item.subtitle,
      description: item.description,
      imagem: item.imagem,
      items:
        item.items?.map((rel: any) => ({
          id: rel.about_us_section_items_id?.id,
          title: rel.about_us_section_items_id?.title,
          description: rel.about_us_section_items_id?.description,
          sort: rel.about_us_section_items_id?.sort,
        })) || [],
    };

    return mapped;
  } catch (err) {
    console.error('Erro ao buscar dados da seção About Us:', err);
    throw err;
  }
}
