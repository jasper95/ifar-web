import { useState } from 'react';

export default function useTableSort(initialSort = {}) {
  const [sort, setSort] = useState(initialSort);

  function onSort(sortKey) {
    const { [sortKey]: sortValue } = sort;
    if (sortValue !== undefined) {
      setSort({ ...sort, [sortKey]: Boolean(!sortValue) });
    }
  }

  return [sort, onSort];
}
