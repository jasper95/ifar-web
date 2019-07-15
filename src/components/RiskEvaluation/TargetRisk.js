import React from 'react';
import SelectAutocomplete from 'components/SelectAutocomplete';
import TextField from 'react-md/lib/TextFields/TextField';
import DatePicker from 'components/DatePicker';

function TargetRisk(props) {
  const { onChange, id, value } = props;
  return (
    <>
      <SelectAutocomplete
        id="strategy"
        onChange={val => onChange({ ...value, strategy: val }, id)}
        value={value.strategy}
        options={['Reduce', 'Transfer', 'Avoid', 'Accept']}
      />
      <TextField
        onChange={val => onChange({ ...value, plan: val }, id)}
        value={value.plan}
      />
      <TextField
        onChange={val => onChange({ ...value, budget: val }, id)}
        value={value.budget}
      />
      <TextField
        onChange={val => onChange({ ...value, business_unit: val }, id)}
        value={value.business_unit}
      />
      <TextField
        onChange={val => onChange({ ...value, kpi: val }, id)}
        value={value.kpi}
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
