import { StyleSheet, Text } from 'react-native';
import React from 'react';

interface Props {
  title: string | undefined | number;
  style?: object;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color?: string;
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
}) => {
  return (
    <>
      <Text
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
        style={[
          styles.text,
          style,
          fontSize ? { fontSize } : null, // Kiểm tra rõ ràng về fontSize
          fontFamily ? { fontFamily } : null, // Kiểm tra rõ ràng về fontFamily
          fontWeight ? { fontWeight } : null, // Kiểm tra rõ ràng về fontWeiht
          color ? { color } : null, // Kiểm tra rõ ràng về color

        ]}
      >
        {title || ''}
      </Text>
    </>
  );
};

export default Typography;

const styles = StyleSheet.create({
  text: {
  },
});
