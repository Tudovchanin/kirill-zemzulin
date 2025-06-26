import compression from 'compression'

export default defineEventHandler((event) => {
  const req = event.node.req; // IncomingMessage
  const res = event.node.res; // ServerResponse
  compression()(req, res, () => {});
});
