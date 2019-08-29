import React from 'react';
import UserSkeleton from './UserSkeleton';
import BaseSkeleton from './BaseSkeleton';
import range from 'lodash/range';

const MenuItem = () => (
  <BaseSkeleton
    width="108.4"
    height="22.2"
    primaryColor='#676767'
    secondaryColor='#7E7E7E'
  >
    <path d="M100.6,20.1H7.1c-2.8,0-5-2.3-5-5v-8c0-2.8,
    2.2-5,5-5h93.5c2.8,0,5,2.3,5,5v8C105.6,17.9,
    103.4,20.1,100.6,20.1z"/>
  </BaseSkeleton>
)

const Logo = () => (
  <BaseSkeleton
    width="59.8"
    height="59.8"
    primaryColor='#676767'
    secondaryColor='#7E7E7E'
  >
    <path d="M0,0v60h60V0H0z M49.9,14.3c0,1-0.3,1.3-1.3,1.3c-2.8,0.1-5.6,0.2-8.3,0.6c-4.9,0.9-7.8,3.7-8.5,8.6
      c-0.5,3.4-0.7,6.8-0.8,10.3c-0.1,3,0,5.9,0,8.9c0,1.2,0.4,1.5,1.5,1.5c2.5-0.1,5,0,7.4,0c1,0,1.2,0.3,1.2,1.2c-0.1,2,0,4,0,6
      c0,0.8-0.3,1-1.1,1c-8.9,0-17.8,0-26.6,0c-0.8,0-1.1-0.3-1.1-1.1c0-2,0-4.1,0-6.1c0-0.8,0.3-1,1-1c2.4,0,4.8,0,7.2,0
      c0.8,0,1.1-0.2,1.1-1.1c0-9.4,0-18.8,0-28.2c0-0.3-0.1-0.5-0.1-0.9c-0.5,0-0.9-0.1-1.3-0.1c-2.2,0-4.5,0-6.7,0
      c-0.8,0-1.2-0.2-1.2-1.1c0-2,0-4.1,0-6.1c0-0.7,0.2-1,1-1c5,0,9.9,0,14.9,0c0.8,0,1,0.4,1,1.1c0,2.8,0,5.7,0,8.9
      c0.3-0.6,0.5-1,0.7-1.3c2.8-5.6,7.2-9,13.7-9.2c1.8-0.1,3.6-0.1,5.4-0.2c0.8,0,1.1,0.3,1.1,1.1C49.9,9.7,49.8,12,49.9,14.3z"/>
  </BaseSkeleton>
)

const NavSkeleton = ()  => {
  return (
    <div className="skeleton skeleton-nav">
      <div className="logo">
        <Logo/>
      </div>
      <div className="menu">
        {range(0, 6).map(() => (
          <div className="menu_item">
            <MenuItem/>
          </div>
        ))}
      </div>
      <div className="user">
        <UserSkeleton />
      </div>
    </div>
  )
}

export default NavSkeleton