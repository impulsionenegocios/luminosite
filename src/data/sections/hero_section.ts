export interface HeroButton {
  id: number;
  label: string;
  href: string;
  variant?: 'solid' | 'outline';
}

export interface HeroData {
  title?: string;
  subtitle?: string;
  description?: string;
  bg_image?: string;
  buttons: HeroButton[];
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

export async function getHeroData(): Promise<HeroData | null> {
  try {
    const url = `${apiUrl}/items/hero_section/1?fields=*,buttons.buttons_id.*&deep[buttons][buttons_id]=true`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new DirectusError(`Erro ao buscar dados do Hero Section`, res.status, url);
    }

    const json = await res.json();
    const item = json.data;

    if (!item) return null;

    const mappedHeroData: HeroData = {
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      bg_image: item.bg_image
        ? `${assetsUrl}/assets/${item.bg_image}?width=1920&height=1080&format=webp&quality=80`
        : '/images/placeholder-bg.jpg',
      buttons:
        item.buttons?.map((btn: any) => ({
          id: btn.buttons_id?.id,
          label: btn.buttons_id?.label,
          href: btn.buttons_id?.href,
          variant: btn.buttons_id?.variant ?? 'solid',
        })) || [],
    };

    return mappedHeroData;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
