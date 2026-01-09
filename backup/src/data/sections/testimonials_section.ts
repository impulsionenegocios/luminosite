export interface TestimonialItem {
  id: number;
  name: string;
  text: string;
  title?: string;
  image?: string;
}

export interface TestimonialSectionData {
  title: string;
  description: string;
  items: TestimonialItem[];
}

const apiUrl = import.meta.env.PUBLIC_DIRECTUS_INTERNAL_URL;
const assetsUrl = import.meta.env.PUBLIC_DIRECTUS_EXTERNAL_URL;

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

export async function getTestimonialsData(): Promise<TestimonialSectionData | null> {
  try {
    const url = `${apiUrl}/items/testimonial_section/1?fields=*,item.testimonial_section_item_id.*&deep[item][testimonial_section_item_id]=true`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new DirectusError('Erro ao buscar dados dos depoimentos', res.status, url);
    }

    const json = await res.json();
    const item = json.data;

    if (!item) return null;

    const mapped: TestimonialSectionData = {
      title: item.title,
      description: item.description,
      items:
        item.item?.map((rel: any) => {
          const t = rel.testimonial_section_item_id;
          return {
            id: t.id,
            name: t.name,
            text: t.text,
            title: t.title,
            image: t.image
              ? `${assetsUrl}/assets/${t.image}?width=100&height=100&format=webp&quality=80`
              : '/images/placeholder-avatar.jpg',
          };
        }) || [],
    };

    return mapped;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
