import 'nuxt/schema'

declare module 'nuxt/schema' {
  interface NuxtConfig {
    gsap?: {
      extraPlugins?: Record<string, boolean>
      clubPlugins?: Record<string, boolean>
      provide?: boolean
      composables?: boolean
    }
    image?: {
      sanity?: {
        projectId:string,
        dataset:string
      }
      provider?: string, 
      domains?: string[]
      quality?: number
      format?: string[]
      screens?: Record<string, number>
    }
    stylelint?: {
      fix: boolean, 
      files: string[]
    }
  }
}
