import React from 'react'

function RiskInfo(props) {
  const { title, list } = props
  return (
    <>
      <h3>{title}</h3>
      <ul>
        {list.map(e => (
          <li key={e.id}>{e.name}</li>
        ))}
      </ul>
    </>
  )
}

export default RiskInfo;