const { getUserId } = require('../../utils')
const { forwardTo } = require('prisma-binding')

const offer = {
  deleteOffer: forwardTo("db"),
  updateOffer: forwardTo("db"),
  createOffer: (parent, args, ctx, info) => {
    //getUserId makes sure sender of requset has a valid token
    //in the HTTP Headers thereby protecting the route
    getUserId(ctx)
    return forwardTo("db")(parent, args, ctx, info);
  },
}

module.exports = { offer }
