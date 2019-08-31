import ExcelJs from 'exceljs';
import fileSaver from 'file-saver';
import findIndex from 'lodash/findIndex';
import uniq from 'lodash/uniq';
import day from 'dayjs';
import { getVulnerabilityLevel } from 'lib/tools';

export default async function generateRiskMapExcel(data, filename = `PRMP_${day().format('MM/DD/YYYY')}.xlsx`) {
  const wb = new ExcelJs.Workbook();
  const ws = wb.addWorksheet('Risk Management Plan', {
    views: [
      { state: 'frozen', ySplit: 5, xSplit: 1 },
    ],
  });
  initHeaders(ws);
  data.forEach((risk, index) => mapData(ws, risk, index));
  autoSize(ws, 1);
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  fileSaver.saveAs(blob, filename);
}

function mapData(ws, risk, index) {
  const START_ROW = 6;
  const rowNumber = START_ROW + index;
  setValueAndMerge(ws, risk.classification_name, `A${rowNumber}`);
  setValueAndMerge(ws, '', `B${rowNumber}`);
  setValueAndMerge(ws, risk.name, `C${rowNumber}`);
  setValueAndMerge(ws, risk.definition, `D${rowNumber}`);
  setValueAndMerge(ws, risk.causes.map(e => e.name).join(', '), `E${rowNumber}`);
  setValueAndMerge(ws, risk.impacts.map(e => e.name).join(', '), `F${rowNumber}`);
  setValueAndMerge(ws, risk.stakeholders.map(e => e.name).join(', '), `G${rowNumber}`);
  setValueAndMerge(ws, risk.inherent_likelihood || '', `H${rowNumber}`, { fgColor: { argb: 'FDE8D9' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.inherent, 'management_action'), `I${rowNumber}`, { fgColor: { argb: 'FDE8D9' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.inherent, 'financial'), `J${rowNumber}`, { fgColor: { argb: 'FDE8D9' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.inherent, 'reputation'), `K${rowNumber}`, { fgColor: { argb: 'FDE8D9' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.inherent, 'health_safety_security'), `L${rowNumber}`, { fgColor: { argb: 'FDE8D9' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.inherent, 'operational'), `M${rowNumber}`, { fgColor: { argb: 'FDE8D9' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.inherent, 'legal_compliance'), `N${rowNumber}`, { fgColor: { argb: 'FDE8D9' } });
  const inherentVulnerability = getStageVulnerability(risk, 'inherent');
  setValueAndMerge(ws, inherentVulnerability, `O${rowNumber}`, { fgColor: { argb: getVulnerabilityColor(inherentVulnerability) } });
  setValueAndMerge(ws, '', `P${rowNumber}`);
  setValueAndMerge(ws, uniq(risk.current_treatments.map(e => e.strategy)).join(', '), `Q${rowNumber}`);
  setValueAndMerge(ws, risk.current_treatments.map(e => e.treatment).join(', '), `R${rowNumber}`);
  setValueAndMerge(ws, risk.current_treatments.map(e => e.business_unit).join(', '), `S${rowNumber}`);
  setValueAndMerge(ws, risk.current_treatments.map(e => e.kpi).join(', '), `T${rowNumber}`);
  setValueAndMerge(ws, '', `U${rowNumber}`);
  setValueAndMerge(ws, risk.residual_likelihood || '', `V${rowNumber}`, { fgColor: { argb: 'EBF1DE' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.residual, 'management_action'), `W${rowNumber}`, { fgColor: { argb: 'EBF1DE' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.residual, 'financial'), `X${rowNumber}`, { fgColor: { argb: 'EBF1DE' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.residual, 'reputation'), `Y${rowNumber}`, { fgColor: { argb: 'EBF1DE' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.residual, 'health_safety_security'), `Z${rowNumber}`, { fgColor: { argb: 'EBF1DE' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.residual, 'operational'), `AA${rowNumber}`, { fgColor: { argb: 'EBF1DE' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.residual, 'legal_compliance'), `AB${rowNumber}`, { fgColor: { argb: 'EBF1DE' } });
  const residualVulnerability = getStageVulnerability(risk, 'residual');
  setValueAndMerge(ws, residualVulnerability, `AC${rowNumber}`, { fgColor: { argb: getVulnerabilityColor(residualVulnerability) } });
  setValueAndMerge(ws, uniq(risk.future_treatments.map(e => e.strategy)).join(', '), `AD${rowNumber}`);
  setValueAndMerge(ws, risk.future_treatments.map(e => e.treatment).join(', '), `AE${rowNumber}`);
  setValueAndMerge(ws, risk.future_treatments.map(e => e.business_unit).join(', '), `AF${rowNumber}`);
  setValueAndMerge(ws, risk.future_treatments.map(e => e.budget).join(', '), `AG${rowNumber}`);
  setValueAndMerge(ws, risk.future_treatments.map(e => day(e.start_date).format('MM/DD/YYYY')).join(', '), `AH${rowNumber}`);
  setValueAndMerge(ws, risk.future_treatments.map(e => day(e.end_date).format('MM/DD/YYYY')).join(', '), `AI${rowNumber}`);
  setValueAndMerge(ws, risk.future_treatments.map(e => e.kpi).join(', '), `AJ${rowNumber}`);
  setValueAndMerge(ws, '', `AK${rowNumber}`);
  setValueAndMerge(ws, risk.target_likelihood || '', `AL${rowNumber}`, { fgColor: { argb: 'DBE5F1' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.target, 'management_action'), `AM${rowNumber}`, { fgColor: { argb: 'DBE5F1' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.target, 'financial'), `AN${rowNumber}`, { fgColor: { argb: 'DBE5F1' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.target, 'reputation'), `AO${rowNumber}`, { fgColor: { argb: 'DBE5F1' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.target, 'health_safety_security'), `AP${rowNumber}`, { fgColor: { argb: 'DBE5F1' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.target, 'operational'), `AQ${rowNumber}`, { fgColor: { argb: 'DBE5F1' } });
  setValueAndMerge(ws, getStageRating(risk.impact_details.target, 'legal_compliance'), `AR${rowNumber}`, { fgColor: { argb: 'DBE5F1' } });
  const targetVulnerability = getStageVulnerability(risk, 'target');
  setValueAndMerge(ws, targetVulnerability, `AS${rowNumber}`, { fgColor: { argb: getVulnerabilityColor(targetVulnerability) } });
  setValueAndMerge(ws, '', `AT${rowNumber}`);
}

function getStageRating(stage, type) {
  if (stage && stage[type]) {
    return stage[type];
  }
  return '';
}

function getVulnerabilityColor(vulnerability) {
  if (!vulnerability) {
    return 'FFFFFF';
  }
  const level = getVulnerabilityLevel(vulnerability);
  return {
    low: '4BEC57',
    moderate: 'F7DD2B',
    high: 'FF8A00',
    critical: 'FF2400',
  }[level];
}

function getStageVulnerability(risk, type) {
  const { [`${type}_likelihood`]: likelihood, [`${type}_rating`]: rating } = risk;
  if (likelihood && rating) {
    return likelihood * rating;
  }
  return '';
}


function initHeaders(ws) {
  setHeaderCell(ws, 'RISK MANAGEMENT PLAN', 'A1', { extend_column: 45, fgColor: { argb: 'FFC000' } });
  setHeaderCell(ws, 'RISK ASSESSMENT(Risk Register)', 'A2', { extend_column: 15, fgColor: { argb: '0070C0' }, fontColor: { argb: 'FFFFFF' } });
  setHeaderCell(ws, 'RISK TREATMENT', 'Q2', { extend_column: 20 });
  setHeaderCell(ws, 'TARGET', 'AL2', { extend_column: 8, fgColor: { argb: 'FEFF00' } });

  setHeaderCell(ws, 'RISK CLASSIFICATION', 'A3', { extend_row: 2 });
  setHeaderCell(ws, 'Objective', 'B3', { extend_row: 2 });
  setHeaderCell(ws, 'RISK NAME', 'C3', { extend_row: 2 });
  setHeaderCell(ws, 'DEFINITION', 'D3', { extend_row: 2 });
  setHeaderCell(ws, 'CAUSES', 'E3', { extend_row: 2 });
  setHeaderCell(ws, 'IMPACT', 'F3', { extend_row: 2 });
  setHeaderCell(ws, 'Affected Stakeholders', 'G3', { extend_row: 2 });

  setHeaderCell(ws, 'Inherent', 'H3', { extend_column: 8, fgColor: { argb: 'C00000' }, fontColor: { argb: 'FFFFFF' } });
  setHeaderCell(ws, 'Likelihood', 'H4', { extend_row: 1 });
  setHeaderCell(ws, 'Impact', 'I4', { extend_column: 5 });
  setHeaderCell(ws, 'Vulnerability', 'O4', { extend_row: 1 });
  setHeaderCell(ws, 'Remarks', 'P4', { extend_row: 1 });

  setHeaderCell(ws, 'MGT Action', 'I5');
  setHeaderCell(ws, 'Financial', 'J5');
  setHeaderCell(ws, 'Reputation', 'K5');
  setHeaderCell(ws, 'HSS', 'L5');
  setHeaderCell(ws, 'Ops', 'M5');
  setHeaderCell(ws, 'Legal and Compliance', 'N5');

  setHeaderCell(ws, 'RISK TREATMENT STRATEGY', 'Q3', { extend_row: 2 });
  setHeaderCell(ws, 'CURRENT RISK ACTIONS', 'R3', { extend_column: 2 });
  setHeaderCell(ws, 'Remarks', 'U3', { extend_row: 2 });

  setHeaderCell(ws, 'Risk Treatment', 'R4', { extend_row: 1 });
  setHeaderCell(ws, 'CHAMPION UNIT/PERSON', 'S4', { extend_row: 1 });
  setHeaderCell(ws, 'KPI', 'T4', { extend_row: 1 });

  setHeaderCell(ws, 'Residual', 'V3', { extend_column: 7, fgColor: { argb: '00B050' }, fontColor: { argb: 'FFFFFF' } });
  setHeaderCell(ws, 'Likelihood', 'V4', { extend_row: 1 });
  setHeaderCell(ws, 'Impact', 'W4', { extend_column: 5 });
  setHeaderCell(ws, 'Vulnerability', 'AC4', { extend_row: 1 });

  setHeaderCell(ws, 'Mgt Action', 'W5');
  setHeaderCell(ws, 'Financial', 'X5');
  setHeaderCell(ws, 'Reputation', 'Y5');
  setHeaderCell(ws, 'HSS', 'Z5');
  setHeaderCell(ws, 'Ops', 'AA5');
  setHeaderCell(ws, 'Legal and Compliance', 'AB5');

  setHeaderCell(ws, 'RISK TREATMENT STRATEGY', 'AD3', { extend_row: 2 });
  setHeaderCell(ws, 'FUTURE ACTIONS', 'AE3', { extend_column: 1 });
  setHeaderCell(ws, 'Future Plan', 'AE4', { extend_row: 1 });
  setHeaderCell(ws, 'CHAMPION UNIT/PERSON', 'AF4', { extend_row: 1 });
  setHeaderCell(ws, 'BUDGET/RESOURCES', 'AG3', { extend_row: 2 });
  setHeaderCell(ws, 'TIMELINE', 'AH3', { extend_column: 1 });
  setHeaderCell(ws, 'Start', 'AH4', { extend_row: 1 });
  setHeaderCell(ws, 'End', 'AI4', { extend_row: 1 });
  setHeaderCell(ws, 'KPI', 'AJ3', { extend_row: 2 });
  setHeaderCell(ws, 'Remarks', 'AK3', { extend_row: 2 });

  setHeaderCell(ws, 'LIKELIHOOD', 'AL3', { extend_row: 2 });
  setHeaderCell(ws, 'IMPACT', 'AM3', { extend_column: 5, extend_row: 1 });

  setHeaderCell(ws, 'Mgt Action', 'AM5');
  setHeaderCell(ws, 'Financial', 'AN5');
  setHeaderCell(ws, 'Reputation', 'AO5');
  setHeaderCell(ws, 'HSS', 'AP5');
  setHeaderCell(ws, 'Ops', 'AQ5');
  setHeaderCell(ws, 'Legal and Compliance', 'AR5');
  setHeaderCell(ws, 'VULNERABILITY', 'AS3', { extend_row: 2 });
  setHeaderCell(ws, 'Remarks', 'AT3', { extend_row: 2 });
}

function setHeaderCell(ws, value, start, options = {}) {
  const { fgColor = { argb: 'D9D9D9' }, fontColor, ...restOptions } = options;
  const font = {
    size: 12,
    bold: true,
    color: fontColor,
  };
  setValueAndMerge(ws, value, start, { ...restOptions, fgColor, font });
}

function setValueAndMerge(ws, value, start, options = {}) {
  const {
    extend_column, extend_row, fgColor, font = {},
  } = options;
  let end;
  if (extend_row) {
    end = getCell(cellToObject(start), extend_row, 'row');
  }
  if (extend_column) {
    end = getCell(end || cellToObject(start), extend_column, 'column');
  }
  if (end) {
    ws.mergeCells(`${start}:${end.column}${end.row}`);
  }
  const cell = ws.getCell(start);
  cell.value = value;
  cell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
  cell.font = {
    size: 12,
    ...font,
  };
  cell.border = {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } },
  };
  if (fgColor) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor,
    };
  }
}

function getCell({ row, column }, extend, direction) {
  if (!extend || !direction || extend === 0) {
    return { row, column };
  }
  if (direction === 'row') {
    row += extend;
  } else {
    const currentColumnNumber = getColumnNumber(column);
    column = getColumnString(currentColumnNumber + extend);
  }
  return { row, column };
}

function getColumnString(column) {
  let columnString = '';
  let columnNumber = Number(column);
  while (columnNumber > 0) {
    const currentLetterNumber = (columnNumber - 1) % 26;
    const currentLetter = String.fromCharCode(currentLetterNumber + 65);
    columnString = currentLetter + columnString;
    columnNumber = (columnNumber - (currentLetterNumber + 1)) / 26;
  }
  return columnString;
}

function getColumnNumber(val) {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // i, j, result = 0;

  return val.split('').reduce((acc, el, idx, arr) => {
    const j = (arr.length - 1) - idx;
    const x = Math.pow(base.length, j);
    const y = (base.indexOf(el) + 1);
    acc += (x * y);
    return acc;
  }, 0);
}

function cellToObject(cellString) {
  const splitPoint = findIndex(cellString.split(''), e => !isNaN(e));
  return {
    column: cellString.slice(0, splitPoint),
    row: Number(cellString.slice(splitPoint)),
  };
}

export const PIXELS_PER_EXCEL_WIDTH_UNIT = 12;

export function autoSize(sheet, fromRow) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const maxColumnLengths = [];
  sheet.eachRow((row, rowNum) => {
    if (rowNum < fromRow) {
      return;
    }

    row.eachCell((cell, num) => {
      if (typeof cell.value === 'string') {
        if (maxColumnLengths[num] === undefined) {
          maxColumnLengths[num] = 0;
        }

        const fontSize = cell.font && cell.font.size ? cell.font.size : 11;
        ctx.font = `${fontSize}pt Arial`;
        const metrics = ctx.measureText(cell.value);
        const cellWidth = metrics.width;

        maxColumnLengths[num] = Math.max(maxColumnLengths[num], cellWidth);
      }
    });
  });

  for (let i = 1; i <= sheet.columnCount; i++) {
    const col = sheet.getColumn(i);
    const width = maxColumnLengths[i];
    if (width) {
      col.width = width / PIXELS_PER_EXCEL_WIDTH_UNIT + 1;
    }
  }
}
