export interface GalleryItem {
  id: number;
  image: string;
  title: string;
  description?: string;
}

export interface GalleryData {
  title?: string;
  description?: string;
  items: GalleryItem[];
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

export async function getGalleryData(): Promise<GalleryData | null> {
  try {
    const url = `${apiUrl}/items/gallery_section/1?fields=*,items.gallery_section_item_id.*&deep[items][gallery_section_item_id]=true`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new DirectusError(`Erro ao buscar dados da galeria`, res.status, url);
    }

    const json = await res.json();
    const item = json.data;

    if (!item) return null;

    const mappedData: GalleryData = {
      title: item.title,
      description: item.description,
      items:
        item.items?.map((rel: any) => {
          const galleryItem = rel.gallery_section_item_id;
          return {
            id: galleryItem.id,
            image: galleryItem.image
              ? `${assetsUrl}/assets/${galleryItem.image}?width=800&height=600&format=webp&quality=85`
              : '/images/gallery-placeholder.jpg',
            title: galleryItem.title,
            description: galleryItem.description,
          };
        }) || [],
    };

    return mappedData;
  } catch (err) {
    console.error('Erro ao buscar dados da galeria:', err);
    throw err;
  }
}
