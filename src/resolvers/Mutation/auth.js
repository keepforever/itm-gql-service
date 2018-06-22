const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const auth = {
  async signup(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: { ...args, password },
    })

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },

  async login(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      // return error replaces throw new Error(..)
      //throw new Error(`No such user found for email: ${email}`)
      return {
        error: {
          field: 'email',
          msg: 'No user found'
        }
      }
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      // returning error object replaces throw new Error('..')
      //throw new Error('Invalid password')
      return {
        error: {
          field: 'email',
          msg: 'Invalid Password'
        }
      }
    }

    return {
      //Can't just return token and user, need to wrap in payload
      //for error message display on client.
      payload: {
        token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
        user,
      }
    }
  },
}

module.exports = { auth }
