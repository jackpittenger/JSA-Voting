
import {getIsomorphicEnhancedResolver} from '@blitzjs/core'
export * from 'app/_resolvers/auth/mutations/logout'
export default getIsomorphicEnhancedResolver(
  undefined,
  'app/_resolvers/auth/mutations/logout',
  'logout',
  'mutation',
  undefined,
  {
    warmApiEndpoints: false
  }
)
