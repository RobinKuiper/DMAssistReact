import React, { Component } from 'react'

export default class Adsense extends Component {
    render() {
        return (
            <div className='ad'>
                <ins className='adsbygoogle'
                    style={this.props.style}
                    data-ad-client={this.props.client}
                    data-ad-slot={this.props.slot}
                    data-ad-format={this.props.format} />
            </div>
        )
    }

    componentDidMount(){
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
}