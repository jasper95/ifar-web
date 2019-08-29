import React from 'react';
import BaseSkeleton from './BaseSkeleton';


const BtnItems = () => (
  <div className="chartList_item">
    <BaseSkeleton
      width="162.3"
      height="162.3"
      primaryColor='#DAD7D7'
      secondaryColor='#DFDDDD'
    >
      <path d="M234.5,28h-212c-3.6,0-6.5-2.9-6.5-6.5v0c0-3.6,2.9-6.5,6.5-6.5h212c3.6,0,6.5,2.9,6.5,6.5v0C241,25.1,238.1,28,234.5,28z"
        />
      <path d="M373,34h-21c-2.2,0-4-1.8-4-4V13c0-2.2,1.8-4,4-4h21c2.2,0,4,1.8,4,4v17C377,32.2,375.2,34,373,34z"/>
    </BaseSkeleton>
  </div>
)
const ChartSkeleton = ()  => {
  return (
    <div className="skeleton skeleton-chart">
      <div className="chart">
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
      <div className="chartList">
        <BtnItems/>
        <BtnItems/>
        <BtnItems/>
        <BtnItems/>
      </div>
    </div>
  )
}

export default ChartSkeleton