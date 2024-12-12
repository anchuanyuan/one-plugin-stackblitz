const path = require('path')

const getAbsoutePath = (dirname,pathName) => {
  return path.join(dirname, pathName)
}
exports.getAbsoutePath = getAbsoutePath
