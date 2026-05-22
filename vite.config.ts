import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'api-server-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && (req.url === '/sitemap.xml' || req.url.startsWith('/sitemap.xml?'))) {
              const vercelRes = {
                status(code: number) {
                  res.statusCode = code;
                  return this;
                },
                send(data: any) {
                  res.end(data);
                  return this;
                },
                json(data: any) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return this;
                },
                setHeader(name: string, value: string) {
                  res.setHeader(name, value);
                  return this;
                },
                end(data?: any) {
                  res.end(data);
                  return this;
                }
              };

              const vercelReq = {
                method: req.method,
                body: null,
                headers: req.headers
              };

              try {
                const { default: handler } = await import('./api/sitemap.js');
                await handler(vercelReq as any, vercelRes as any);
              } catch (err: any) {
                console.error('Local Development Sitemap Error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Sitemap local development error: ' + err.message);
              }
            } else if (req.url && (req.url === '/api/store' || req.url.startsWith('/api/store?'))) {
              // Parse POST body if present
              let body = '';
              if (req.method === 'POST') {
                await new Promise<void>((resolve) => {
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', () => resolve());
                });
              }

              // Create Vercel compatible req/res wrappers
              const vercelRes = {
                status(code: number) {
                  res.statusCode = code;
                  return this;
                },
                json(data: any) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return this;
                },
                setHeader(name: string, value: string) {
                  res.setHeader(name, value);
                  return this;
                },
                end(data?: any) {
                  res.end(data);
                  return this;
                }
              };

              const vercelReq = {
                method: req.method,
                body: body ? JSON.parse(body) : null,
                headers: req.headers
              };

              try {
                // Dynamically import the handler to connect to MongoDB
                const { default: handler } = await import('./api/store.js');
                await handler(vercelReq as any, vercelRes as any);
              } catch (err: any) {
                console.error('Local Development API Error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Local API server encountered error', details: err.message }));
              }
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
