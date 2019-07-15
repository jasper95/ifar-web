export const basisOptions = ['Frequency', 'Probability'].map(e => ({ label: e, value: e }));
export const frequencyOptions = [
  {
    value: '1',
    label: '1 - Below 5%',
  },
  {
    value: '2',
    label: '2 - Above 5% - 35%',
  },
  {
    value: '3',
    label: '1 - Above 35% - 65%',
  },
  {
    value: '4',
    label: '1 - Above 65% - 95%',
  },
];
export const probabilityOptions = [
  {
    value: '1',
    label: '1 - Similar events occur at least once every 1000 years',
  },
  {
    value: '2',
    label: '2 - Similar events occur at least once every 30 years',
  },
  {
    value: '3',
    label: '3 - Similar events occur at least once every 10 years',
  },
  {
    value: '4',
    label: '4 - Similar events occur at least once every 3 years',
  },
  {
    value: '5',
    label: '5 - Similar events occur at least once every year',
  },
];
export const managementActionOptions = [
  {
    value: '1',
    label: '1 - Managers / Program Officers',
  },
  {
    value: '2',
    label: '2 - Management Committee',
  },
  {
    value: '3',
    label: '3 - Executive Committee',
  },
  {
    value: '4',
    label: '4 - Board Risk Management Committee',
  },
  {
    value: '5',
    label: '5 - Board of Trustees',
  },
];

export const reputionOptions = [
  {
    value: '1',
    label: '1 - Brief attention in local news/social media. Threatened dissolution of associates',
  },
  {
    value: '2',
    label: '2 - Attention in local news/social media for up to one week. Threatened dissolution of secondary partners',
  },
  {
    value: '3',
    label: '3 - Attention in national news/social media < 1 week; local media >=1 to 2 weeks; surrounding communities <= 2 weeks. Threatened dissolution of primary partners',
  },
  {
    value: '4',
    label: '4 - Headlines in international news/social media < week; national media = 1 to 2 weeks; local media > 2 weeks or sustained negative/positive reaction among surrouding communities. Loss of key partner',
  },
  {
    value: '5',
    label: '5 - Intense negative/positive headlines in international media for more than 1 week or in the national media for more than 2 weeks. Loss of multiple key partners, with inability to establish future partnerships with other organizations.',
  },
];

export const financialOptions = [
  {
    value: '1',
    label: '1 - Impaired 5% and below of Budgeted Outflow',
  },
  {
    value: '2',
    label: '2 - Impaired 10% of Budgeted Outflow',
  },
  {
    value: '3',
    label: '3 - Impaired 15% of Budgeted Outflow',
  },
  {
    value: '4',
    label: '4 - Impaired 20% of Budgeted Outflow',
  },
  {
    value: '5',
    label: '5 - Impaired Above 25% of Budgeted Outflow',
  },
];

export const healthSafetySecurityOptions = [
  {
    value: '1',
    label: '1 - No medical treatment required',
  },
  {
    value: '2',
    label: '2 - Objective but reversible disability requiring hospitalization',
  },
  {
    value: '3',
    label: '3 - Moderate irreversible disability or impairment (<30%) to one or more persons',
  },
  {
    value: '4',
    label: '4 - Single fatality and/or severe irreversible disability (>30%) of one to 10 persons',
  },
  {
    value: '5',
    label: '5 - Multiple fatalities or significant irreversible to 10 persons and more',
  },
];

export const operationalOptions = [
  {
    value: '1',
    label: '1 - Business as usual; no noticeable impact on business and operations / Process Reduction of beneficiary/client by less than 5% of target reach',
  },
  {
    value: '2',
    label: '2 - Isolated and temporary disruptions to business operations / Non-Critital Process Reduction of beneficiary/client reach by 5% - 10% of target reach',
  },
  {
    value: '3',
    label: '3 - Isolated and prolonged disruptions; affect business efficiency as well as ability to service client/partners Reduction of beneficiary/client reach by 11%-20% of target reach',
  },
  {
    value: '4',
    label: '4 - Widespread but temporary disruptions to business operations/Critical Process; very significant impact on business operations; maybe unable to service clients/Partners Reduction of beneficiary/client reach by 21%-30% of target reach',
  },
  {
    value: '5',
    label: '5 - Critical (widespread and prolonged) disruptions to critial processes. Reduction of beneficiary/client reach by more than 30% of target reach',
  },
];

export const legalComplianceOptions = [
  {
    value: '1',
    label: '1 - Minor Legal Issues; Minor Compliance Issues',
  },
  {
    value: '2',
    label: '2 - Cases or legal issues arising from day-to-day operations; Regulator action resulting to written warning',
  },
  {
    value: '3',
    label: '3 - Litigation involving temporary suspension; Criminal Prosecution involving the Board or officer, imprisonment < 30 days; Regulatory action may lead to delays in approval or issuance of permits or licenses',
  },
  {
    value: '4',
    label: '4 - Litigation involves long term suspension; Corporate reFoundation; Ciminal Prosecution involves the Board of officer; Improsonement > 30 days, not < 6 months may be imposed; Changes in laws/regulations requires substaional changes in business processes',
  },
  {
    value: '5',
    label: '5 - Lititaion involving company dissoluton or closure; Ciminal Prosection involving the Board or officer, imprisonment < 6 months may be imposed; Changes in laws/regulations that require a change in strategy',
  },
];
