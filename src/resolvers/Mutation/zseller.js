const { getUserId } = require('../../utils')
const { forwardTo } = require('prisma-binding')

const zseller = {
  deleteZseller: forwardTo("db"),
  createZseller: (parent, args, ctx, info) => {
    //getUserId makes sure sender of requset has a valid token
    //in the HTTP Headers thereby protecting the route
    getUserId(ctx)
    return forwardTo("db")(parent, args, ctx, info);
  },

}

module.exports = { zseller }
