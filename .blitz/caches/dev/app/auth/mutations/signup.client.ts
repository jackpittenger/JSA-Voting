
import {getIsomorphicEnhancedResolver} from '@blitzjs/core'
export * from 'app/_resolvers/auth/mutations/signup'
export default getIsomorphicEnhancedResolver(
  undefined,
  'app/_resolvers/auth/mutations/signup',
  'signup',
  'mutation',
  undefined,
  {
    warmApiEndpoints: false
  }
)
