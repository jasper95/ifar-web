import { useEffect, useState } from 'react';
import { useManualQuery } from 'apollo/query';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import dayjs from 'dayjs';
import cookie from 'js-cookie';

const query = gql`
  query {
    token {
      used
      expiry
      type
    }
  }
`;

export default function verifyToken({ name, type, onSuccess = () => {} }) {
  const [, onQuery] = useManualQuery(query, { });
  const dispatch = useDispatch();
  const [tokenState, setTokenState] = useState('pending');
  useEffect(() => {
    let tempToken;
    if (typeof window === 'object') {
      tempToken = cookie.get('token');
      const token = new URLSearchParams(window.location.search).get('token');
      cookie.set('token', token);
      queryToken(token);
    }
    async function queryToken(token) {
      const { token: result } = await onQuery({});
      if (!result || result.error || !Array.isArray(result)
        || !result.length || result[0].type !== type) {
        dispatch({ type: 'ERROR', payload: { message: `Invalid ${name}` } });
        setTokenState('invalid');
      } else if (result[0].expiry && dayjs(result[0].expiry).isBefore(dayjs())) {
        dispatch({ type: 'ERROR', payload: { message: `${name} already expired` } });
        setTokenState('invalid');
      } else if (result[0].used) {
        dispatch({ type: 'ERROR', payload: { message: `${name} already used` } });
        setTokenState('invalid');
      } else {
        setTokenState('valid');
        onSuccess(token);
      }
      cookie.remove('token');
      if (tempToken) {
        cookie.set('token', tempToken);
      }
    }
  }, []);
  return [tokenState];
}
