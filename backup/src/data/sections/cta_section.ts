export interface CTAItem {
  id: number;
  icon: string;
  text: string;
}

export interface CTASectionData {
  title: string;
  description: string;
  items: CTAItem[];
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

export async function getContactCTAData(): Promise<CTASectionData | null> {
  try {
    const url = `${apiUrl}/items/cta_section/1?fields=*,item.cta_section_item_id.*&deep[item][cta_section_item_id]=true`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new DirectusError('Erro ao buscar dados da seção CTA', res.status, url);
    }

    const json = await res.json();
    const item = json.data;

    if (!item) return null;

    const mapped: CTASectionData = {
      title: item.title,
      description: item.description,
      items:
        item.item?.map((rel: any) => {
          const cta = rel.cta_section_item_id;
          return {
            id: cta.id,
            icon: cta.icon,
            text: cta.text,
          };
        }) || [],
    };

    return mapped;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
