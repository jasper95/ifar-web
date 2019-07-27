import React from 'react';
import range from 'lodash/range';

const Column = (props) => {
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
};

const RiskCircleItems = props => (
  <div className={`riskCircle riskCircle-${props.impactDriver.replace('_', '-')}`}>
    {props.children}
  </div>
);

function Map(props) {
  return (
    <div className="mapTable">
      <table cellPadding={0} cellSpacing={2}>
        <tbody>
          {range(0, 6).map(rowMapper)}
        </tbody>
      </table>
    </div>
  );

  function rowMapper(row) {
    return (
      <tr key={row}>
        {range(0, 6).map(e => columnMapper(e, row))}
      </tr>
    );
  }

  function columnMapper(column, row) {
    const {
      risks,
    } = props;

    const isLeftLabel = column === 0;
    const isBottomLabel = row === 5;

    const rowIndex = 5 - row;
    const key = `row${row}-col${column}`;

    const leftLabelMap = [
      'Rare',
      'Unlikely',
      'Moderate',
      'Likely',
      'Almost Certain',
    ];

    const bottomLabelMap = [
      'Insignificant',
      'Minor',
      'Moderate',
      'Major',
      'Extreme',
    ];

    // console.log(`column = ${column} row = ${row}`);
    // console.log(`isLeftLabel = ${isLeftLabel} isBottomLabel = ${isBottomLabel}`);

    // if left label on bottom
    if (isLeftLabel && isBottomLabel) {
      return (
        <Column
          isLabel
          key={key}
          className="mapTable_col-label-leftBottom"
        >
          <>
            <div className="mapTable_col-label-half-left">
              Likelihood
            </div>
            <div className="mapTable_col-label-half-bottom">
              Impact
            </div>
          </>
        </Column>
      );
    }

    // if left label
    if (isLeftLabel) {
      return (
        <Column
          isLabel
          key={key}
          className="mapTable_col-label-left"
        >
          <h5 className="number">{ rowIndex }</h5>
          <h5 className="title">{ leftLabelMap[rowIndex - 1] }</h5>
        </Column>
      );
    }

    // if bottom label
    if (isBottomLabel) {
      return (
        <Column
          isLabel
          key={key}
          className="mapTable_col-label-bottom"
        >
          <h5 className="number">{ column }</h5>
          <h5 className="title">{ bottomLabelMap[column - 1] }</h5>
        </Column>
      );
    }

    // if not a label
    if (!isLeftLabel && !isBottomLabel) {
      let riskColColor = 'low';
      const riskColValue = rowIndex * column;

      const isModerate = riskColValue > 3 && riskColValue < 9;
      const isHigh = riskColValue > 8 && riskColValue < 15;
      const isCritical = riskColValue > 14;

      if (isModerate) {
        riskColColor = 'moderate';
      } else if (isHigh) {
        riskColColor = 'high';
      } else if (isCritical) {
        riskColColor = 'critical';
      }

      return (
        <Column
          key={key}
          columnNumber={column}
          className={`mapTable_col-${riskColColor}`}
        >
          {risks.filter(e => e.likelihood === rowIndex && e.rating === column).map(risk => (
            <RiskCircleItems
              impactDriver={risk.impact_driver}
              children={risk.order}
            />
          ))}
        </Column>
      );
    }
  }
}

export default Map;
