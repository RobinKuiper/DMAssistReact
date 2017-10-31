import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export default class Table_ extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sortBy: props.sortBy
    }
  }

  render() {
    return (
      <Table color={this.props.color} selectable sortable unstackable>
        <Table.Header>
          <Table.Row>
            { this.props.headerCells.map((cell, i) => (
              <Table.HeaderCell key={i} colSpan={cell.colSpan} sorted={this.state.sortBy === cell.sortName ? this.state.sortOrder : null} onClick={() => { this.changeSortBy(cell.sortName) }}>
                {cell.content}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          { this.props.bodyRows.length > 0 ?
              this.props.bodyRows.map(row => (
                <Table.Row key={row.key}>
                  { row.cells.map((cell, i) => (
                    <Table.Cell key={i}>{cell.content}</Table.Cell>
                  ))}
                </Table.Row>
              ))
            : (
              <Table.Row>
                <Table.Cell colSpan={5}>No monsters found.</Table.Cell>
              </Table.Row>
            )
          }
        </Table.Body>

        { this.props.footerCells && (
          <Table.Footer>
            <Table.Row>
              { this.props.footerCells.map((cell, i) => (
                <Table.HeaderCell colSpan={cell.colSpan} key={i}>
                  {cell.content}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Footer>
        )}

      </Table>
    )
  }
}

Table_.defaultProps = {
  color: 'black'
}
