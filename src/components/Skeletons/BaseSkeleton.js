import React from 'react';
import ContentLoader from 'react-content-loader';

const BaseSkeleton = (props) => {
  const {
    width,
    height,
    primaryColor,
    secondaryColor,
    children,
    responsiveObj,
  } = props;

  const defaults = {
    primaryColor: '#E0D5D5',
    secondaryColor: '#FFFFFF',
    speed: 0.75,
  };

  const bodyel = document.getElementsByTagName('body')[0];

  if (!bodyel) { return; }
  const { width: boundWidth } = bodyel.getBoundingClientRect();

  if (responsiveObj) {
    const responsiveChild = Object.keys(responsiveObj).find(screenKey => parseInt(screenKey) < boundWidth);
    return (
      <ContentLoader
        {...defaults}
        width={responsiveChild.width}
        height={responsiveChild.height}
        primaryColor={responsiveChild.primaryColor}
        secondaryColor={responsiveChild.secondaryColor}
      >
        { responsiveChild.children }
      </ContentLoader>
    );
  }

  return (
    <ContentLoader
      {...defaults}
      width={width}
      height={height}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    >
      {children}
    </ContentLoader>
  );
};

export default BaseSkeleton;
