const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId, clearLog } = require('../../utils')

function createToken(userId) {
  //console.log('Create token userId =  ', userId)
  return jwt.sign({ userId, expiresIn: "7d" }, process.env.APP_SECRET)
}



const auth = {
  async refreshToken(parent, args, ctx, info) {

    const userId = getUserId(ctx)
    //console.log('Mutation/auth.js, userId = ', userId)
    //if no errors, we can sign our token
    return {
      token: createToken(userId),
      userId,
    }
  },
  async signup(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: { ...args, password },
    })

    return {
      token: createToken(user.id),
      user,
    }
  },
  async login(parent, { email, password }, ctx, info) {
    
    const user = await ctx.db.query.user({ where: { email } })
    clearLog('hello from LOGIN', user)
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
    clearLog('VALID ', valid)

    if (!valid) {
      clearLog('BALLS ', 'balls')
      // returning error object replaces throw new Error('..')
      //throw new Error('Invalid password')
      return {
        error: {
          field: 'email',
          msg: 'Invalid Password'
        }
      }
    }

    
    // console.log("line 67, user.id = ", user.id);
    // console.log("line 68, userId = ", userId);
    const letSee = createToken(user.id)
    console.log("letSee: ", letSee)
    return {
      //Can't just return token and user, need to wrap in payload
      //for error message display on client.
      payload: {
        token: createToken(user.id),
        user,
      }
    }
  },
}

module.exports = { auth }
