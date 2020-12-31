
import {getIsomorphicEnhancedResolver} from '@blitzjs/core'
import * as resolverModule from 'app/_resolvers/users/queries/getCurrentUser'
export * from 'app/_resolvers/users/queries/getCurrentUser'
export default getIsomorphicEnhancedResolver(
  resolverModule,
  'app/_resolvers/users/queries/getCurrentUser',
  'getCurrentUser',
  'query',
  undefined,
  {
    warmApiEndpoints: false
  }
)
