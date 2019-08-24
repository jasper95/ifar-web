import React from 'react';
import BaseSkeleton from './BaseSkeleton';

const UserSkeleton = ()  => {
  return (
    <div className="skeleton">
      <BaseSkeleton
        width="208"
        height="44"
        primaryColor='#252525'
        secondaryColor='#3C3C3C'
      >
        <path d="
          M4,30h140c2.2,0,4-1.8,4-4v-4c0-2.2-1.8-4-4-4H4c-2.2,
          0-4,1.8-4,4v4C0,28.2,1.8,30,4,30z"
        />
        <circle cx="186" cy="22" r="22"/>
      </BaseSkeleton>
    </div>
  )
}

export default UserSkeleton