import React from 'react'
import { Button, Dropdown } from 'semantic-ui-react'

const options = (total) => {
  var r = []
  for (var i = 1; i <= total; i++) {
    r.push({ key: i, text: i, value: i })
  }
  return r
}

export const PaginatorButtons = ({ page, totalPages, handlePageChange }) => (
  <Button.Group size='tiny'>
    <Button icon='chevron left' onClick={() => { handlePageChange(page-1) }} disabled={page === 0} />
    <Dropdown button scrolling disabled={options(totalPages).length <= 1} value={page+1} text={page+1 + '/' + totalPages} options={options(totalPages)} onChange={(e, { searchQuery, value }) => { handlePageChange(value-1) } } />
    <Button icon='chevron right' onClick={() => { handlePageChange(page+1) }} disabled={page + 1 >= totalPages } />
  </Button.Group>
)
