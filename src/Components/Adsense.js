import React, { Component } from 'react'

export default class Adsense extends Component {
    render() {
        return (
            <div className='ad'>
                <ins className='adsbygoogle'
                    style={this.props.style}
                    data-ad-client='ca-pub-6223338907094283'
                    data-ad-slot={this.props.slot}
                    data-ad-format={this.props.format} />
            </div>
        )
    }

    componentDidMount(){
        (window.adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-6223338907094283",
            enable_page_level_ads: true
        });
    }
}