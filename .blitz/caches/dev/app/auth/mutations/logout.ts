
import {getIsomorphicEnhancedResolver} from '@blitzjs/core'
import * as resolverModule from 'app/_resolvers/auth/mutations/logout'
export * from 'app/_resolvers/auth/mutations/logout'
export default getIsomorphicEnhancedResolver(
  resolverModule,
  'app/_resolvers/auth/mutations/logout',
  'logout',
  'mutation',
  undefined,
  {
    warmApiEndpoints: false
  }
)
