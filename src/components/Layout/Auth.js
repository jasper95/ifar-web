import React from 'react';
import Link from 'react-router-dom/Link';

function AuthLayout(props) {
  const { children, header } = props;
  return (
    <div className="authContainer">
      <div className="authContainer_content">
        <div className="authContainer_contentHeader">
          <Link to="/" className="authContainer_contentHeader_logo">
            <img
              src="/static/img/logo.png"
              alt=""
            />
          </Link>
          {header}
        </div>
        {children}
      </div>
      <div className="authContainer_bg" />
    </div>
  );
}

export default AuthLayout;
