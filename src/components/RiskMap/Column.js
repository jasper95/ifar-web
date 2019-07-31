import React from 'react';

function Column(props) {
  const {
    key,
    label,
    columnNumber,
    className,
    children,
    isLabel,
  } = props;
  return (
    <td key={key} className={`mapTable_col ${className}`}>
      <div className="mapTable_col_container">
        {!isLabel && columnNumber && (
          <div className="mapTable_col_numLabel">
            {columnNumber}
          </div>
        )}
        <div className="mapTable_col_content">
          { children }
        </div>
      </div>
    </td>
  );
}

export default Column;
