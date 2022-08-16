<!--
 * @Author: muxi.jth 2016670689@qq.com
 * @Date: 2022-08-13 21:27:58
 * @LastEditors: muxi.jth 2016670689@qq.com
 * @LastEditTime: 2022-08-13 23:01:27
 * @FilePath: /myFrontFrame/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
1、其实 babel 的实现原理非常简单，就是通过将代码转换成抽象语法书 (AST)，再转换成目标语法1
2、在项目中使用 typescript 可以使用很多联想，还有对于函数调用出入参也有一个明显的提示作用，可以大大加快我们编写框架的速度，也能减少很多翻阅文档的时间。
pnpm i typescript -w -D
3、使用 tsc 初始化项目
npx tsc --init
4、引入 esbuild 编译 ts
pnpm i esbuild -w -D
5、服务端渲染的原理：将项目构建成 html 字符串，然后返回给浏览器。

6、框架构建 pnpm build
   npm 发布 ：npm publish version 0.0.3


