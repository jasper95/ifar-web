import { useEffect, useState } from 'react';
import { useManualQuery, generateQueryById } from 'apollo/query';
import { useDispatch } from 'react-redux';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

const query = generateQueryById({
  node: 'token',
  keys: [
    'used',
    'expiry',
    'type',
  ],
});

function getTokenData() {
  const token = new URLSearchParams(window.location.search).get('token');
  let raw = null;
  if (!token) {
    return {
      token,
      raw,
    };
  }
  try {
    raw = jwt.verify(token, process.env.AUTH_SECRET);
  } catch (err) {
    raw = null;
  }
  return {
    token, raw,
  };
}

export default function verifyToken({ name, type, onSuccess = () => {} }) {
  console.log('type: ', type);
  const [, { onQuery }] = useManualQuery(query);
  const dispatch = useDispatch();
  const [tokenState, setTokenState] = useState('pending');
  useEffect(() => {
    if (typeof window === 'object') {
      const tokenData = getTokenData();
      console.log('tokenData: ', tokenData);
      if (!tokenData.raw) {
        setTokenState('invalid');
      } else {
        queryToken(tokenData);
      }
    }
    async function queryToken(tokenData) {
      const { token_by_pk: result } = await onQuery({ variables: { id: tokenData.raw.id } });
      if (!result || result.error || result.type !== type) {
        dispatch({ type: 'ERROR', payload: { message: `Invalid ${name}` } });
        setTokenState('invalid');
      } else if (result.expiry && dayjs(result.expiry).isBefore(dayjs())) {
        dispatch({ type: 'ERROR', payload: { message: `${name} already expired` } });
        setTokenState('invalid');
      } else if (result.used) {
        dispatch({ type: 'ERROR', payload: { message: `${name} already used` } });
        setTokenState('invalid');
      } else {
        setTokenState('valid');
        onSuccess(tokenData.token);
      }
    }
  }, []);
  return [tokenState];
}
