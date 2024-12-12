const { Command } = require('commander');
const { version, name: packageName } = require('../package.json');

const { generateComs } = require('./commands/generateComs');
const { generateConfig } = require('./commands/generateConfig');
const { generateTemp } = require('./commands/generateTemp');

// 控制输出样式
const chalk = require('chalk');
// 字体颜色渐变
const gradient = require('gradient-string');

const program = new Command();
program
  .description('An application for one plugin')
  .option('-V, --version', '查看版本')
  .helpOption('-h, --help', '查看使用帮助');

program
  .command('gen')
  .description('生成组件/配置文件')
  .option('-com, --component ', '生成SFC')
  .option('-con, --config', '生成配置文件')
  .option('-temp, --template', '生成某些常用的模板组件')
  .addHelpCommand()
  .action((options, command) => {
    // generateComs
    // console.log(command)
    if (options.component) {
      generateComs();
    } else if (options.config) {
      generateConfig();
    } else if (options.template) {
      generateTemp();
    } else {
      // 提示用户输入参数
      let output = '';
      command.options.forEach((item) => {
        output = output + `gen ${item.short} ${item.description} \n`;
      });
      console.log(chalk.red(output));
    }
  });

// 这一句要放在命令的最后
program.parse();

let opts = program.opts();

if (opts.version) {
  console.log(chalk.bold(gradient.morning(`${packageName} ${version}`)));
}
