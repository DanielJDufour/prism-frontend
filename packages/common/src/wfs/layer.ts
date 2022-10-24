import { getFeatures } from './utils';

import { Layer } from '../layer';

export default class FeatureLayer extends Layer {
  async getFeatures(
    {
      count = 10,
      fetch: customFetch,
      method = 'POST',
      wait = 0,
      ...rest
    }: {
      count?: number;
      fetch?: any;
      method?: 'GET' | 'POST';
      wait?: number;
    } = { count: 10, fetch: undefined, method: 'POST', wait: 0 },
  ): Promise<any> {
    // to-do: check if post available
    return getFeatures(await this.capabilities, this.id, {
      count,
      fetch: customFetch || this.fetch,
      method,
      wait,
      ...rest,
    });
  }
}