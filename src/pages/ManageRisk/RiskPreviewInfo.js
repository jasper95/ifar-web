import React from 'react'
import Cell from 'react-md/lib/Grids/Cell';

function RiskPreviewInfo(props) {
  const { colspan, title, info } = props
  return (
    <Cell size={colspan}>
      <h3>{title}</h3>
      <span>{info}</span>
    </Cell>
  )
}

export default RiskPreviewInfo
