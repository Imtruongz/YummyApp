import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { FONTS, FONT_SIZES, TYPOGRAPHY_PRESETS, APP_TYPOGRAPHY } from '@/utils';

interface Props {
  title: string | undefined | number;
  style?: object;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  
  // Enhanced props following industry standards
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color?: string;
  
  // New preset-based props (following Material Design + iOS patterns)
  preset?: keyof typeof TYPOGRAPHY_PRESETS;
  appStyle?: keyof typeof APP_TYPOGRAPHY;
  
  // Enhanced typography props
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
}

const Typography: React.FC<Props> = ({
  title,
  style,
  ellipsizeMode,
  numberOfLines,
  fontSize,
  fontFamily,
  fontWeight,
  color,
  preset,
  appStyle,
  textAlign,
  lineHeight,
}) => {
  // Get preset styles (following big tech patterns)
  const presetStyle = preset ? TYPOGRAPHY_PRESETS[preset] : {};
  const appStylePreset = appStyle ? APP_TYPOGRAPHY[appStyle] : {};
  
  // Combine styles with priority: appStyle > preset > individual props > default
  const combinedStyle = {
    ...presetStyle,
    ...appStylePreset,
    ...(fontSize && { fontSize }),
    ...(fontFamily && { fontFamily }),
    ...(fontWeight && { fontWeight }),
    ...(color && { color }),
    ...(textAlign && { textAlign }),
    ...(lineHeight && { lineHeight }),
  };

  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[
        styles.text,
        combinedStyle,
        style, // Custom style has highest priority
      ]}
    >
      {title || ''}
    </Text>
  );
};

export { Typography };
export default Typography;

const styles = StyleSheet.create({
  text: {
    // Default to Poppins Regular (matching industry standards)
    fontFamily: FONTS.WEIGHTS.REGULAR,
    fontSize: FONT_SIZES.BODY, // 16px - optimal for mobile reading
    color: '#000000', // Default text color
    textAlign: 'left',
    includeFontPadding: false, // Android optimization
  },
});
