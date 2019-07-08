import React from 'react';
import { withAuth } from 'apollo/auth';
import Profile from 'components/Profile';
import UserDetails from 'components/Profile/User';
import useQuery from 'apollo/query';
import gql from 'graphql-tag';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import Redirect from 'react-router/Redirect';
import withRouter from 'react-router-dom/withRouter';
import flowRight from 'lodash/flowRight';

const USER_QUERY = gql`
  query GetUser($slug: String) {
    system_user(where: {slug: {_eq: $slug }}) {
        id
        first_name
        last_name
        address_description
        address
        skills {
          id
          name
          level
        }
        experiences {
          id
          position
          start_date
          end_date
        }
        educations {
          id,
          job_category {
            name
          }
          start_date
          end_date
          qualification
          school
        }
      }
    }
`;

function UserProfile(props) {
  const { match = { params: {} } } = props;
  const { slug = '' } = match.params;
  const { data, loading } = useQuery(USER_QUERY, { variables: { slug } });
  if (loading) {
    return (
      <Profile>
        <div>Loading...</div>
      </Profile>
    );
  }
  if (data && data.system_user && data.system_user.length) {
    const [profile] = data.system_user;
    return (
      <Profile>
        <UserDetails
          onDownloadResume={handleDownloadResume}
          profile={omit(profile, 'skills', 'skills', 'educations', 'experiences')}
          {...pick(profile, ['profile', 'skills', 'educations', 'experiences'])}
        />
      </Profile>
    );
  }
  return <Redirect to="/not-found" />;

  function handleDownloadResume() {
    // const { profile } = props;
    // dispatch(Download({
    //   id: profile.id, type: 'resume', node: 'user', attachment: true,
    // }));
  }
}

export default flowRight(
  withAuth({ requireAuth: 'optional' }),
  withRouter,
)(UserProfile);
