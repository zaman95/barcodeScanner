// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

// import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View} from 'react-native';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

// type Props = {};
// export default class App extends Component<Props> {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>Welcome to React Native!</Text>
//         <Text style={styles.instructions}>To get started, edit App.js</Text>
//         <Text style={styles.instructions}>{instructions}</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });


import React, { Component } from 'react';
import { Button, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Barcode from 'react-native-barcode-builder';

const {height, width} = Dimensions.get('window');

class App extends Component {

  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      showCamera: false,
      showResults: false,
      scanResults: {},
      format: [
        'codabar',
        'CODE39',
        'CODE128', 'CODE128A', 'CODE128B', 'CODE128C', // Note: Using 'CODE128' will automatically detect which subtype you need and use it.
        'EAN2', 'EAN5', 'EAN8', 
        // 'EAN13',
        'UPC',
        'GenericBarcode',
        'ITF', 'ITF14',
        'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110', // Note: Using 'MSI' will automatically detect which subtype you need and use it.
        'pharmacode'
      ],
      showBarCode: false,
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
        barcodeFinderVisible: true
      }
    };
  }

  onBarCodeRead(scanResult) {
    // console.warn(scanResult.type);
    // console.warn(scanResult.data);

    let index = this.state.format.findIndex(e => e === scanResult.type.replace("_", ""));

    console.log(scanResult);
    this.setState({
      showResults: true,
      scanResults: scanResult,
      showBarCode: index >= 0 ? true : false
    });
    // if (scanResult.data != null) {
    //   if (!this.barcodeCodes.includes(scanResult.data)) {
    //     this.barcodeCodes.push(scanResult.data);
    //     console.warn('onBarCodeRead call');
    //   }
    // }
      return;
  }

  async takePicture() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  }

  pendingView() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'lightgreen',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Waiting</Text>
      </View>
    );
  }

  render() {
    if(!this.state.showCamera){
    return (
      <View style={{ margin:20, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
        <Button
          onPress={() => { this.setState({ showCamera: true, showResults: false, scanResults: {} }) }}
          style={styles.enterBarcodeManualButton}
          title="Scan BarCode"
        />
      </View>
    );
    } else {
      return (
        this.state.showResults ?
        <View style={{ flex:1, margin:20, flexDirection:'column', alignItems:'center', justifyContent:'flex-start' }}>
          <Button
            onPress={() => { this.setState({ showCamera: true, showResults: false, scanResults: {} }) }}
            style={styles.enterBarcodeManualButton}
            title="Scan Again"
          />
          <Text>{JSON.stringify(this.state.scanResults)}</Text>
          {this.state.showBarCode ?
            <View style={{ height: width, alignSelf:'flex-end', transform: [{ rotate: '90deg'}] }}>
              <Barcode 
                value={this.state.scanResults.data} 
                text={this.state.scanResults.data}
                format={this.state.scanResults.type.replace("_", "")}
                // format="EAN13"
                onError={(e)=>{console.log('error on barcode generation: ', e );}}
              />
            </View>
          : null }
        </View>
        :
        <View style={styles.container}>
          <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
              barcodeFinderWidth={280}
              barcodeFinderHeight={220}
              barcodeFinderBorderColor="white"
              barcodeFinderBorderWidth={2}
              defaultTouchToFocus
              flashMode={this.state.camera.flashMode}
              mirrorImage={false}
              onBarCodeRead={this.onBarCodeRead.bind(this)}
              onFocusChanged={() => {}}
              onZoomChanged={() => {}}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
              style={styles.preview}
              type={this.state.camera.type}
          />
          <View style={[styles.overlay, styles.topOverlay]}>
            <Text style={styles.scanScreenMessage}>Please scan the barcode.</Text>
          </View>
          {/* <View style={[styles.overlay, styles.bottomOverlay]}>
            <Button
              onPress={() => { console.log('scan clicked'); }}
              style={styles.enterBarcodeManualButton}
              title="Enter Barcode"
            />
          </View> */}
        </View>
      );
    }
  }
}

const styles = {
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default App;