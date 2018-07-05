const { getUserId } = require('../../utils')
const { forwardTo } = require('prisma-binding')

const offer = {
  deleteOffer: forwardTo("db"),
  async updateOffer(parent, {title, text, id}, ctx, info ) {
    //console.log("Id from offer.js, ", id)
    const userId = getUserId(ctx)
    const offer = await ctx.db.query.offer(
      { where: { id }}, '{ __typename id text title author { name id } }'
    )
    //console.log('offer.author from offer.js', offer.author.id)
    if (userId !== offer.author.id) {
      throw new Error ("Error: you are not the author of this offer")
    }
    return ctx.db.mutation.updateOffer(
      {
        data: {
          title,
          text,
        },
        where: {
          id
        }
      },
      info
    )
  },

  async createOffer(parent, { title, text }, ctx, info) {
    const userId = getUserId(ctx)
    console.log('offer.js, userId: ', userId)
    return ctx.db.mutation.createOffer(
      {
        data: {
          title,
          text,
          author: {
            connect: { id: userId },
          },
        },
      },
      info
    )
  },


}

module.exports = { offer }

// deleteOffer(id: ID!): Offer!
// async deleteOffer(parent, { id }, ctx, info) {
//   const userId = getUserId(ctx)
//   const offerExists = await ctx.db.exists.Offer({
//     id,
//     author: { id: userId },
//   })
//   if (!offerExists) {
//     throw new Error(`Offer not found or you're not the author`)
//   }
//
//   return ctx.db.mutation.deleteOffer({ where: { id } })
// },
