import React, { Component } from "react";
import {
    View, Button, Image, Animated, Alert, StyleSheet, Text
} from 'react-native';
import {
    Container, Header, Left, Right, Body, Title
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    Icon, Badge, withBadge,
} from 'react-native-elements';

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/messaging';
//不用ㄌ
//先加入token至personal，以便訊息要送出時取得
let addToken = (item1) => {
    firebase.database().ref("Personal/" + firebase.auth().currentUser.uid).update({
        token: item1
    })
}
let clearCount = (item1) => {
    firebase.database().ref("Personal/" + firebase.auth().currentUser.uid+"/BFC").update({
        count: item1
    })
}
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(1)
        this.springValue1 = new Animated.Value(1)
       this.state={
        name: '',
        email: '',
        selected: '',
        checked: true,
        collection:0,
        phoneNumber:'',
        alreadyHasUid:false,
        count:0,//badge的
       };
    }

    handleToken = (token) => {
        addToken(
            token
        )
    }

    handleCount = (clear) =>{
        clearCount(
            clear
        );
    }

   
    async componentDidMount(){
        await firebase.messaging().registerForRemoteNotifications();
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    firebase.messaging().getToken().then(token => {
                        console.log('LOG: ', token);
                        this.handleToken(token);
                    });

                } else {
                    this.handleToken('N');
                    firebase.messaging().requestPermission()
                        .then(() => {
                            //console.log('user has permission');
                        })
                        .catch(error => {
                            //alert("Error", error)
                            //console.log('error');
                            // User has rejected permissions  
                        });
                }
            });
            firebase.database().ref('Personal/'+firebase.auth().currentUser.uid+"/BFC").on('value',(snapshot)=>{
            let data = snapshot.val()
            if(data===null){}else{
            let count = data.count
            console.log(count)
            this.setState({count:count})
            }
        })
    }
    
    logout = () => {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            console.log('User Logged Out!');
        }).catch(function (error) {
            // An error happened.
            console.log(error);
        });
    }


    spring() {
        this.springValue.setValue(0.3)
        Animated.spring(
            this.springValue,
            {
                toValue: 1,
                friction: 1
            }
        ).start(),
            this.props.navigation.navigate('Index')
    }

    spring1() {
        this.springValue1.setValue(0.3)
        Animated.spring(
            this.springValue1,
            {
                toValue: 1,
                friction: 1
            }
        ).start(),
            this.props.navigation.navigate('MessageBoard');
    }


    render() {

        return (
            <Container>
                <Header>
                    <Left>
                        <Icon
                            name="exit-to-app"
                            color="#ffa042"
                            onPress={() => {
                                Alert.alert("警告",
                                    "是否確定要登出？",
                                    [{ text: "取消" },
                                    {
                                        text: "確定",
                                        onPress: () => {
                                            this.logout();
                                            this.props.navigation.navigate('Home');
                                        }
                                    }])
                            }}
                        />
                    </Left>
                    <Left />

                    <Body>
                        <Title>WoW</Title>
                    </Body>
                    
                        {this.state.count === 0 ?
                        <Right>
                        <Icon 
                        name="notifications-active"
                        color="#ffa042"
                        onPress={()=>{this.props.navigation.navigate("Card")}}
                    />
                    </Right>
                    :
                    <Right>
                        <Icon 
                            name="notifications-active"
                            color="#ffa042"
                            onPress={()=>{
                                this.props.navigation.navigate("Card")
                                this.handleCount(0)
                            }}
                        />
                        <Badge
                            status="success"
                            value={this.state.count}
                            containerStyle={{ position: 'absolute', top: -8, right: -20 }}>
                        </Badge>
                        </Right>
                        }
                    
                    <Right>


                        <Icon
                            name="chat"
                            color="#ffa042"
                            containerStyle={{ position: 'absolute', top: -10, right: 13 }}
                            onPress={() => {
                                this.props.navigation.navigate("ChatList")
                            }}
                        />
                        {/* <Badge
                            status="success"

                            value="99+"
                            containerStyle={{ position: 'absolute', top: -17, right: -10 }}>
                        </Badge> */}

                    </Right>
                </Header>

                <View style={{ flex: 1, backgroundColor: '#FFFAFA' }}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            //style={{flex:1}}
                            onPress={
                                this.spring.bind(this)
                            }>
                            <Animated.Image
                                style={{ marginTop: 5 + "%", borderRadius: 20, width: 90 + "%", height: 90 + "%", transform: [{ scale: this.springValue }], alignSelf: "center" }}
                                source={require('./1569062106496.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            //style={{flex:1}}
                            onPress={this.spring1.bind(this)}>
                            <Animated.Image
                                style={{ marginBottom: 5 + "%", borderRadius: 20, width: 90 + "%", height: 90 + "%", transform: [{ scale: this.springValue1 }], alignSelf: "center" }}
                                source={require('./wow_btn1.png')}
                            />
                        </TouchableOpacity>
                        
                        
                    </View>
                    <View style={{flex:0.5,alignSelf:'center'}}>
                        <TouchableOpacity
                            style={{borderRadius:50,width:60,height:60}}
                            onPress={() => { this.props.navigation.navigate('Speed') }}>
                            <Image
                                style={{ marginBottom: 5 + "%", borderRadius: 20, width: 100 + '%', height: 100 + '%', transform: [{ scale: 1 }], alignSelf: "center" }}
                                source={require('./randomBtn.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

            </Container>
        )
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});