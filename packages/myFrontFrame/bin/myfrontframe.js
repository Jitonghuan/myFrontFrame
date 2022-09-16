#!/usr/bin/env node

//注意开头要添加脚本的解释程序，比如我们这里使用的是 node
//这里我们使用一个 完成的 node 命令行解决方案 commander.js
const {
    Command
} = require('commander');

const program = new Command();

program
    .version(require('../package.json').version, '-v, -V', '输出当前框架的版本')
    .description('这是挑战手写前端框架的产物框架')
    .usage('<command> [options]');

program.command('help')
    .alias('-h')
    .description('帮助命令')
    .action(function(name, other) {
        console.log(`
这是挑战手写前端框架的产物框架 myFrontFrame

支持的命令:
  version, -v,-V 输出当前框架的版本
  help,-h 输出帮助程序

Example call:
    $ myfrontframe <command> --help`)
    });

program.command('dev').description('框架开发命令').action(function() {
    const {
        dev
    } = require('../lib/dev');
    dev();//在这里执行dev文件里的信息
});

program.parse(process.argv);