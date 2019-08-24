import React from 'react';
import BaseSkeleton from './BaseSkeleton';

const ChartSkeleton = ()  => {
  return (
    <div className="skeleton skeleton-chart">
      <BaseSkeleton
        width="162.3"
        height="162.3"
        primaryColor='#DAD7D7'
        secondaryColor='#DFDDDD'
      >
          <path d="M82,161.5c-44.4,0-80.5-36.1-80.5-80.5S37.6,0.5,82,0.5s80.5,36.1,80.5,80.5S126.4,161.5,82,161.5z M82,14.5
            c-36.7,0-66.5,29.8-66.5,66.5s29.8,66.5,66.5,66.5c36.7,0,66.5-29.8,66.5-66.5S118.7,14.5,82,14.5z"/>
      </BaseSkeleton>
    </div>
  )
}

export default ChartSkeleton