/*
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-08-24 16:46:29
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-08-24 16:48:23
 * @FilePath: /myFrontFrame/packages/myfrontframe/src/appData.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import path from 'path';
import { DEFAULT_ENTRY_POINT, DEFAULT_OUTDIR, DEFAULT_TEMPLATE, } from './constants';

interface Options {
    cwd: string;
    port: number;
}
export interface AppData {
    paths: {
        cwd: string;
        port: number;
        absSrcPath: string;
        absPagesPath: string;
        absTmpPath: string;
        absOutputPath: string;
        absEntryPath: string;
        absNodeModulesPath: string;
    },
    pkg: any,
}
export const getAppData = ({
    cwd,port
}: Options) => {
    return new Promise((resolve: (value: AppData) => void, rejects) => {
        // cwd，当前路径
        // absSrcPath，src 目录绝对路径
        // absPagesPath，pages 目录绝对路径
        // absTmpPath，临时目录绝对路径
        // absOutputPath，输出目录绝对路径
        // absEntryPath，主入口文件的绝对路径
        // absNodeModulesPath，node_modules 目录绝对路径
        const absSrcPath = path.resolve(cwd, 'src');
        const absPagesPath = path.resolve(absSrcPath, 'pages');
        const absNodeModulesPath = path.resolve(cwd, 'node_modules');
        const absTmpPath = path.resolve(absNodeModulesPath, DEFAULT_TEMPLATE);
        const absEntryPath = path.resolve(absTmpPath, DEFAULT_ENTRY_POINT);
        const absOutputPath = path.resolve(cwd, DEFAULT_OUTDIR);

        const paths = {
            cwd,
            port,
            absSrcPath,
            absPagesPath,
            absTmpPath,
            absOutputPath,
            absEntryPath,
            absNodeModulesPath
        }
        // 当前项目的 package.json，格式为 Object。
        const pkg = require(path.resolve(cwd, 'package.json'));
        resolve({ paths, pkg })
    });
}