/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-08-24 16:50:00
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-08-24 16:50:00
 * @FilePath: /myFrontFrame/packages/myfrontframe/src/entry.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { existsSync, mkdir, writeFileSync } from 'fs';
import path from 'path';
import type { AppData } from './appData';
import type { IRoute } from './routes';
import type { UserConfig } from './config';

let count = 1;
const getRouteStr = (routes: IRoute[]) => {
    let routesStr = '';
    let importStr = '';
    routes.forEach(route => {
        count += 1;
        importStr += `import A${count} from '${route.element}';\n`;
        routesStr += `\n<Route path='${route.path}' element={<A${count} />}>`;
        if (route.routes) {
            const { routesStr: rs, importStr: is } = getRouteStr(route.routes);
            routesStr += rs;
            importStr += is;
        }
        routesStr += '</Route>\n';
    })
    return { routesStr, importStr };
}
const configStringify = (config: (string | RegExp)[]) => {
    return config.map((item) => {
        if (item instanceof RegExp) {
            return item;
        }
        return `'${item}'`;
    });
};

export const generateEntry = ({ appData, routes,userConfig }: { appData: AppData; routes: IRoute[],userConfig: UserConfig }) => {
    return new Promise((resolve, rejects) => {
        count = 0;
        const { routesStr, importStr } = getRouteStr(routes);
        const content = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, } from 'react-router-dom';
import KeepAliveLayout from '@myfrontframe/keepalive';
${importStr}

const App = () => {
    return (
        <KeepAliveLayout keepalive={[${configStringify(
            userConfig?.keepalive ?? [],
        )}]}>
            <HashRouter>
                <Routes>
                    ${routesStr}
                </Routes>
            </HashRouter>
        </KeepAliveLayout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('myfrontframe'));
root.render(React.createElement(App));
    `;
        try {
            mkdir(path.dirname(appData.paths.absEntryPath), { recursive: true }, (err) => {
                if (err) {
                    rejects(err)
                }
                writeFileSync(appData.paths.absEntryPath, content, 'utf-8');
                resolve({})
            });
        } catch (error) {
            rejects({})
        }
    })
}
