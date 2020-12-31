
import {getIsomorphicEnhancedResolver} from '@blitzjs/core'
export * from 'app/_resolvers/users/queries/getCurrentUser'
export default getIsomorphicEnhancedResolver(
  undefined,
  'app/_resolvers/users/queries/getCurrentUser',
  'getCurrentUser',
  'query',
  undefined,
  {
    warmApiEndpoints: false
  }
)
