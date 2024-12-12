/* 生成一些常用的模板组件 */
const fs = require('fs')
const { getAbsoutePath } = require('../utils/index')
const {MultiSelect} = require('enquirer')
const chalk = require("chalk");
const generateTemp = () => {
  //遍历 template下满 comsponents文件夹下的文件
  let temps = []
  fs.readdirSync(getAbsoutePath(__dirname,'../template/common-temp')).forEach((item) => {
    console.log(item);
    temps.push(item)
  })
  new MultiSelect({
    name: 'tempName',
    message: '请选择模板组件',
    choices: temps,
  }).run().then((answers) => {
    answers.forEach((item) => {
      if(fs.existsSync(`./${item}`)){
        console.log(chalk.red(`当前文件夹下已存在 ${item} 文件,已跳过`))
      }else {
        fs.copyFileSync(getAbsoutePath(__dirname,`../template/common-temp/${item}`), `./${item}`)
        console.log(chalk.green(`${item} 文件生成成功`))
      }
    })
  }).catch(err =>{console.log(err)})
}
exports.generateTemp = generateTemp
