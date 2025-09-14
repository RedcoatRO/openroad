import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

// The width and height props have been removed from the SVG to allow styling via className.
const Logo: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 180 26" xmlns="http://www.w3.org/2000/svg" {...props}>
        <text x="0" y="20" style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 'bold' }} fill="#0B5FFF">
            Open Road
            <tspan fill="#6B7280"> Leasing</tspan>
        </text>
    </svg>
);

export default Logo;
