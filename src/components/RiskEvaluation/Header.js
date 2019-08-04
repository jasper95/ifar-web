import React from 'react';
import PropTypes from 'prop-types';

function Header(props) {
  const { title, desc } = props;
  return (
    <div className="riskEvaluation_header">
      { title && (
      <h2 className="riskEvaluation_header_title">
        {title}
      </h2>
      )}
      { desc && (
      <p className="riskEvaluation_header_desc">
        {desc}
      </p>
      )}
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

export default Header;
