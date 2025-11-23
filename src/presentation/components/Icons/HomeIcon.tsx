import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
    color?: string;
    size?: number;
}

export const HomeIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M3 9.5L12 2.5L21 9.5V20.5C21 21.0523 20.5523 21.5 20 21.5H15V14.5H9V21.5H4C3.44772 21.5 3 21.0523 3 20.5V9.5Z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
