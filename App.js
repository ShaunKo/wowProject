import 'react-native-gesture-handler';
import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/messaging';
import NavigationList from './src/NavigationList.js';
import Personal from './src/Personal.js';
import Test from './src/Test.js';
import GroupChat from './src/GroupChat.js';
import Work from './src/Work.js';

class App extends Component{
  //似乎可以不用抓
  getToken = async () => {
      fcmToken = await firebase.messaging().getToken();
      console.log(fcmToken)
      
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
      
    } catch (error) {
      console.log('permission rejected',error);
      
    }
  };

  checkPermission = async () => {
    const isRegisteredForRemoteNotifications = firebase.messaging().isRegisteredForRemoteNotifications;
    //await firebase.messaging().requestPermission();
    const enabled = await firebase.messaging().hasPermission();
    if (enabled && isRegisteredForRemoteNotifications) {
      this.getToken();
      
    } else {
      this.requestPermission();
      
    }
  };
 

 componentDidMount () {
  this.checkPermission();
  }
render(){
  return (
    <NavigationList />
  );
}
}



export default App;
