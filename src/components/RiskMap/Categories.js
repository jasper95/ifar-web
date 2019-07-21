import React from 'react';
import Button from 'react-md/lib/Buttons/Button';

function Categories({ riskTypes }) {
  return (
    <div className="mapCategories">
      { riskTypes.map(risk => (
        <Button
          className={`iBttn iBttn-rafi-${risk.cssColorKey}`}
        >
          {risk.label}
        </Button>
      ))}
    </div>
  );
}

export default Categories;
