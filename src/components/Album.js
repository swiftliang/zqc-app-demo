/**
 * 在球场
 * zaiqiuchang.com
 */

import React, {Component} from 'react';
import {CameraRoll} from 'react-native';
import Gallery from 'react-native-gallery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {COLOR, DEFAULT_NAV_BAR_STYLE} from '../config';
import * as components from './';
import * as helpers from '../helpers';
import * as actions from '../actions';

class Album extends Component {
  static navigatorStyle = Object.assign({}, DEFAULT_NAV_BAR_STYLE, {
    navBarBackgroundColor: COLOR.backgroundDarkLighter,
    drawUnderNavBar: true,
    navBarTranslucent: true,
    navBarHideOnScroll: true,
    tabBarHidden: true,
  });

  constructor(props) {
    super(props);

    this.screenId = props.screenId || 'Album';
  }

  componentDidMount() {
    let {setScreenState, files, currentIndex} = this.props;
    setScreenState(this.screenId, {files, currentIndex});
  }
  
  componentWillUnmount() {
    let {resetScreenState} = this.props;
    resetScreenState(this.screenId);
  }

  removeImage() {
    let {screen, errorFlash, setScreenState, cbRemove} = this.props;
    let {files, currentIndex} = screen[this.screenId];

    if (files.length == 0) {
      errorFlash('图片列表为空');
      return;
    }

    let removedFile = files[currentIndex];
    files = files.filter((v, i) => i != currentIndex);
    setScreenState(this.screenId, {
      files,
      currentIndex: (currentIndex < files.length ? currentIndex : 0),
    });
    
    if (cbRemove) {
      cbRemove(removedFile);
    }
  }

  saveImage() {
    let {screen, errorFlash} = this.props;
    let {files, currentIndex} = screen[this.screenId];

    if (files.length == 0) {
      errorFlash('图片列表为空');
      return;
    }

    let currentFile = files[currentIndex];
    let uri = (currentFile.id ? currentFile.url : currentFile.path);
    CameraRoll.saveToCameraRoll(uri)
      .then(result => errorFlash('保存成功'))
      .catch(() => errorFlash('保存失败'));
  }

  render() {
    let {navigator, screen, setScreenState} = this.props;
    let {files, currentIndex, navBarHidden} = screen[this.screenId];

    navigator.toggleNavBar({'to': (navBarHidden ? 'hidden' : 'shown')});

    return (
      <components.Layout 
        screenId={this.screenId} 
        containerStyle={{backgroundColor: 'black'}}
      >
        <components.ActionSheet ref={ref => { this.actionSheet = ref; }} />
        <Gallery
          images={files.map(v => helpers.fileImageSource(v, 'huge').uri)}
          initialPage={currentIndex}
          pageMargin={5}
          onPageSelected={index => setScreenState(this.screenId, 
            {currentIndex: index})}
          onSingleTapConfirmed={() => setScreenState(this.screenId, 
            {navBarHidden: !navBarHidden})}
        />
      </components.Layout>
    );
  }
}

function mapStateToProps(state) {
  let {screen} = state;
  return {
    screen,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Album);
