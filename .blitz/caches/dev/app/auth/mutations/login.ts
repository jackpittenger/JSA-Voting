
import {getIsomorphicEnhancedResolver} from '@blitzjs/core'
import * as resolverModule from 'app/_resolvers/auth/mutations/login'
export * from 'app/_resolvers/auth/mutations/login'
export default getIsomorphicEnhancedResolver(
  resolverModule,
  'app/_resolvers/auth/mutations/login',
  'login',
  'mutation',
  undefined,
  {
    warmApiEndpoints: false
  }
)
