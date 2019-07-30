import React from 'react';

function TooltipDetails(props) {
  const { risk } = props;
  return (
    <div>
      <div>
        <span>Risk Name</span>
        :
        <span>{risk.name}</span>
      </div>
      <div>
        <span>Risk Definition</span>
        :
        <span>{risk.name}</span>
      </div>
      <div>
        <span>Risk Causes</span>
        <ul>
          {risk.causes.map(e => (
            <li>{e.name}</li>
          ))}
        </ul>
      </div>
      <hr />
      <div>
        <span>Risk Impact</span>
        <ul>
          {risk.impacts.map(e => (
            <li>{e.name}</li>
          ))}
        </ul>
      </div>
      <hr />
      <div>
        <span>Inherent Evaluation</span>
      </div>
    </div>
  );
}

export default TooltipDetails;
