import type { CategoryName, Slug } from '~/types'


export const CATEGORY_SLUG_MAP : Record<CategoryName, Slug> = {
  'Портреты': 'portraits',
  'Свадебные': 'weddings',
  'Пейзажи': 'landscapes',
}

export const SLUG_CATEGORY_MAP: Record<Slug, CategoryName> = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_MAP).map(([key, value]) => [value, key])
) as Record<Slug, CategoryName>
