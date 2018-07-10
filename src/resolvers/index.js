const { Query } = require('./Query')
const { Subscription } = require('./Subscription')
const { auth } = require('./Mutation/auth')
const { post } = require('./Mutation/post')
const { offer } = require('./Mutation/offer')
const { AuthPayload } = require('./AuthPayload')
const { zoffer } = require('./Mutation/zoffer')
const { zseller } = require('./Mutation/zseller')
const { user } = require('./Mutation/user')

module.exports = {
  Query,
  Mutation: {
    ...user,
    ...auth,
    ...post,
    ...offer,
    ...zoffer,
    ...zseller,
  },
  Subscription,
  AuthPayload,
}
