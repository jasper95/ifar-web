import gql from 'graphql-tag';
import bluebird from 'bluebird';
import QUERY from 'apollo/query';

export function generateMutation({ keys = ['id'], method = 'POST', url }) {
  return gql`
    mutation NodeMutation(
      $input: any!,
    ) {
      nodeMutation(url: $url, method: $method, input: $input)
        @rest(type: "any", path: "${url}", method: "${method}") {
          ${keys.join(', ')}
        }
    }
  `;
}

export function applyUpdates(...fns) {
  return (cache, result) => bluebird.mapSeries(fns, fn => fn(cache, result));
}

export function setData(key, value) {
  return cache => cache.writeQuery({
    data: {
      [key]: value,
    },
    query: QUERY[`GET_${key.toUpperCase()}`],
  });
}

export function setNotification(message, type = 'success') {
  return cache => setData('notification', {
    notification: message ? {
      message,
      type,
    } : null,
  })(cache);
}
