import React from 'react';
import BaseSkeleton from './BaseSkeleton';

const RiskItemSkeleton = (props) => {
  const {
    fillPrimary = '#DBE3E6',
    fillSecondary = '#D2D9DB'
  } = props

  return (
    <div className="skeleton skeleton-risk-item">
      <div className="top">
        <div className="left">
          <BaseSkeleton
            width="350"
            height="38"
            primaryColor={fillPrimary}
            secondaryColor={fillSecondary}
          >
            <path d="M113,11.9H2c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h111c1.1,0,2,0.9,2,2v8C115,11,114.1,11.9,113,11.9z"/>
            <path d="M95,38H20c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h75c1.1,0,2,0.9,2,2v8C97,37.1,96.1,38,95,38z"/>
            <path d="M330,38h-75c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h75c1.1,0,2,0.9,2,2v8C332,37.1,331.1,38,330,38z"/>
            <path d="M348,11.9H237c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h111c1.1,0,2,0.9,2,2v8C350,11,349.1,11.9,348,11.9z"/>
          </BaseSkeleton>
        </div>
        <div className="center">
          <BaseSkeleton
            width="320"
            height="38"
            primaryColor={fillPrimary}
            secondaryColor={fillSecondary}
          >
            <path d="M50.3,38h-28c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h28c1.1,0,2,0.9,2,2v8C52.3,37.1,51.3,38,50.3,38z"/>
            <path d="M176.3,38h-28c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h28c1.1,0,2,0.9,2,2v8C178.3,37.1,177.4,38,176.3,38z"/>
            <path d="M298,38h-28c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h28c1.1,0,2,0.9,2,2v8C300,37.1,299.1,38,298,38z"/>
            <path d="M69.8,11.9h-67c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h67c1.1,0,2,0.9,2,2v8C71.8,11,70.8,11.9,69.8,11.9z"/>
            <path d="M195.8,11.9h-67c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h67c1.1,0,2,0.9,2,2v8C197.8,11,196.9,11.9,195.8,11.9z"/>
            <path d="M318,11.9h-67c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h67c1.1,0,2,0.9,2,2v8C320,11,319.1,11.9,318,11.9z"/>
          </BaseSkeleton>
        </div>
        <div className="right">
          <BaseSkeleton
            width="130"
            height="32"
            primaryColor={fillPrimary}
            secondaryColor={fillSecondary}
          >
            <circle cx="65" cy="16" r="16"/>
            <circle cx="16" cy="16" r="16"/>
            <circle cx="114" cy="16" r="16"/>
          </BaseSkeleton>
        </div>
      </div>
      <div className="bottom">
        <BaseSkeleton
          width="520"
          height="111"
          primaryColor={fillPrimary}
          secondaryColor={fillSecondary}
        >
          <path d="M122,16H11c-1.1,0-2-0.9-2-2V6c0-1.1,0.9-2,2-2h111c1.1,0,2,0.9,2,2v8C124,15.1,123.1,16,122,16z"/>
          <path d="M245,57H134c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h111c1.1,0,2,0.9,2,2v8C247,56.1,246.1,57,245,57z"/>
          <path d="M485,57H374c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h111c1.1,0,2,0.9,2,2v8C487,56.1,486.1,57,485,57z"/>
          <path d="M342,57h-67c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h67c1.1,0,2,0.9,2,2v8C344,56.1,343.1,57,342,57z"/>
          <path d="M114,57H47c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h67c1.1,0,2,0.9,2,2v8C116,56.1,115.1,57,114,57z"/>
          <path d="M446,82H335c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h111c1.1,0,2,0.9,2,2v8C448,81.1,447.1,82,446,82z"/>
          <path d="M141,82H30c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h111c1.1,0,2,0.9,2,2v8C143,81.1,142.1,82,141,82z"/>
          <path d="M228,82h-67c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h67c1.1,0,2,0.9,2,2v8C230,81.1,229.1,82,228,82z"/>
          <path d="M308,82h-67c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h67c1.1,0,2,0.9,2,2v8C310,81.1,309.1,82,308,82z"/>
          <path d="M158,107H47c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h111c1.1,0,2,0.9,2,2v8C160,106.1,159.1,107,158,107z"/>
          <path d="M282,107H171c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h111c1.1,0,2,0.9,2,2v8C284,106.1,283.1,107,282,107z"/>
          <path d="M508,107H397c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h111c1.1,0,2,0.9,2,2v8C510,106.1,509.1,107,508,107z"/>
          <path d="M371,107h-67c-1.1,0-2-0.9-2-2v-8c0-1.1,0.9-2,2-2h67c1.1,0,2,0.9,2,2v8C373,106.1,372.1,107,371,107z"/>
        </BaseSkeleton>
      </div>
    </div>
  )
}

export default RiskItemSkeleton