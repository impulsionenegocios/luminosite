// data/servicesData.ts - Versão Corrigida com YayForms
import { getCachedData } from '../lib/cache';

export interface ServiceData {
  slug: string;
  status: string;
  sort: number | null;
  date_created: string;
  date_updated: string;
  service_name: string;
  heroImage: string;
  heroSubtitle: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroDescription: string;
  heroPrimaryButton: number;
  heroSecondaryButton: number;

  benefitsTitle: string;
  benefitsTitleAccent: string;
  benefitsDescription: string;
  benefits: Benefit[];

  forWho: ForWho[];

  casesTitle: string;
  casesTitleAccent: string;
  casesDescription: string;
  casesBeforeAfter: BeforeAfter[];
  CasesButtonTitle: string;

  authTitle: string;
  authTitleAccent: string;
  authDescription: string;
  authFeaturedImage: string;
  authBadgeTitleOne: string;
  authBadgeTitleTwo: string;
  authItems: AuthItem[];

  faqTitle: string;
  faqTitleAccent: string;
  faqItems: FaqItem[];

  ctaTitle: string;
  ctaTitleAccent: string;
  ctaDescription: string;
  YayFormsSlug: string;
  YayFormsId: string;
}

interface Benefit {
  id: number;
  title: string;
  icon: string;
  text: string;
}

interface ForWho {
  id: number;
  icon: string;
  text: string;
}

interface BeforeAfter {
  id: number;
  before: string;
  after: string;
  title: string;
  description: string;
}

interface AuthItem {
  id: number;
  value: string;
  description: string;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

// Classe de erro customizada para problemas com o Directus
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

const directusUrl = import.meta.env.PUBLIC_DIRECTUS_INTERNAL_URL;
const directusPublicUrl = import.meta.env.PUBLIC_DIRECTUS_EXTERNAL_URL;

// Função principal para buscar serviço por slug
export async function getServiceBySlug(slug: string): Promise<ServiceData | null> {
  return await getCachedData(`service:${slug}`, async () => {
    try {
      const url =
        `${directusUrl}/items/services` +
        `?filter[slug][_eq]=${encodeURIComponent(slug)}` +
        `&filter[status][_eq]=published` +
        `&fields=` +
        [
          'slug', 'status', 'sort', 'date_created', 'date_updated', 'service_name',
          'heroImage', 'heroSubtitle', 'heroTitle', 'heroTitleAccent', 'heroDescription',
          'heroPrimaryButton', 'heroSecondaryButton',
          'benefitsTitle', 'benefitsTitleAccent', 'benefitsDescription',
          'benefits.services_benefits_id.id', 'benefits.services_benefits_id.title',
          'benefits.services_benefits_id.icon', 'benefits.services_benefits_id.text',
          'forWho.services_for_who_id.id', 'forWho.services_for_who_id.icon', 'forWho.services_for_who_id.text',
          'casesTitle', 'casesTitleAccent', 'casesDescription', 'CasesButtonTitle',
          'casesBeforeAfter.id', 'casesBeforeAfter.services_before_after_id.id',
          'casesBeforeAfter.services_before_after_id.title', 'casesBeforeAfter.services_before_after_id.description',
          'casesBeforeAfter.services_before_after_id.before', 'casesBeforeAfter.services_before_after_id.after',
          'authTitle', 'authTitleAccent', 'authDescription', 'authFeaturedImage',
          'authBadgeTitleOne', 'authBadgeTitleTwo',
          'authItems.services_auth_items_id.id', 'authItems.services_auth_items_id.value',
          'authItems.services_auth_items_id.description',
          'faqTitle', 'faqTitleAccent', 'faqItems.services_faq_id.id',
          'faqItems.services_faq_id.question', 'faqItems.services_faq_id.answer',
          'ctaTitle', 'ctaTitleAccent', 'ctaDescription',
          'yay_forms.id', 'yay_forms.slug', 'yay_forms.form_id',
        ].join(',') +
        `&deep[casesBeforeAfter][_limit]=-1` +
        `&limit=1`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const error = new DirectusError(`Erro ao buscar serviço: ${res.statusText}`, res.status, url);
        console.error(`❌ Erro HTTP ${res.status}: ${res.statusText}`);
        throw error;
      }

      const json = await res.json();

      if (!json.data || json.data.length === 0) {
        console.warn(`⚠️ Serviço '${slug}' não encontrado`);
        return null;
      }

      const service = json.data[0];

      return transformServiceData(service);
    } catch (error) {
      console.error('❌ Erro crítico ao buscar serviço:', error);
      throw error;
    }
  });
}

