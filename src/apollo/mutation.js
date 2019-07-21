import { useState } from 'react';
import capitalize from 'lodash/capitalize';
import fetch from 'isomorphic-unfetch';
import { useSelector, useDispatch } from 'react-redux';

const simpleFn = () => {};
const basicAuth = Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64');

export default function useMutation(params = {}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(state => state.token);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const state = {
    loading,
    data,
    error,
  };

  return [state, mutate];
  async function mutate(params2 = {}) {
    setLoading(true);
    const allParams = { ...params, ...params2 };
    const {
      data: body = {}, method = 'POST', onSuccess = simpleFn,
    } = allParams;
    let { url } = allParams;
    if (method.toLowerCase() === 'delete' && body.id) {
      url = `${url}/${body.id}`;
    }
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : `Basic ${basicAuth}`,
      },
      body: JSON.stringify(body),
    };
    let response = await fetch(`/api${url}`, options);
    const { status } = response;
    response = await response.json();
    setLoading(false);
    if (status === 200) {
      setData(response);
      onSuccess(response);
      return;
    }
    const err = {
      message: status === 400 ? response.message : 'Something went wrong',
    };
    dispatch({ type: 'ERROR', payload: err });
    setError(err);
  }
}

export function useCreateNode(params) {
  const {
    node,
    message = `${capitalize(node)} successfully created`,
  } = params;
  return useNodeMutation({
    ...params,
    message,
    method: 'POST',
    url: `/${node}`,
  });
}

export function useUpdateNode(params) {
  const {
    node,
    message = `${capitalize(node)} successfully updated`,
  } = params;
  return useNodeMutation({
    ...params,
    message,
    method: 'PUT',
    url: `/${node}`,
  });
}

export function useDeleteNode(params) {
  const {
    node,
    message = `${capitalize(node)} successfully deleted`,
  } = params;
  return useNodeMutation({
    ...params,
    message,
    method: 'DELETE',
    url: `/${node}`,
  });
}

export function useNodeMutation(params) {
  const dispatch = useDispatch();
  const { callback = () => {}, message } = params;
  const onSuccess = () => {
    dispatch({ type: 'SUCCESS', payload: { message } });
    callback();
  };
  return useMutation({ ...params, onSuccess });
}
