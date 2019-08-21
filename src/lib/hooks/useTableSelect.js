import { useState } from 'react';

export default function useTableSelect(rows) {
  const [selected, setSelected] = useState([]);
  function onRowToggle(idx, checked) {
    if (idx === 0) {
      setSelected(checked ? rows.map(e => e.id) : []);
    } else {
      const { id } = rows[idx - 1];
      setSelected(checked ? [...selected, id] : selected.filter(e => e !== id));
    }
  }

  return [selected, { onRowToggle, setSelected }];
}
