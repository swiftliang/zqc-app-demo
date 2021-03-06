/**
 * 在球场
 * zaiqiuchang.com
 */

import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import flattenStyle from 'flattenStyle';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {COLOR, SCREEN_WIDTH, SCREEN_HEIGHT, NAV_BAR_HEIGHT} from '../../config';

function Loading({loading, drawUnderNavBar, iconColor = COLOR.textNormal, 
  iconSize = 'small', textStyle, containerStyle}) {
  let {loadingCount, prompt, enabled} = loading;
  prompt = (prompt !== undefined ? prompt : '');
  if (!enabled || loadingCount <= 0) {
    return null;
  }

  let {width, height} = flattenStyle([styles.container, containerStyle]);
  let left = Math.floor((SCREEN_WIDTH - width) / 2);
  let top = Math.floor((SCREEN_HEIGHT - height) / 2 - (drawUnderNavBar 
    ? 0 : NAV_BAR_HEIGHT));
  return (
    <View style={[styles.container, containerStyle, {left, top}]}>
      <ActivityIndicator color={iconColor} size={iconSize} />
      {prompt ? <Text style={[styles.text, textStyle]}>{prompt}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginVertical: 10,
    fontSize: 12,
    color: COLOR.textNormal,
    backgroundColor: 'transparent',
  },
});

function mapStateToProps(state) {
  let {loading} = state;
  return {
    loading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
