import React from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from '../../../assets/constants/ResponsiveScreen';
import {COLORS, FONTS} from '../../../assets/theme';
import {ICONS} from '../../../assets/theme';
import {GeneralButton} from '../..';

const RefreshScreen = ({refresh = () => {}, style}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.containerContent}>
        <View style={styles.imgContainer}>
          <ICONS.IconConnectionError />
        </View>
        <Text style={styles.titleError}>Koneksi Error</Text>
        <Text style={styles.subtitleError}>Mohon Cek Koneksi Anda!</Text>
        <GeneralButton onPress={() => refresh()} mode="contained">
          Coba Lagi
        </GeneralButton>
      </View>
    </View>
  );
};

export default RefreshScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // zIndex: 4,
    marginTop: '30%',
  },
  containerContent: {
    backgroundColor: COLORS.WHITE,
    width: widthPercentageToDP('90%'),
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    elevation: 20,
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleError: {
    fontSize: FONTS.v15,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: COLORS.DARK,
    marginTop: 10,
    textAlign: 'center',
  },
  subtitleError: {
    fontSize: FONTS.v13,
    color: COLORS.DARK,
    marginBottom: 10,
    textAlign: 'center',
  },
});
