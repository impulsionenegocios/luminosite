export interface buttonsData {
  href: string;
  label: string;
  variant: string;
  page_slug: string;
}

const directusUrl = import.meta.env.PUBLIC_DIRECTUS_INTERNAL_URL;

export async function getButtons(page_slug: string): Promise<buttonsData[]> {
  try {
    const res = await fetch(
      `${directusUrl}/items/buttons?fields=*&filter[page_slug][_eq]=${page_slug}`,
    );

    if (!res.ok) {
      throw new Error(`Erro ao buscar os botões: ${res.statusText}`);
    }

    const json = await res.json();

    return json.data.map((button: any) => ({
      variant: button.variant,
      href: button.href,
      label: button.label,
      page_slug: button.page_slug,
    }));
  } catch (error) {
    console.error('Erro ao buscar botões:', error);
    return [];
  }
}
