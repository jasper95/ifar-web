import React from 'react';

function TooltipDetails(props) {
  const { risk } = props;
  console.log('risk: ', risk);
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

      <div className="riskMapTooltip_divider" />

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

      <div className="riskMapTooltip_divider" />
      <RatingInfo title="Inherent Evaluation" likelihood={risk.inherent_likelihood} rating={risk.inherent_rating} />
      <RatingInfo title="Target Evaluation" likelihood={risk.target_likelihood} rating={risk.target_rating} />
    </div>
  );
}

function RatingInfo(props) {
  const {
    title, likelihood, rating,
  } = props;
  const vulnerability = !Number.isNaN(likelihood) && !Number.isNaN(rating)
    ? Number(likelihood) * Number(rating) : null;
  return (
    <div className="riskMapTooltip_info">
      <span className="label">{title}</span>
      <div className="md-grid">
        <span className="md-cell md-cell--4">{likelihood || '-'}</span>
        <span className="md-cell md-cell--4">{rating || '-'}</span>
        <span className="md-cell md-cell--4">{vulnerability || '-'}</span>
      </div>
      <div className="md-grid">
        <span className="md-cell md-cell--4">Likelihood</span>
        <span className="md-cell md-cell--4">Impact</span>
        <span className="md-cell md-cell--4">Vulnerability</span>
      </div>
    </div>
  );
}

export default TooltipDetails;
