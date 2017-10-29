import React from 'react'
import MobileDetect from 'mobile-detect'
/* TODO: Not sure if needed */
import Responsive from 'react-responsive';

export const Desktop = ({ children }) => <Responsive minWidth={992} children={children} />;
export const Tablet = ({ children }) => <Responsive minWidth={768} maxWidth={992} children={children} />;
export const Mobile = ({ children }) => <Responsive maxWidth={768} children={children} />;
export const Default = ({ children }) => <Responsive minWidth={768} children={children} />;

export const md = new MobileDetect(window.navigator.userAgent)

export const isMatchingDevice = (device) => {  
    if (typeof device === 'undefined') return true;
    device = device.toUpperCase()
    if (['ALL', 'MOBILE', 'PHONE', 'DESKTOP', 'TABLET'].indexOf(device) === -1 || device === "ALL") return true;

    var isMobile = md.mobile() !== null, 
        isPhone = md.phone() !== null, 
        isTablet = md.tablet() !== null;

    if (device === "DESKTOP" && !isMobile) return true;
    if (device === "MOBILE" && isMobile) return true;
    if (device === "TABLET" && isTablet) return true;
    if (device === "PHONE" && isPhone) return true;

    return false;
}