
// This imports the output of getIsomorphicEnhancedResolver()
import enhancedResolver from 'app/auth/mutations/logout'
import {getAllMiddlewareForModule} from '@blitzjs/core'
import {rpcApiHandler} from '@blitzjs/server'
import path from 'path'

// Ensure these files are not eliminated by trace-based tree-shaking (like Vercel)
path.resolve("next.config.js")
path.resolve("blitz.config.js")
path.resolve(".next/__db.js")
// End anti-tree-shaking

let db: any
let connect: any
try {
  db = require('db').default
  if (require('db').connect) {
    connect = require('db').connect
  } else if (db?.$connect || db?.connect) {
    connect = () => db.$connect ? db.$connect() : db.connect()
  } else {
    connect = () => {}
  }
} catch(_) {}

export default rpcApiHandler(
  enhancedResolver,
  getAllMiddlewareForModule(enhancedResolver),
  () => db && connect?.(),
)

export const config = {
  api: {
    externalResolver: true,
  },
}
