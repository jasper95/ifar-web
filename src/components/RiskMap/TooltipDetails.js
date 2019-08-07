import React from 'react';

function TooltipDetails(props) {
  const { risk } = props;
  return (
    <div className="riskMapTooltip">

      <div className="riskMapTooltip_info">
        <span className="label">Risk Name :</span> 
        <span className="name">{risk.name}</span>
      </div>

      <div className="riskMapTooltip_info">
        <span className="label">Risk Definition :</span>
        <span className="name">{name}</span>
      </div>

      <div className="riskMapTooltip_infoList">
        <h1 className="riskMapTooltip_infoList_header">
          Risk Causes
        </h1>
        <ul className="riskMapTooltip_infoList_list">
          {risk.causes.map(e => (
            <li className="riskMapTooltip_infoList_list_item">
              {e.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="riskMapTooltip_divider"/>

      <div className="riskMapTooltip_infoList">
        <h1 className="riskMapTooltip_infoList_header">
          Risk Impact
        </h1>
        <ul className="riskMapTooltip_infoList_list">
          {risk.impacts.map(e => (
            <li className="riskMapTooltip_infoList_list_item">
              {e.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="riskMapTooltip_divider"/>

      <div className="riskMapTooltip_info">
        <span className="label">Inherent Evaluation :</span>
      </div>
    </div>
  );
}

export default TooltipDetails;
