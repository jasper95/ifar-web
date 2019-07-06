import gql from 'graphql-tag';
import useMutation from 'lib/hooks/useMutation';
import { useAppData, setData } from 'apollo/appData';
import capitalize from 'lodash/capitalize';

export { setData };

export function useCreateNode(metadata = {}, options) {
  const {
    node,
    message = `${capitalize(node)} successfully created`,
  } = metadata;
  return useNodeMutation({
    ...metadata,
    message,
    method: 'POST',
  }, options);
}

export function useUpdateNode(metadata = {}, options) {
  const {
    node,
    message = `${capitalize(node)} successfully updated`,
  } = metadata;
  return useNodeMutation({
    ...metadata,
    message,
    method: 'PUT',
  }, options);
}

export function useDeleteNode(metadata = {}, options) {
  const {
    node,
    message = `${capitalize(node)} successfully deleted`,
  } = metadata;
  return useNodeMutation({
    ...metadata,
    message,
    method: 'DELETE',
  }, options);
}

export function useNodeMutation(metadata = {}, options) {
  const {
    node,
    message,
    callback = () => {},
    method,
  } = metadata;
  const mutationGenerator = method === 'DELETE' ? deleteMutation : generateMutation;
  const query = mutationGenerator({ url: `/${node}`, method });
  const [, setAppData] = useAppData();
  const defaultOptions = {
    update: () => {
      setAppData({
        dialog: null,
        toast: message,
        dialogProcessing: false,
      });
      callback();
    },
  };
  const [mutation, state] = useMutation(query, { ...defaultOptions, ...options });
  return [mutation, state];
}

export function deleteMutation({ keys = ['NoResponse'], url }) {
  return gql`
    mutation DeleteMutation($id: String) {
      deleteNode(id: $id) 
        @rest(type: "any" path: "${url}/{args.id}" method: "DELETE") {
          ${keys.join(', ')}
        }
    }
  `;
}

export function generateMutation({ keys = ['NoResponse'], method = 'POST', url }) {
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
  return (cache, result) => Promise.mapSeries(fns, fn => fn(cache, result));
}
