import React from 'react';
import {
  View,
  Platform,
  Pressable,
  ViewStyle,
  StyleProp,
  StyleSheet,
} from 'react-native';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

interface RippleButtonProps {
  children: React.ReactNode;

  enabled?: boolean;
  onPress?: () => void;
  borderless?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const RippleButton = React.forwardRef<View, RippleButtonProps>(
  ({style, onPress, children, enabled = true, borderless}, ref) => {
    const rippleSupported =
      Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

    //para fazer que o efeito funcione nesta versão do Android
    const mustUseForeground =
      Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_PIE;

    let containerStyle = StyleSheet.compose(defaultStyle.container, style);
    let touchStyle: StyleProp<ViewStyle> = defaultStyle.touchContainer;

    if (borderless) {
      containerStyle = StyleSheet.compose(
        containerStyle,
        defaultStyle.no_shadow,
      );

      touchStyle = StyleSheet.compose(
        defaultStyle.touchContainer,
        defaultStyle.borderless,
      );
    }

    return (
      <View style={containerStyle}>
        <Pressable
          ref={ref}
          style={touchStyle}
          android_ripple={{
            borderless: false,
            color: '#00000021',
            foreground: mustUseForeground,
          }}
          onPress={onPress}
          disabled={!enabled}>
          {({pressed}) => (
            <React.Fragment>
              {!rippleSupported && pressed && (
                <View style={defaultStyle.underlay} />
              )}
              {children}
            </React.Fragment>
          )}
        </Pressable>
      </View>
    );
  },
);

const defaultStyle = StyleSheet.create({
  container: {
    overflow: 'hidden',
    elevation: 6,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowColor: '#171717',
  },
  touchContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderless: {
    padding: 6,
    width: 'auto',
    height: 'auto',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 9999999,
  },
  no_shadow: {
    elevation: 0,
    shadowOpacity: 0,
  },
  underlay: {
    zIndex: 2,
    backgroundColor: '#00000021',
    ...StyleSheet.absoluteFillObject,
  },
});
