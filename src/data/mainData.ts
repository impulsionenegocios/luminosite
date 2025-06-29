import type { string } from 'astro:schema';
export interface faqItem {
  question: string;
  answer: string;
}
export interface mainData {
  nome?: string;
  descricao?: string;
  logo_escura?: string;
  logo_clara?: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  endereco?: string;
  numero_cro?: number | string;
  responsavel_tecnico?: string;
  link_instagram?: string;
  link_facebook?: string;
  link_google?: string;
  google_maps_link?: string;
  link_maps?: string;
  link_whatsapp?: string;
  link_youtube?: string;
  faq: faqItem[];
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

export async function getMainData(): Promise<mainData | null> {
  try {
const url = `${apiUrl}/items/clinicData/1?fields=*,faq.main_faq_id.*&deep[faq][main_faq_id]=*`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new DirectusError(
        `Erro ao buscar os dados da clínica: ${res.statusText}`,
        res.status,
        url,
      );
    }

    const json = await res.json();
    const item = json.data;

    if (!item) return null;

    const mappedMainData: mainData = {
      nome: item.nome,
      numero_cro: item.numero_cro,
      responsavel_tecnico: item.responsavel_tecnico,
      telefone: item.telefone,
      whatsapp: item.whatsapp,
      email: item.email,
      endereco: item.endereco,
      descricao: item.descricao,
      logo_escura: item.logo_escura
        ? `${assetsUrl}/assets/${item.logo_escura}?width=160&height=80&format=webp&quality=80`
        : '/images/placeholder-logo.jpg',
      logo_clara: item.logo_clara
        ? `${assetsUrl}/assets/${item.logo_clara}?width=380&height=80&format=webp&quality=80`
        : '/images/placeholder-logo.jpg',
      link_instagram: item.link_instagram,
      link_facebook: item.link_facebook,
      google_maps_link: item.google_maps_link,
      link_maps: item.link_maps,
      link_google: item.link_google,
      link_whatsapp: item.link_whatsapp,
      link_youtube: item.link_youtube,
faq: Array.isArray(item.faq)
  ? item.faq.map((rel: any) => ({
      question: rel.main_faq_id?.question ?? '',
      answer: rel.main_faq_id?.answer ?? '',
    }))
  : [],
    };
    return mappedMainData;

  } catch (err) {
    console.error(err);
    throw err;
  }
}

// export async function getMainDataPublic(): Promise<mainData | null> {
//   try {
//     const url = `${assetsUrl}/items/clinicData/1`;
//     const res = await fetch(url, {
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!res.ok) {
//       throw new DirectusError(
//         `Erro ao buscar os dados da clínica: ${res.statusText}`,
//         res.status,
//         url,
//       );
//     }

//     const json = await res.json();
//     const item = json.data;

//     if (!item) return null;

//     const mappedMainData: mainData = {
//       logo_escura: item.logo_escura
//         ? `${assetsUrl}/assets/${item.logo_escura}?width=160&height=80&format=webp&quality=80`
//         : '/images/placeholder-logo.jpg',
//       logo_clara: item.logo_clara
//         ? `${assetsUrl}/assets/${item.logo_clara}?width=160&height=80&format=webp&quality=80`
//         : '/images/placeholder-logo.jpg',
//     };

//     return mappedMainData;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }
