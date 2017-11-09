import React, { Component } from 'react'

import { Segment } from 'semantic-ui-react'

export default class Panel extends Component {
  constructor(props){
    super(props)

    this.state = { display: 'block' }
  }

  render() {
    var style = this.props.closeable ? {cursor: 'pointer'} : {}

    return (
      <Segment.Group raised>
        <Segment id="panelHeader" className='header' textAlign='center' inverted clearing style={style} onClick={this.toggleContent}>{this.props.title}</Segment>

        <Segment className='panel content' loading={this.props.loading} style={{display: this.state.display}}>
          <this.props.content />
        </Segment>

        { this.props.footer &&
          <Segment className='panel bottom' clearing loading={this.props.loading}>
            {<this.props.footer />}
          </Segment>
        }
      </Segment.Group>
    )
  }

  toggleContent = () => {
    if(this.props.closeable){
      this.setState({
        display: this.state.display === 'none' ? 'block' : 'none'
      })
    }
  }
}

Panel.defaultProps = {
  loaded: true,
  title: '',
  closeable: false
};