import type { APIRoute } from 'astro';
import { getBlogPosts } from '@/data/blogData';
import { getAllServices } from '@/data/servicesData';

const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://luminoclinica.com.br';

// Páginas estáticas do site
const staticPages = [
  { url: '', changefreq: 'daily', priority: '1.0' }, // Home
  { url: '/blog', changefreq: 'daily', priority: '0.9' },
  { url: '/servicos', changefreq: 'weekly', priority: '0.9' },
  { url: '/contato', changefreq: 'monthly', priority: '0.8' },
  { url: '/equipe', changefreq: 'monthly', priority: '0.7' },
  { url: '/politicas-de-privacidade', changefreq: 'yearly', priority: '0.3' },
  { url: '/termos-de-uso', changefreq: 'yearly', priority: '0.3' },
];

function generateSitemapXML(urls: Array<{ url: string; lastmod?: string; changefreq: string; priority: string }>): string {
  const urlEntries = urls.map(({ url, lastmod, changefreq, priority }) => {
    const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
    return `  <url>
    <loc>${url}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export const GET: APIRoute = async () => {
  try {
    const urls: Array<{ url: string; lastmod?: string; changefreq: string; priority: string }> = [];

    // Adicionar páginas estáticas
    staticPages.forEach(page => {
      urls.push({
        url: `${SITE_URL}${page.url}`,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    // Buscar posts do blog do Directus
    try {
      const blogPosts = await getBlogPosts();
      blogPosts.forEach(post => {
        const lastmod = post.publishDate
          ? new Date(post.publishDate).toISOString().split('T')[0]
          : undefined;

        urls.push({
          url: `${SITE_URL}/blog/${post.slug}`,
          lastmod,
          changefreq: 'weekly',
          priority: '0.8',
        });
      });
    } catch (error) {
      console.error('Erro ao buscar posts do blog:', error);
    }

    // Buscar serviços do Directus
    try {
      const services = await getAllServices();
      services.forEach(service => {
        urls.push({
          url: `${SITE_URL}/servicos/${service.slug}`,
          changefreq: 'monthly',
          priority: '0.9',
        });
      });
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }

    // Gerar XML do sitemap
    const sitemap = generateSitemapXML(urls);

    // Retornar com o Content-Type correto
    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
      },
    });
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    return new Response('Erro ao gerar sitemap', { status: 500 });
  }
};
