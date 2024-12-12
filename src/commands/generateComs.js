/*
生成Vue SFC
*/
const fs = require('fs')
const chalk = require('chalk')
const { Confirm, Input, Select } = require('enquirer')
const { getAbsoutePath } = require('../utils/index')
const path = require('path')
const { log } = require('console')

const generateComs = () => {
  // 生成在 components 文件夹下 还是当前目录下
  new Select({
    name: 'needUnderComs',
    message: '请选择生成位置([./components文件夹下] or [当前文件夹下])',
    choices: ['./components', './']
  })
    .run()
    .then((needUnderComs) => {
      needUnderComs = needUnderComs === './components'
      // 要生成在components 文件夹下
      if (needUnderComs) {
        // 没有 components 文件夹 先创建components文件夹
        if (!fs.existsSync(path.resolve('./components'))) {
          new Confirm({
            name: 'createComsFolder',
            message: '当前目录下不存在components文件夹，是否自动创建？'
          })
            .run()
            .then((createComsFolder) => {
              if (createComsFolder) {
                fs.mkdirSync(path.resolve('./components'))
                _createComs(true)
              } else {
                console.log(chalk.red('请手动创建components文件夹'))
              }
            }).catch((err) => {})
        } else {
          // 有 components 文件夹 直接创建
          _createComs(true)
        }
      } else {
        // 生成在当前目录下
        _createComs(false)
      }
    })
    .catch((err) => {})
}
/*
 @params{needUnderComs} Boolean   是否需要生成在 components 文件夹下
*/
function _createComs(needUnderComs = true) {
  new Input({
    name: 'SFCName',
    message: '请输入组件名字(请不要带文件后缀)',
    validate: (value) => {  // 校验
      if (!value) {
        return '请输入组件名字'
      }
      if (fs.existsSync(`${needUnderComs ? './components' : './'}/${value}.vue`)) {
        return '组件已经存在,请更换组件名字'
      }
      return true
    }
  })
    .run()
    .then((SFCName) => {
      if (!SFCName) return console.log(chalk.red('请输入组件名字'))
      new Select({
        name: 'SFCType',
        message: '请选择组件风格',
        choices: ['compostion-api', 'options-api']
      })
        .run()
        .then((SFCType) => {
          const type = SFCType === 'compostion-api' ? 'compostion' : 'options'
          try {
            fs.copyFileSync(
              getAbsoutePath(__dirname,`../template/components/vue-${type}.vue`),
              // `./src/template/vue-${type}.vue`,
              `${needUnderComs ? './components/' : './'}${SFCName}.vue`
            )
            console.log(chalk.green('组件生成成功'))
          } catch (error) {
            console.log(error);
            console.log(chalk.red('组件生成失败'));
          }

        }).catch((err) => {})
    }).catch((err) => {})
}
exports.generateComs = generateComs
