import React from 'react'
import { Image } from 'semantic-ui-react'

const Affiliate = ({title, alt, url, image}) => (
    <a href={url} title={title} target='_blank'>
        <Image src={image} alt={alt || title} />
    </a>
)

export default Affiliate