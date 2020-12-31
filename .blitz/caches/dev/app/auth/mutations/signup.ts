
import {getIsomorphicEnhancedResolver} from '@blitzjs/core'
import * as resolverModule from 'app/_resolvers/auth/mutations/signup'
export * from 'app/_resolvers/auth/mutations/signup'
export default getIsomorphicEnhancedResolver(
  resolverModule,
  'app/_resolvers/auth/mutations/signup',
  'signup',
  'mutation',
  undefined,
  {
    warmApiEndpoints: false
  }
)
