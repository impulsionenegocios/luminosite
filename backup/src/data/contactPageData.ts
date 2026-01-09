import type { string } from 'astro:schema';
export interface Horarios {
  dia: string;
  horario: string;
}
export interface mainData {
  title?: string;
  subtitle?: string;
  description?: string;
  horarios: Horarios[];
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

export async function getContactPageData(): Promise<mainData | null> {
  try {
const url = `${apiUrl}/items/contato/1?fields=*,horarios.horarios_id.*&deep[horarios][horarios_id]=*`;
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

    const mappedContactData: mainData = {
      title: item.title,
      subtitle: item.subtitle,
      description: item.responsavel_tecnico,
        horarios: Array.isArray(item.horarios)
  ? item.horarios.map((rel: any) => ({
      dia: rel.horarios_id?.dia ?? '',
      horario: rel.horarios_id?.horario ?? '',
    }))
  : [],


    };
    return mappedContactData;

  } catch (err) {
    console.error(err);
    throw err;
  }
}