import express from 'express';
import portfinder from 'portfinder';
import { createServer } from 'http';
import { build } from 'esbuild';
import path from "path";
import { createWebSocketServer } from './server';
import { style } from './styles';
import { DEFAULT_ENTRY_POINT, DEFAULT_OUTDIR, DEFAULT_PLATFORM, DEFAULT_PORT, DEFAULT_HOST, DEFAULT_BUILD_PORT } from './constants';

export const dev = async () => {
    const cwd = process.cwd();
    const app = express();
    const port = await portfinder.getPortPromise({
        port: DEFAULT_PORT,
    });

    const esbuildOutput = path.resolve(cwd, DEFAULT_OUTDIR);
    app.get('/', (_req, res) => {
        res.set('Content-Type', 'text/html');
        res.send(`<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>MyFrontFrame</title>
        </head>
        
        <body>
            <div id="myfrontframe">
                <span>loading...</span>
            </div>
            <script src="/${DEFAULT_OUTDIR}/index.js"></script>
            <script src="/myfrontframe/client.js"></script>
        </body>
        </html>`);
    });
    app.use(`/${DEFAULT_OUTDIR}`, express.static(esbuildOutput));
    app.use(`/myfrontframe`, express.static(path.resolve(__dirname, 'client')));
    console.log("__dirname",__dirname)

    const myfrontframeServe = createServer(app);
    const ws = createWebSocketServer(myfrontframeServe);

    function sendMessage(type: string, data?: any) {
        ws.send(JSON.stringify({ type, data }));
    }
    myfrontframeServe.listen(port, async () => {
        console.log(`App listening at http://${DEFAULT_HOST}:${port}`);
        try {
            await build({
                format: 'iife',
                logLevel: 'error',
                outdir: esbuildOutput,
                platform: DEFAULT_PLATFORM,
                bundle: true,
                watch: {
                    onRebuild: (err, res) => {
                        if (err) {
                            console.error(JSON.stringify(err));
                            return;
                        }
                        sendMessage('reload')
                    }
                },
                define: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
                external: ['esbuild'],
                plugins: [style()],
                entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)],
            });
            // [Issues](https://github.com/evanw/esbuild/issues/805)
            // 查了很多资料，esbuild serve 不能响应 onRebuild， esbuild build 和 express 组合不能不写入文件
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    });

}