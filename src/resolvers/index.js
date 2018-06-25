const { Query } = require('./Query')
const { Subscription } = require('./Subscription')
const { auth } = require('./Mutation/auth')
const { post } = require('./Mutation/post')
const { offer } = require('./Mutation/offer')
const { AuthPayload } = require('./AuthPayload')

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...offer,
  },
  Subscription,
  AuthPayload,
}
