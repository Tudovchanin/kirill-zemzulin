import { useCompression } from 'h3-compression'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:response', async (response, { event }) => {
    // Skip internal nuxt routes (e.g. error page)
    if (getRequestURL(event).pathname.startsWith('/__nuxt'))
      return

    if (!response.headers?.['content-type']?.startsWith('text/html'))
      return

    await useCompression(event, response)
  })
})