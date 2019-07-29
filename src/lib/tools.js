import { useMemo } from 'react';
import barangay from 'lib/constants/address/barangay';
import municipality from 'lib/constants/address/municipality';
import province from 'lib/constants/address/province';
import orderBy from 'lodash/orderBy';
import cookie from 'cookie';
import day from 'dayjs';
import capitalize from 'lodash/capitalize';
import camelCase from 'lodash/camelCase';
// import queryString from 'query-string';

const barangayOptions = barangay.RECORDS;
const municipalityOptions = municipality.RECORDS;
const provinceOptions = province.RECORDS;

export function getAddressOptions(field, fields) {
  if (field === 'barangay') {
    return useMemo(() => orderBy(
      barangayOptions.filter(e => e.citymunCode === fields.municipality),
      'brgyDesc',
    ),
    [fields.municipality]);
  }
  if (field === 'municipality') {
    return useMemo(() => orderBy(
      municipalityOptions.filter(e => e.provCode === fields.province),
      'citymunDesc',
    ),
    [fields.province]);
  }
  if (field === 'province') {
    return orderBy(provinceOptions, 'provDesc');
  }
  return [];
}

export function getAddressDescription({ province, barangay, municipality }) {
  const { citymunDesc = '' } = municipalityOptions.find(e => e.citymunCode === municipality) || {};
  const { brgyDesc = '' } = barangayOptions.find(e => e.brgyCode === barangay) || {};
  const { provDesc = '' } = provinceOptions.find(e => e.provCode === province) || {};
  return {
    barangay: brgyDesc,
    municipality: citymunDesc,
    province: provDesc,
  };
}

export function getAddressValue(field, fields) {
  if (field === 'province') {
    return useMemo(() => (fields.province ? provinceOptions.find(e => e.provCode === fields.province) : ''), [fields[field]]);
  }
  if (field === 'municipality') {
    return useMemo(() => (fields.municipality ? municipalityOptions.find(e => e.citymunCode === fields.municipality) : ''), [fields[field]]);
  }
  if (field === 'barangay') {
    return useMemo(() => (fields.barangay ? barangayOptions.find(e => e.brgyCode === fields.barangay) : ''), [fields[field]]);
  }
  return '';
}

export function getValidationResult(data, schema) {
  try {
    schema.validateSync(data, { abortEarly: false, allowUnknown: true });
    return {
      errors: {},
      isValid: true,
    };
  } catch (err) {
    const errors = err.inner
      .reduce((acc, el) => {
        const { path, message } = el;
        acc[path] = message;
        return acc;
      }, {});
    return { isValid: false, errors };
  }
}

export function validateDescription(description) {
  const isValid = description && description.blocks.some(block => (!block.text.trim() && '\n') || block.text);
  return !isValid ? { description: 'Description is required' } : {};
}

export function formatMonthYearToISO(data, keys = ['start_date', 'end_date']) {
  return keys.reduce((acc, key) => {
    const value = acc[key];
    acc[key] = value ? day(value).date(30).toISOString() : '';
    return acc;
  }, { ...data });
}

export function formatISOToDate(data, keys = ['start_date', 'end_date'], format = 'YYYY-MM') {
  return keys.reduce((acc, key) => {
    const value = acc[key];
    acc[key] = value ? day(value).format(format) : '';
    return acc;
  }, { ...data });
}

export function formatDateToISO(data, keys = ['start_date', 'end_date'], format = 'YYYY-MM') {
  return keys.reduce((acc, key) => {
    const value = acc[key];
    acc[key] = value ? day(value, format).toISOString() : '';
    return acc;
  }, { ...data });
}

// export function getFileLink(data) {
//   return `${process.env.API_URL}/file/download?${queryString.stringify(data)}`;
// }

export function getDownloadFilename(headers = {}) {
  const { 'content-disposition': disposition = '' } = headers;
  const keyValue = disposition.split(';').find(e => e.includes('filename')) || '';
  const [, filename] = keyValue.split('=');
  return filename;
}

export async function delay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function parseCookies(req, options = {}) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie, options);
}

export function fieldIsRequired({ label, path }) {
  const display = label || path
    .split('.')
    .pop()
    .split('_')
    .filter(e => e !== 'id')
    .map(capitalize)
    .join(' ');
  return `${display} is required`;
}

export function fieldIsInvalid({ label, path }) {
  const display = label || path
    .split('.')
    .pop()
    .split('_')
    .filter(e => e !== 'id')
    .map(capitalize)
    .join(' ');
  return `${display} is required`;
}

export function getImpactDriver(stage) {
  const max = Math.max(...Object.values(stage));
  const keys = Object.keys(stage)
    .filter(e => stage[e] === max);

  return ['financial', 'reputation', 'operational', 'legal_compliance', 'health_safety_security', 'management_action'].find(e => keys.includes(e));
}
