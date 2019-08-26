import { useSelector } from 'react-redux';
import businessUnits from 'lib/constants/riskManagement/businessUnits';

export default function useBusinessUnit() {
  const user = useSelector(state => state.auth);
  let result = [];
  if (user && user.role === 'ADMIN') {
    result = businessUnits;
  } else {
    result = businessUnits.filter(e => user.srmp_business_units.includes(e.id));
  }
  return result;
}
