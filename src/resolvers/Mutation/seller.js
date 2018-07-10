const { getUserId } = require('../../utils')
const { forwardTo } = require('prisma-binding')

const seller = {
  deleteZseller: forwardTo("db"),
  createZseller: (parent, args, ctx, info) => {
    //getUserId makes sure sender of requset has a valid token
    //in the HTTP Headers thereby protecting the route
    getUserId(ctx)
    return forwardTo("db")(parent, args, ctx, info);
  },

}

module.exports = { seller }
