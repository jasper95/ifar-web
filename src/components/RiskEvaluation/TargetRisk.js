import React from 'react';
import SelectAutocomplete from 'components/SelectAutocomplete';
import TextField from 'react-md/lib/TextFields/TextField';
import DatePicker from 'components/DatePicker';

function TargetRisk(props) {
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
        className="iField"
        label="Treatment"
        onChange={val => onChange({ ...value, treatment: val }, id)}
        value={value.treatment}
        error={!!errors[`${id}[${index}].treatment`]}
        errorText={errors[`${id}[${index}].treatment`]}
        required
      />
      <TextField
        onChange={val => onChange({ ...value, budget: val }, id)}
        value={value.budget}
        label="Budget"
        className="iField"
        error={!!errors[`${id}[${index}].budget`]}
        errorText={errors[`${id}[${index}].budget`]}
        required
      />
      <TextField
        onChange={val => onChange({ ...value, business_unit: val }, id)}
        value={value.business_unit}
        label="Business Unit"
        className="iField"
        error={!!errors[`${id}[${index}].business_unit`]}
        errorText={errors[`${id}[${index}].business_unit`]}
        required
      />
      <TextField
        onChange={val => onChange({ ...value, kpi: val }, id)}
        value={value.kpi}
        label="KPI"
        className="iField"
        error={!!errors[`${id}[${index}].kpi`]}
        errorText={errors[`${id}[${index}].kpi`]}
        required
      />
      <DatePicker
        placeholderText="Start Date"
        onChange={val => onChange({ ...value, start_date: val }, id)}
        value={value.start_date}
      />
      <DatePicker
        placeholderText="End Date"
        onChange={val => onChange({ ...value, end_date: val }, id)}
        value={value.end_date}
      />
    </>
  );
}

export default TargetRisk;
