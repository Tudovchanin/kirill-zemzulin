export default defineNuxtPlugin((nuxtApp) => {
  let scrollSmoother:null | ScrollSmoother = null
  // const route = useRoute()
  nuxtApp.hook('app:mounted', () => {
    scrollSmoother = new useScrollSmoother({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
    })
  })

  nuxtApp.hook('page:finish',async () => {
    if (!scrollSmoother) return
   
    await nextTick()
      scrollSmoother.refresh()
      scrollSmoother.scrollTo(0, true)
      // if (route.path === '/contact') {
      //   scrollSmoother.scrollTo(0, true)
      // }

  })
  return {
    provide: {
      scrollSmoother
    }
  }
})
