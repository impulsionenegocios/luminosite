import { getCachedData } from '../../lib/cache';
import { getHeroData } from './hero_section';
import { getAboutUsData } from './about_us_section';
import { getCounterItems } from './counter_section';
import { getGalleryData } from './gallery_section';
import { getLocalizationData } from './location_section';
import { getTestimonialsData } from './testimonials_section';
import { getContactCTAData } from './cta_section';
import { getBlogPosts } from '../blogData';


export type HomePageData = {
  heroData: any; 
  aboutUsData: any;
  counterSection: any;
  galleryData: any;
  locationData: any;
  testimonialsData: any;
  contactCTAData: any;
  blogPosts: any;
}

export async function getHomePageData(): Promise<HomePageData> {
  return await getCachedData('home_page_data', async () => {
    const [
      heroData,
      aboutUsData,
      counterSection,
      galleryData,
      locationData,
      testimonialsData,
      contactCTAData,
      blogPosts,
    ] = await Promise.all([
      getHeroData(),
      getAboutUsData(),
      getCounterItems(),
      getGalleryData(),
      getLocalizationData(),
      getTestimonialsData(),
      getContactCTAData(),
      getBlogPosts(),
    ]);

    return {
      heroData,
      aboutUsData,
      counterSection,
      galleryData,
      locationData,
      testimonialsData,
      contactCTAData,
      blogPosts,
    };
  });
}