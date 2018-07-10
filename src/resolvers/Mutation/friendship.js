const { getUserId } = require('../../utils')
const { forwardTo } = require('prisma-binding')

const friendship = {
  deleteFriendship: forwardTo("db"),
  updateFriendship: forwardTo("db"),
  createFriendship: (parent, args, ctx, info) => {
    //getUserId makes sure sender of requset has a valid token
    //in the HTTP Headers thereby protecting the route
    getUserId(ctx)
    return forwardTo("db")(parent, args, ctx, info);
  },
}

module.exports = { friendship }
