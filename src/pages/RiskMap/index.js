import React from 'react'
import range from 'lodash/range'

export default function RiskMap(props) {
  return (
    <table>
      <tbody>
        {range(0, 7).map(rowMapper)}
      </tbody>
    </table>
  )

  function rowMapper(row) {
    return (
      <tr key={row}>
        {range(0, 6).map(e => columnMapper(e, row))}
      </tr>
    )
  }
  
  function columnMapper(column, row) {
    if (column === 0) {
      if (row === 5) {
        return (
          <td key={`${column}`}>Likelihood</td>
        )
      } else if (row === 6) {
        return (<td key={column}>Impact</td>)
      }
      return (
        <td key={`${column}`}>{5 - row}</td>
      )
    } else if (row === 6) {
      return null
    } else if (row === 5) {
      return (
        <td key={`${column}`} rowSpan='2'>{column}</td>
      )
    } else {
      const value = (5 - row) * (column)
      return (
        <td key={`${column}`}>{value}</td>
      )
    }
  }

}
