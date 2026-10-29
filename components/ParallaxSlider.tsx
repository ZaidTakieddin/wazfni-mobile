import * as React from 'react';
import { Dimensions, Text, View, Image, I18nManager, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';

const onBoardingData = [
  {
    title: 'مستقبلك العقاري بأمان تام',
    subtitle: `استثمر في عقارات المستقبل مع عقاري. منصة آمنة وموثوقة تتيح لك التداول العقاري بكل سهولة، وحماية مدخراتك وبناء مستقبل مالي مستقر`,
  },
  {
    title: 'عالم العقارات في متناول يدك',
    subtitle: `استكشف عالم العقارات المتنوعة واختر ما يناسبك. منصة عقاري توفر لك كل ما تحتاجه لاتخاذ قرارات استثمارية صائبة، بدءًا من البحث عن العقارات وحتى إتمام الصفقة`,
  },
  {
    title: 'استثمر واربح مع عقاري',
    subtitle: `حقق أرباحاً مجزية على المدى الطويل من خلال استثماراتك العقارية. عقاري هي منصة الاستثمار الأمثل لنمو ثروتك وتحقيق أهدافك المالية`,
  },
  {
    title: 'شريكك الموثوق في عالم العقارات',
    subtitle: `عقاري هو شريكك الأمثل في رحلتك للإستثمار العقاري. نقدم لك الدعم والخبرات اللازمة لاتخاذ القرارات الدقيقة و الصحيحة ، ونضمن لك تجربة استثمارية سلسة وممتعة`,
  },
];

const ParallaxSlider = () => {
  const { width, height } = Dimensions.get('window');

  const progress = useSharedValue(0);
  const ref = React.useRef(null);

  const baseOptions = {
    vertical: false,
    width,
    height: height - 200,
  };

  const onPressPagination = (index: number) => {
    if (ref.current) {
      // @ts-ignore
      ref.current.scrollTo({
        // Calculate the difference between the current index and the target index
        count: index - progress.value,
        animated: true,
      });
    }

    return (
      <>
        <Carousel
          ref={ref}
          {...baseOptions}
          loop
          onProgressChange={progress}
          // Merge dynamic width with any other carousel style if needed
          style={{ width }}
          data={onBoardingData}
          renderItem={({ index, item }: { index: number; item: any }) => (
            <>
              {/* <View style={styles.imageContainer}>
              <Image resizeMode="contain" source={images.only_word} style={styles.image} />
            </View> */}
              <View style={styles.textContainer}>
                <Text style={[styles.title, { textAlign: I18nManager.isRTL ? 'left' : 'right' }]}>
                  {item.title}
                </Text>
                <Text
                  style={[styles.subtitle, { textAlign: I18nManager.isRTL ? 'left' : 'right' }]}>
                  {item.subtitle}
                </Text>
              </View>
            </>
          )}
        />
        <View
          style={[
            styles.paginationContainer,
            I18nManager.isRTL && { transform: [{ scaleX: -1 }] },
          ]}>
          <Pagination.Basic
            progress={progress}
            data={onBoardingData.map((color) => ({ color }))}
            size={20}
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
            containerStyle={styles.paginationDotContainer}
            horizontal
            onPress={onPressPagination}
          />
        </View>
      </>
    );
  };

  const styles = StyleSheet.create({
    imageContainer: {
      position: 'relative',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      zIndex: 10,
      maxWidth: 150,
    },
    textContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      paddingTop: 48, // Assuming pt-12 => 48px
      fontFamily: 'pmedium',
      fontSize: 30, // Adjust as needed for text-3xl
    },
    subtitle: {
      paddingHorizontal: 16, // Assuming px-4 => 16px
      fontFamily: 'pmedium',
      fontSize: 16, // Adjust as needed for text-md
      color: '#6b7280', // Tailwind text-gray-500 equivalent
    },
    paginationContainer: {
      position: 'absolute',
      bottom: 416, // Assuming 26rem (26 * 16) equals 416px
      left: 0,
      right: 0,
      height: 48, // h-12 => 48px
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dot: {
      backgroundColor: '#774b46',
      borderRadius: 8,
      width: 20,
      height: 20,
      overflow: 'hidden',
    },
    activeDot: {
      backgroundColor: '#d4c2b3',
      borderRadius: 8,
      width: 20,
      height: 20,
      overflow: 'hidden',
    },
    paginationDotContainer: {
      gap: 5, // If gap is not supported, consider using margin adjustments on each dot.
      marginBottom: 10,
    },
  });
};

export default ParallaxSlider;
