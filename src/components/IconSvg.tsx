import React from 'react';
import { SvgXml } from 'react-native-svg';

type IconSvgProps = {
  xml: string;
  width?: number;
  height?: number;
  color?: string;
};

const IconSvg: React.FC<IconSvgProps> = ({ xml, width = 24, height = 24, color }) => {
  let svg = xml.replace('{width}', String(width)).replace('{height}', String(height));
  if (color) {
    // Thay thế tất cả fill="#..." thành fill="{color}" hoặc fill="color"
    svg = svg.replace(/fill="#[0-9a-fA-F]{3,6}"/g, `fill="${color}"`);
    svg = svg.replace('{color}', color);
  }
  return <SvgXml xml={svg} width={width} height={height} />;
};

export default IconSvg;