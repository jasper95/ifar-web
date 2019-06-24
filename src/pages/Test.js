import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

const EDUCATION_QUERY = gql`
  query {
    education {
      id,
      school
      job_category {
        id
        name
      }
      start_date
      end_date
      qualification
    }
  }
`;

export default function Test() {
  const [state] = useState(1);
  const result = useQuery(EDUCATION_QUERY);
  console.log('result: ', result);
  return (
    <div>
      Test
    </div>
  );
}
