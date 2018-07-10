//const { getUserId } = require('../../utils')
const { forwardTo } = require('prisma-binding')

const user = {
  updateUser: forwardTo("db"),

}

module.exports = { user }
