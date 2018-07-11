const { auth } = require('./Mutation/auth')
const { friendship } = require('./Mutation/friendship')
const { offer } = require('./Mutation/offer')
const { request } = require('./Mutation/request')
const { seller } = require('./Mutation/seller')
const { user } = require('./Mutation/user')

const { AuthPayload } = require('./AuthPayload')
const { Query } = require('./Query')

module.exports = {
  Query,
  Mutation: {
    ...user,
    ...auth,
    ...friendship,
    ...offer,
    ...request,
    ...seller,
  },
  AuthPayload,
}
