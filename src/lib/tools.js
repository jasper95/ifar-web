import cookie from 'cookie';
import day from 'dayjs';
import capitalize from 'lodash/capitalize';
import differenceBy from 'lodash/differenceBy';
import interSectionBy from 'lodash/intersectionBy';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import jsonexport from 'jsonexport/dist';
import fileSaver from 'file-saver';

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

export function getVulnerabilityLevel(vulnerability) {
  let level = 'low';
  const isModerate = vulnerability > 3 && vulnerability < 9;
  const isHigh = vulnerability > 8 && vulnerability < 15;
  const isCritical = vulnerability > 14;
  if (isModerate) {
    level = 'moderate';
  } else if (isHigh) {
    level = 'high';
  } else if (isCritical) {
    level = 'critical';
  }
  return level;
}

export function getArrayDiff(old, updated) {
  const removed = differenceBy(old, updated, 'id').map(e => ({ ...e, action: 'remove' }));
  const added = differenceBy(updated, old, 'id').map(e => ({ ...e, action: 'add' }));
  const remained = interSectionBy(old, updated, 'id')
    .map((e) => {
      const oldData = old.find(ee => ee.id === e.id);
      const newData = updated.find(ee => ee.id === e.id);
      const action = isEqual(oldData, newData) ? 'no_change' : 'update';
      return {
        ...e,
        action,
      };
    });
  return [...remained, ...added, ...removed];
}

export function getRecentChanges(oldData, newData, keys) {
  return keys
    .reduce((acc, el) => {
      acc = {
        ...acc,
        [el]: getArrayDiff(oldData[el] || [], newData[el] || []),
      };
      return acc;
    }, { ...newData.recent_changes });
}

export function exportCsv(data, fields, filename) {
  jsonexport(data.map(e => pick(e, fields)), (err, csv) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    fileSaver.saveAs(blob, `${day().format('MM-DD-YYYY')}_${filename}`);
  });
}

export function getSortQuery(sort) {
  return `{${Object.entries(sort)
    .map(([key, val]) => `${key}: ${val ? 'asc' : 'desc'}`)
    .join(',')}}`;
}

export function addClassTimeout({
  target, classIn, classOut, timeout, callback,
}) {
  debounce(() => {
    target.classList.remove(classOut);
    target.classList.add(classIn);
    setTimeout(() => {
      target.classList.add(classOut);
      target.classList.remove(classIn);
      callback();
    }, timeout);
  }, timeout);
}

export function filterRole(path, user) {
  const key = path.replace(/\//g, '');
  if (user.role === 'USER') {
    return user[`${key}_role`] && user[`${key}_business_units`].length;
  }
  return true;
}

let timer = 0;
export function debounce(callback, ms) {
  clearTimeout(timer);
  timer = setTimeout(callback, ms);
}
