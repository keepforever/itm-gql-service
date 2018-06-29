const { getUserId } = require('../../utils')

const offer = {
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

  async deleteOffer(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const offerExists = await ctx.db.exists.Offer({
      id,
      author: { id: userId },
    })
    if (!offerExists) {
      throw new Error(`Offer not found or you're not the author`)
    }

    return ctx.db.mutation.deleteOffer({ where: { id } })
  },
}

module.exports = { offer }
