import React from 'react';
import flowRight from 'lodash/flowRight';
import TextField from 'react-md/lib/TextFields/TextField';
import TextFieldMessage from 'react-md/lib/TextFields/TextFieldMessage';
import withDialog from 'lib/hocs/dialog';
import { getValidationResult } from 'lib/tools';
import * as yup from 'yup';
import Select from 'react-select';
import useQuery from 'apollo/query';
import gql from 'graphql-tag';
import DatePicker from 'react-datepicker';

const JOB_CATEGORY_QUERY = gql`
  query {
    job_category {
      id,
      name
    }
  }
`;

function EducationDialog(props) {
  const { formState, formHandlers } = props;
  const { fields, errors } = formState;
  const { onElementChange, onChange } = formHandlers;
  const { data } = useQuery(JOB_CATEGORY_QUERY);
  return (
    <>
      <div className="iField">
        <label>Field of Study*</label>
        <Select
          isSearchable
          id="job_category"
          getOptionLabel={e => e.name}
          getOptionValue={e => e.id}
          onChange={(value) => {
            onChange('job_category', value);
            onChange('job_category_id', value.id);
          }}
          options={data.job_category || []}
          value={fields.job_category}
        />
        <TextFieldMessage
          errorText={errors.job_category_id}
          error={errors.job_category_id}
        />
      </div>
      <TextField
        className="iField"
        required
        id="qualification"
        label="Qualification"
        onChange={onElementChange}
        error={!!errors.qualification}
        errorText={errors.qualification}
        value={fields.qualification || ''}
      />
      <TextField
        className="iField"
        required
        id="school"
        label="University/Institute"
        onChange={onElementChange}
        error={!!errors.school}
        errorText={errors.school}
        value={fields.school || ''}
      />
      <div className="row iFieldRow">
        <div className="iField col-md-6">
          <label>Admission Date*</label>
          <DatePicker
            selected={fields.start_date || ''}
            placeholderText="Select Date"
            onChange={value => onChange('start_date', value)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
          <TextFieldMessage
            errorText={errors.start_date}
            error={errors.start_date}
          />
        </div>
        <div className="iField col-md-6">
          <label>Graduation Date</label>
          <DatePicker
            selected={fields.end_date || ''}
            placeholderText="Select Date"
            onChange={value => onChange('end_date', value)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            isClearable
          />
          <TextFieldMessage
            errorText={errors.end_date}
            error={errors.end_date}
          />
        </div>
      </div>
    </>
  );
}

function validator(data) {
  const schema = yup.object({
    job_category_id: yup.string().required('Field of Study is required'),
    start_date: yup.date().required('Admission Date is required'),
    qualification: yup.string().required('Qualification is required'),
    school: yup.string().required('University/Institute is required'),
  });
  return getValidationResult(data, schema);
}

const Dialog = flowRight(
  withDialog(),
  // connect(formOptionsSelector)
)(EducationDialog);

Dialog.defaultProps = {
  validator,
};

export default Dialog;
