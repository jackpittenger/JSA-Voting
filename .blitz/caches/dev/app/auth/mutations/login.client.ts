
import {getIsomorphicEnhancedResolver} from '@blitzjs/core'
export * from 'app/_resolvers/auth/mutations/login'
export default getIsomorphicEnhancedResolver(
  undefined,
  'app/_resolvers/auth/mutations/login',
  'login',
  'mutation',
  undefined,
  {
    warmApiEndpoints: false
  }
)
