import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
    color?: string;
    size?: number;
}

export const HistoryIcon: React.FC<IconProps> = ({ color = '#000', size = 24 }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
