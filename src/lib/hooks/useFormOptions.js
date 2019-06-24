import { useEffect } from 'react';

export default function useFormOptions({ dispatch, options, optionKeys = [] }) {
  // useEffect(() => {
  //   optionKeys.forEach(({ key, payload = {} }) => {
  //     if (!options[key] || !options[key].length || options.forceFetch.includes(key)) {
  //       switch (key) {
  //         case 'jobCategories':
  //           dispatch(GetJobCategoryOptions(payload));
  //           break;
  //         default:
  //       }
  //     }
  //   });
  // }, []);
}