// Função para transformar dados do Directus para o formato ServiceData
function transformServiceData(service: any): ServiceData {
  // Helper para processar relacionamentos many-to-many
  const processRelationship = (items: any[], idField: string) => {
    if (!Array.isArray(items)) {
      return [];
    }
    return items
      .map((item: any) => {
        const relatedItem = item[idField];
        if (!relatedItem) {
          console.warn(`⚠️ Item sem ${idField}:`, item);
          return null;
        }
        return relatedItem;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => (a.sort || a.id) - (b.sort || b.id));
  };

  // Processa benefits
  const benefits: Benefit[] = processRelationship(service.benefits || [], 'services_benefits_id');

  // Processa forWho
  const forWho: ForWho[] = processRelationship(service.forWho || [], 'services_for_who_id');

  // Processa authItems - CORRIGIDO
  let authItems: AuthItem[] = [];
  if (Array.isArray(service.authItems) && service.authItems.length > 0) {
    // Se authItems contém apenas IDs, vamos processar
    if (typeof service.authItems[0] === 'number') {
      // Mock data temporário - você pode implementar uma busca separada aqui
      authItems = service.authItems.map((id: number, index: number) => ({
        id,
        value: index === 0 ? '500+' : index === 1 ? '98%' : '5★',
        description:
          index === 0 ? 'Pacientes atendidos' : index === 1 ? 'Satisfação' : 'Avaliação média',
      }));
    } else {
      // Se já vem com os dados completos
      authItems = processRelationship(service.authItems, 'services_auth_items_id');
    }
  }

  // Processa faqItems
  const faqItems: FaqItem[] = processRelationship(service.faqItems || [], 'services_faq_id');

  // Processa casesBeforeAfter
  let casesBeforeAfter: BeforeAfter[] = [];

  if (Array.isArray(service.casesBeforeAfter) && service.casesBeforeAfter.length > 0) {
    casesBeforeAfter = service.casesBeforeAfter
      .map((item: any, index: number) => {
        const caseData = item.services_before_after_id;
        if (!caseData) {
          console.warn(`⚠️ Caso ${index} sem dados válidos:`, item);
          return null;
        }

        const processedCase = {
          id: caseData.id,
          title: caseData.title || `Caso ${caseData.id}`,
          description: caseData.description || '',
          before: caseData.before
            ? `${directusPublicUrl}/assets/${caseData.before}?width=300&height=300&format=webp&quality=80`
            : '',
          after: caseData.after
            ? `${directusPublicUrl}/assets/${caseData.after}?width=300&height=300&format=webp&quality=80`
            : '',
        };

        return processedCase;
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.id - b.id);
  } else {
    console.warn(
      '⚠️ casesBeforeAfter não é um array válido ou está vazio:',
      service.casesBeforeAfter,
    );
  }

  const transformedService: ServiceData = {
    // Campos básicos
    slug: service.slug,
    status: service.status,
    sort: service.sort,
    date_created: service.date_created,
    date_updated: service.date_updated,
    service_name: service.service_name,

    // Hero Section
    heroImage: service.heroImage
      ? `${directusPublicUrl}/assets/${service.heroImage}?width=1920&height=1080&format=webp&quality=80`
      : '/images/placeholder-service.jpg',
    heroSubtitle: service.heroSubtitle || '',
    heroTitle: service.heroTitle || '',
    heroTitleAccent: service.heroTitleAccent || '',
    heroDescription: service.heroDescription || '',
    heroPrimaryButton: service.heroPrimaryButton || 0,
    heroSecondaryButton: service.heroSecondaryButton || 0,

    // Benefits Section
    benefitsTitle: service.benefitsTitle || '',
    benefitsTitleAccent: service.benefitsTitleAccent || '',
    benefitsDescription: service.benefitsDescription || '',
    benefits,

    // For Who Section
    forWho,

    // Cases Section
    casesTitle: service.casesTitle || '',
    casesTitleAccent: service.casesTitleAccent || '',
    casesDescription: service.casesDescription || '',
    casesBeforeAfter,
    CasesButtonTitle: service.CasesButtonTitle || 'Ver Mais Casos',

    // Auth Section
    authTitle: service.authTitle || '',
    authTitleAccent: service.authTitleAccent || '',
    authDescription: service.authDescription || '',
    authFeaturedImage: service.authFeaturedImage
      ? `${directusPublicUrl}/assets/${service.authFeaturedImage}?width=580&height=420&format=webp&quality=80`
      : '',
    authBadgeTitleOne: service.authBadgeTitleOne || '',
    authBadgeTitleTwo: service.authBadgeTitleTwo || '',
    authItems,

    // FAQ Section
    faqTitle: service.faqTitle || '',
    faqTitleAccent: service.faqTitleAccent || '',
    faqItems,

    // CTA Section
    ctaTitle: service.ctaTitle || '',
    ctaTitleAccent: service.ctaTitleAccent || '',
    ctaDescription: service.ctaDescription || '',

    // YAY FORMS - CORRIGIDO: acessando os campos corretos
    YayFormsSlug: service.yay_forms?.slug || '',
    YayFormsId: service.yay_forms?.form_id || '',
  };

  return transformedService;
}

// Função para obter todos os serviços
export async function getAllServices(): Promise<ServiceData[]> {
  return await getCachedData('services:list', async () => {
    try {
      const url =
        `${directusUrl}/items/services` +
        `?filter[status][_eq]=published` +
        `&fields=` +
        [
          'slug',
          'status',
          'sort',
          'date_created',
          'date_updated',
          'service_name',
          'heroImage',
          'heroSubtitle',
          'heroTitle',
          'heroTitleAccent',
          'heroDescription',
          'heroPrimaryButton',
          'heroSecondaryButton',
          'yay_forms.slug',
          'yay_forms.form_id',
        ].join(',') +
        `&sort=sort,date_created`;

      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const error = new DirectusError(
          `Erro ao buscar todos os serviços: ${res.statusText}`,
          res.status,
          url,
        );
        console.error(`❌ Erro ao buscar todos os serviços: ${res.status}`);
        throw error;
      }

      const json = await res.json();
      if (!json.data || json.data.length === 0) {
        return [];
      }

      const mappedServices: ServiceData[] = json.data.map((service: any) => ({
        slug: service.slug,
        status: service.status,
        sort: service.sort,
        date_created: service.date_created,
        date_updated: service.date_updated,
        service_name: service.service_name,

        heroImage: service.heroImage
          ? `${directusPublicUrl}/assets/${service.heroImage}?width=570&height=410&format=webp&quality=80`
          : '/images/placeholder-service.jpg',
        heroSubtitle: service.heroSubtitle || '',
        heroTitle: service.heroTitle || '',
        heroTitleAccent: service.heroTitleAccent || '',
        heroDescription: service.heroDescription || '',
        heroPrimaryButton: service.heroPrimaryButton || 0,
        heroSecondaryButton: service.heroSecondaryButton || 0,

        YayFormsSlug: service.yay_forms?.slug || '',
        YayFormsId: service.yay_forms?.form_id || '',

        // Campos que não vêm na listagem
        benefitsTitle: '',
        benefitsTitleAccent: '',
        benefitsDescription: '',
        benefits: [],
        forWho: [],
        casesTitle: '',
        casesTitleAccent: '',
        casesDescription: '',
        casesBeforeAfter: [],
        CasesButtonTitle: '',
        authTitle: '',
        authTitleAccent: '',
        authDescription: '',
        authFeaturedImage: '',
        authBadgeTitleOne: '',
        authBadgeTitleTwo: '',
        authItems: [],
        faqTitle: '',
        faqTitleAccent: '',
        faqItems: [],
        ctaTitle: '',
        ctaTitleAccent: '',
        ctaDescription: '',
      }));

      return mappedServices;
    } catch (error) {
      console.error('❌ Erro ao buscar todos os serviços:', error);
      throw error;
    }
  });
}

// Função para obter caminhos estáticos (útil para getStaticPaths)
export async function getServicePaths() {
  try {
    const services = await getAllServices();
    const paths = services.map((service) => ({
      params: { slug: service.slug },
    }));

    return paths;
  } catch (error) {
    console.error('❌ Erro ao obter caminhos dos serviços:', error);
    return [];
  }
}

// Função utilitária para verificar se um serviço existe
export async function serviceExists(slug: string): Promise<boolean> {
  try {
    const url =
      `${directusUrl}/items/services` +
      `?filter[slug][_eq]=${encodeURIComponent(slug)}` +
      `&filter[status][_eq]=published` +
      `&fields=slug` +
      `&limit=1`;

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`❌ Erro ao verificar serviço: ${res.status}`);
      return false;
    }

    const json = await res.json();
    const exists = json.data && json.data.length > 0;

    return exists;
  } catch (error) {
    console.error(`❌ Erro ao verificar existência do serviço ${slug}:`, error);
    return false;
  }
}
