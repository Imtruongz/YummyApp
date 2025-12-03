import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity, Text, ViewStyle, ImageStyle, TextStyle,} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '@/utils';

const { width } = Dimensions.get('window');

interface BannerItem {
  id: string;
  image: string;
  title?: string;
  description?: string;
  link?: string;
}

interface BannerSliderProps {
  data: BannerItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  dotColor?: string;
  activeDotColor?: string;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  textOverlay?: boolean;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  onBannerPress?: (item: BannerItem) => void;
  dotsPosition?: 'inside' | 'outside'; // Vị trí của dots: inside (trong banner) hoặc outside (ngoài banner)
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  data,
  autoPlay = true,
  autoPlayInterval = 3000,
  dotColor = colors.smallText,
  activeDotColor = colors.primary,
  containerStyle,
  imageStyle,
  textOverlay = true,
  titleStyle,
  descriptionStyle,
  onBannerPress,
  dotsPosition = 'outside', // Mặc định đặt dots bên ngoài banner
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList | null>(null);

  // Xử lý tự động chuyển banner
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay && data.length > 1) {
      interval = setInterval(() => {
        if (activeIndex === data.length - 1) {
          flatListRef.current?.scrollToIndex({
            index: 0,
            animated: true,
          });
        } else {
          flatListRef.current?.scrollToIndex({
            index: activeIndex + 1,
            animated: true,
          });
        }
      }, autoPlayInterval);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeIndex, autoPlay, autoPlayInterval, data.length]);

  // Xử lý khi scroll thay đổi
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  // Render dot indicators
  const renderDotIndicators = () => {
    return (
      <View style={[
        styles.dotContainer,
        dotsPosition === 'inside' ? styles.dotsInside : styles.dotsOutside
      ]}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[ styles.dot,
              {
                backgroundColor: activeIndex === index ? activeDotColor : dotColor,
                width: activeIndex === index ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  // Render banner item
  const renderItem = ({ item }: { item: BannerItem }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.bannerContainer, containerStyle]}
        onPress={() => onBannerPress && onBannerPress(item)}>
        <Image
          source={{ uri: item.image }}
          style={[styles.bannerImage, imageStyle]}
          resizeMode="cover"
        />
        
        {textOverlay && (item.title || item.description) && (
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.8)']}
            style={styles.textOverlay}
          >
            {item.title && (
              <Text style={[styles.title, titleStyle]}>{item.title}</Text>
            )}
            {item.description && (
              <Text style={[styles.description, descriptionStyle]}>
                {item.description}
              </Text>
            )}
          </LinearGradient>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={{ position: 'relative' }}>
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
        {data.length > 1 && dotsPosition === 'inside' && renderDotIndicators()}
      </View>
      {data.length > 1 && dotsPosition === 'outside' && renderDotIndicators()}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 0,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsInside: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  dotsOutside: {
    marginTop: 8,
    marginBottom: 5,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%', // Gradient sẽ chiếm 50% chiều cao ảnh, từ dưới lên
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'flex-end', // Đẩy text xuống dưới cùng
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    marginHorizontal: 10,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
    marginHorizontal: 10,
  },
});

export { BannerSlider };
export default BannerSlider;