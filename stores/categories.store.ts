import type { Category, ImagesByCategory, Slug } from '~/types'
import { CATEGORIES_WITH_IMAGES_QUERY } from '~/queries/sanity.queries';
import { CATEGORY_SLUG_MAP } from "~/constants/mappings.constants";


export const useCategoriesStore = defineStore('categories', () => {

  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const sanity = useSanity();

  async function fetchCategories() {
    loading.value = true
    error.value = null

    try {
      categories.value = await sanity.fetch(CATEGORIES_WITH_IMAGES_QUERY)
      console.log('ПОЛУЧЕНЫ КАТЕГОРИИ', categories.value);
      return categories.value; 
    } catch (e: unknown) {

      console.log(e, 'ERROR');
      error.value = e instanceof Error ? e.message : String(e);
      return [];
    } finally {
      loading.value = false
    }
  }

  const imagesByCategory = computed(()=> {
    const data: ImagesByCategory = {};
    if(categories.value.length) {
        categories.value.forEach(category => {
          const slug = CATEGORY_SLUG_MAP[category.title] as Slug
          data[slug] = category.images;
        })
    }
    return data;
  })

  

  return {
    categories, loading, error, fetchCategories, imagesByCategory
  }

})