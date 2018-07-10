const { auth } = require('./Mutation/auth')
const { friendship } = require('./Mutation/friendship')
const { offer } = require('./Mutation/offer')
const { request } = require('./Mutation/request')
const { seller } = require('./Mutation/seller')

const { AuthPayload } = require('./AuthPayload')
const { Query } = require('./Query')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...friendship,
    ...offer,
    ...request,
    ...seller,
  },
  AuthPayload,
}
