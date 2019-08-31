import { useState } from 'react';

export default function useTableSort({ initialSorted, sortable = [] }) {
  const [sort, setSort] = useState(initialSorted ? { [initialSorted]: true } : {});

  function onSort(sortKey) {
    const { [sortKey]: sortValue } = sort;
    if (sortable.includes(sortKey)) {
      setSort({ [sortKey]: Boolean(!sortValue) });
    }
  }

  return [sort, onSort];
}
