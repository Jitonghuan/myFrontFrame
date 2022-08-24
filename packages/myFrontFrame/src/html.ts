/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-08-24 16:50:20
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-08-24 16:50:20
 * @FilePath: /myFrontFrame/packages/myfrontframe/src/html.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { mkdir, writeFileSync } from 'fs';
import path from 'path';
import type { AppData } from './appData';
import { DEFAULT_FRAMEWORK_NAME, DEFAULT_OUTDIR } from './constants';

export const generateHtml = ({ appData }: { appData: AppData; }) => {
    return new Promise((resolve, rejects) => {
        const content = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>${appData.pkg.name ?? 'Malita'}</title>
        </head>
        
        <body>
            <div id="malita">
                <span>loading...</span>
            </div>
            <script src="/${DEFAULT_OUTDIR}/${DEFAULT_FRAMEWORK_NAME}.js"></script>
            <script src="/malita/client.js"></script>
        </body>
        </html>`;
        try {
            const htmlPath = path.resolve(appData.paths.absOutputPath, 'index.html')
            mkdir(path.dirname(htmlPath), { recursive: true }, (err) => {
                if (err) {
                    rejects(err)
                }
                writeFileSync(htmlPath, content, 'utf-8');
                resolve({})
            });
        } catch (error) {
            rejects({})
        }
    })
}