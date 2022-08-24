import esbuild,{Plugin,} from 'esbuild';
// https://github.com/evanw/esbuild/issues/20#issuecomment-802269745
export function style():Plugin{
    return {
        name:'style',
        setup({onResolve,onLoad}){
            //解决回调
            // onResolveAPI 旨在在setup函数内调用，并注册一个回调以在某些情况下触发。
            //用来处理路径相关的问题,此处拦截名为“style”的导入路径，不会被esbuild执行，
            //filter 表示路径的过滤条件
            //每个回调都必须提供一个过滤器，它是一个正则表达式。当路径与此过滤器不匹配时将跳过注册的回调
            //onResolve 还有一个使用的用法，是在 return 的时候指定 namespace，默认的namespace 一般是 file。你可以通过指定 namespace 把文件归类，这样在 onLoad 中可以针对这些文件做特殊处理。
            //许多回调可能同时运行
            // 回调仅在提供的命名空间中的模块内的路径上运行。

            onResolve({
                filter:/\.css$/,namespace:'file'},(args)=>{
                    return {path:args.path,namespace:"style-stub"};
            });
            // 将它们映射到文件系统位置。用“style-stub” 
            //使用命名空间标记它们，为这个插件保留它们。
            onResolve({
                filter:/\.css$/,namespace:"style-stub"},(args)=>{
                    return {path:args.path,namespace:"style-content"}
                }
            );
            onResolve({
                filter:/^__style_helper__$/,namespace:"style-stub"},
                (args)=>({
                    path:args.path,
                    namespace:"style-helper",
                    sideEffects:false //将此属性设置为 false 会告诉 esbuild，如果导入的名称未使用，则可以删除此模块的导入
                }),
            );
            //加载回调
            //用来处理加载数据。
            // 加载带有“style-helper”命名空间标签的路径
            // 它们指向一个包含环境变量的 JSON 文件。
            //onLoad将为每个未标记为外部的唯一路径/命名空间对运行添加的回调。它的工作是返回模块的内容并告诉 esbuild 如何解释它。
            onLoad({
                filter:/.*/,namespace:"style-helper"},async ()=>({
                    // 将此设置为字符串以指定模块的内容。如果设置了此项，则不会针对此已解析路径运行更多加载回调。
                    // 如果未设置，esbuild 将继续运行在当前回调之后注册的加载回调，
                    // 然后如果内容仍未设置，如果解析的路径在file命名空间中，esbuild 将默认从文件系统加载内容。
                    contents:`
                    export function injectStyle(text) {
                        if (typeof document !== 'undefined') {
                          var style = document.createElement('style')
                          var node = document.createTextNode(text)
                          style.appendChild(node)
                          document.head.appendChild(style)
                        }
                      }

                    `,
                })
            );
            onLoad({filter:/.*/,namespace:"style-stub"},async (args)=>({
                contents:`
                import { injectStyle } from "__style_helper__"
              import css from ${JSON.stringify(args.path)}
              injectStyle(css)
                `
            }));
            onLoad({
                filter:/.*/,
                namespace:"style-content",
            },
            async (args)=>{
                //构建 API--esbuild.build 调用对文件系统中的一个或多个文件进行操作。这允许文件相互引用并捆绑在一起
                // 错误？：消息[]；
                // 警告？：消息[]；

                const {errors,warnings,outputFiles}=await esbuild.build({

                    
                    //这是一个文件数组，每个文件都用作捆绑算法的输入。它们被称为“入口点”，
                    //简单的应用程序只需要一个入口点，但如果有多个逻辑独立的代码组（例如主线程和工作线程），或者具有独立相对不相关区域（例如登录页面、编辑器）的应用程序，则额外的入口点可能很有用页面和设置页面。单独的入口点有助于引入关注点分离，并有助于减少浏览器需要下载的不必要代码量。如果适用，启用代码拆分可以在浏览到第二个页面时进一步减少下载大小，该页面的入口点与已经访问过的第一个页面共享一些已下载的代码。
                    //指定入口点的简单方法是只传递一个文件路径数组：
                    entryPoints:[args.path],
//                     日志级别
                    // 支持：变换| 建造

                    // 可以更改日志级别以防止 esbuild 将警告和/或错误消息打印到终端。六个日志级别是：

                    // silent
                    // 不显示任何日志输出。transform这是使用 JS API时的默认日志级别。

                    // error
                    // 只显示错误。

                    // warning
                    // 只显示警告和错误。build这是使用 JS API时的默认日志级别。

                    // info
                    // 显示警告、错误和输出文件摘要。这是使用 CLI 时的默认日志级别。

                    // debug
                    // 记录来自的所有内容info以及一些可以帮助您调试损坏的捆绑包的附加消息。此日志级别会影响性能，并且某些消息可能是误报，因此默认情况下不会显示此信息。

                    // verbose
                    // 这会生成大量日志消息，并被添加到文件系统驱动程序的调试问题中。它不适用于一般用途。

                    logLevel:"silent",
                   // 是否捆绑
                   //捆绑文件意味着将任何导入的依赖项内联到文件本身中。这个过程是递归的，因此依赖关系（等等）的依赖关系也将被内联。默认情况下，esbuild不会捆绑输入文件。捆绑必须像这样显式启用：
                    bundle:true,
                    //构建 API 调用既可以直接写入文件系统，也可以返回本来作为内存缓冲区写入的文件。默认情况下，CLI 和 JavaScript API 会写入文件系统，而 Go API 不会
                    write:false,
                    charset:"utf8",
                    minify:true,
                    //此选项更改给定输入文件的解释方式。例如，js加载器将文件解释为 JavaScript，css加载器将文件解释为 CSS。有关所有内置加载程序的完整列表，请参阅内容类型页面。
                   // 为给定的文件类型配置加载器可以让您通过import语句或require调用加载该文件类型。例如，将.png文件扩展名配置为使用数据 URL加载器意味着导入.png文件会为您提供包含该图像内容的数据 URL：
                    loader:{
                        '.svg':'dataurl',
                        '.ttf':'dataurl'
                    },
                });
                return {
                    errors,
                    warnings,
                    contents:outputFiles![0].text,
                    loader:'text',
                }
            })
        }

    }
}