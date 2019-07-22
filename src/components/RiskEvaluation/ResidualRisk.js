import React from 'react';
import SelectAutocomplete from 'components/SelectAutocomplete';
import TextField from 'react-md/lib/TextFields/TextField';

function ResidualRisk(props) {
  const {
    onChange, id, value, errors, index,
  } = props;
  return (
    <>
      <SelectAutocomplete
        id="strategy"
        onChange={val => onChange({ ...value, strategy: val }, id)}
        value={value.strategy}
        options={['Reduce', 'Transfer', 'Avoid', 'Accept']}
        error={errors[`${id}[${index}].strategy`]}
        label="Strategy"
        required
      />
      <TextField
        id="treatment"
        className="iField"
        label="Treatment"
        onChange={val => onChange({ ...value, treatment: val }, id)}
        value={value.treatment}
        error={!!errors[`${id}[${index}].treatment`]}
        errorText={errors[`${id}[${index}].treatment`]}
        required
      />
      <TextField
        id="business_unit"
        className="iField"
        label="Business Unit"
        onChange={val => onChange({ ...value, business_unit: val }, id)}
        value={value.business_unit}
        error={!!errors[`${id}[${index}].business_unit`]}
        errorText={errors[`${id}[${index}].business_unit`]}
        required
      />
      <TextField
        id="kpi"
        className="iField"
        label="KPI"
        onChange={val => onChange({ ...value, kpi: val }, id)}
        value={value.kpi}
        error={!!errors[`${id}[${index}].kpi`]}
        errorText={errors[`${id}[${index}].kpi`]}
        required
      />
    </>
  );
}

export default ResidualRisk;
