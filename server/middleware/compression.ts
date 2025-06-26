import compression from 'compression'

export default defineEventHandler((event) => {
  const req = event.node.req
  const res = event.node.res
  compression()(req, res, () => {})
})

