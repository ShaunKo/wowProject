import React , {Component} from 'react';
import {
 Image,
 View,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
export default class FirstPage extends Component{
     //檢查使用者是否以登入
     componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
         if (user) {
           this.setState({ user: user })
           this.props.navigation.navigate('Index');
           console.log('有登入');
         } else {
           this.setState({ user: null })
           this.props.navigation.navigate('Login');
           console.log('沒有登入');
         }
       })
     }
     componentWillUnmount() {
          this.setState = (state, callback) => {
              return;
          };
      }
    render(){
        return(
          //   <Image
          //   style={{width: 100+"%", height: 100+"%"}}
          //   source={{uri: '/Users/shaunko/GeekTest2/src/components/presentation/1566907981162.jpg'}}
          // />
          <View></View>
        )
    }
} 