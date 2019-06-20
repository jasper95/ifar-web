import gql from 'graphql-tag';
import initialState from './initialState';

const QUERY = Object.keys(initialState)
  .reduce((acc, el) => {
    acc[`GET_${el.toUpperCase()}`] = gql`
      query {
        ${el} @client
      }
    `;
    return acc;
  }, {});

export default QUERY;
