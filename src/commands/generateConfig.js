/*
生成config文件
*/

const fs = require('fs')
const chalk = require('chalk')
const { MultiSelect } = require('enquirer')
const { getAbsoutePath } = require('../utils/index')

const generateConfig = () => {
  new MultiSelect({
    name: 'configName',
    message: '请选择配置文件(可多选),文件会生成在当前目录下',
    choices: ['.prettierrc.js', 'vite.config.js'],
    validate: (value) =>{
      if(value.length === 0){
        return '至少选择一个(请使用空格键选择或取消)'
      }
      return true
    }
  })
    .run()
    .then((answers) => {
      answers.forEach((item) => {
        if (fs.existsSync(`./${item}`)) {
          console.log(chalk.red(`当前文件夹下已存在 ${item} 文件, 已跳过`))
        } else {
          try {
            fs.copyFileSync(getAbsoutePath(__dirname,`../template/config/${item}`), `./${item}`)
            console.log(chalk.green(`${item} 文件生成成功`))
          } catch (error) {
            console.log(chalk.red(`${item} 文件生成失败`))
            console.error(error.message)
          }
        }
      })
    })
}

exports.generateConfig = generateConfig
