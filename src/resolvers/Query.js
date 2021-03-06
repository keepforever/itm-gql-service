const { forwardTo } = require('prisma-binding')
const { getUserId } = require('../utils')

const Query = {
  zsellers: (parent, args, ctx, info) => {
    //getUserId makes sure sender of requset has a valid token
    //in the HTTP Headers thereby protecting the route
    getUserId(ctx)
    return forwardTo("db")(parent, args, ctx, info);
  },
  zoffers: (parent, args, ctx, info) => {
    //getUserId makes sure sender of requset has a valid token
    //in the HTTP Headers thereby protecting the route
    getUserId(ctx)
    return forwardTo("db")(parent, args, ctx, info);
  },
  //offers: forwardTo("db"),
  offers: (parent, args, ctx, info) => {
    getUserId(ctx)
    return forwardTo("db")(parent, args, ctx, info);
  },

  offersConnection: (parent, args, ctx, info) => {
    getUserId(ctx)
    return forwardTo("db")(parent, args, ctx, info);
  },
  
  feed(parent, args, ctx, info) {
    return ctx.db.query.posts({ where: { isPublished: true } }, info)
  },

  drafts(parent, args, ctx, info) {
    const id = getUserId(ctx)

    const where = {
      isPublished: false,
      author: {
        id
      }
    }

    return ctx.db.query.posts({ where }, info)
  },

  post(parent, { id }, ctx, info) {
    return ctx.db.query.post({ where: { id } }, info)
  },

  me(parent, args, ctx, info) {
    const id = getUserId(ctx)
    return ctx.db.query.user({ where: { id } }, info)
  },

  offer(parent, { id }, ctx, info) {
    return ctx.db.query.offer({ where: { id }, info })

  }
}

module.exports = { Query }
