import type { RouterConfig } from '@nuxt/schema'
import type { RouteLocationNormalized } from 'vue-router'

export default <RouterConfig>{
  scrollBehavior(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    savedPosition: { left: number; top: number } | null
  ) {
    if (savedPosition) {
      // Возвращаем сохранённую позицию при навигации назад/вперёд
      return savedPosition
    }

    if (to.hash) {
      // Если есть хеш в URL, прокручиваем к элементу плавно
      return { selector: to.hash, behavior: 'smooth' }
    }

    // Прокручиваем вверх только при переходе на конкретный путь
    if (to.path === '/contact') {
      console.log('path', to);
      
      // return { left: 0, top: 0 }
    }

    // Для остальных маршрутов не меняем позицию прокрутки
    return null
  }
}
