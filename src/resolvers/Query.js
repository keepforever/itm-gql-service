const { forwardTo } = require('prisma-binding')
const { getUserId } = require('../utils')

const Query = {
  offers: forwardTo("db"),

  feed(parent, args, ctx, info) {
    console.log("feed query called")
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
