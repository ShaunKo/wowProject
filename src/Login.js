import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, Alert } from "react-native";
//import RadioGroup from "./RadioGroup.js";
import {
    Container,
    Header,
    Right,
    Left,
    Body,
    Title,
    Item,
    Input,
    InputGroup,
    Form,
    Label,
} from 'native-base';
import { Icon } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import '@react-native-firebase/auth';
import '@react-native-firebase/messaging';

//1. 記得update token 

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            message: '',
            codeInput: '',
            phoneNumber: '',
            confirmResult1: null,
            token:'',
            //apiData:[],
        };
    }

    //push notification===========================
    getToken = async () => {
        fcmToken = await firebase.messaging().getToken();
        this.setState({ token: fcmToken });
        //console.log(fcmToken);
    };
    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            this.getToken();
        } catch (error) {
            //console.log('permission rejected', error);
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
    componentDidMount(){
        this.checkPermission();
    }
    //======================================
    componentWillUnmount() {
            this.setState = (state, callback) => {
                return;
            };
    }
    signIn = () => {
        const { phoneNumber } = this.state;
        this.setState({ message: '正在寄出驗證碼' });
        phoneNumber.replace('0', '');
        firebase.auth().signInWithPhoneNumber('+886' + phoneNumber)
            .then(confirmResult1 => this.setState({ confirmResult1, message: '驗證碼已寄出' }))
            .catch(error => {
                this.setState({ message: '驗證碼寄送失敗' });
                console.log(error);
        });
    };
    checkPassworrd(password) {
        firebase.database().ref('Personal/').once('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) { } else {
                let content = Object.values(data);
                let hasPassword = content.some(function (item, index, array) {
                    return item.password === password;
                });
                if (hasPassword) {
                    this.signIn();
                } else {
                    Alert.alert('警告', '密碼不正確', [{ text: '確定' }]);
                }
            }
        });
    }
    confirmCode = () => {
        const { codeInput, confirmResult1 } = this.state;

        if (confirmResult1 && codeInput.length) {
            confirmResult1.confirm(codeInput)
                .then((user) => {
                    this.setState({ message: '確認！' });
                    //更新token
                    firebase.database().ref('Personal/'+ firebase.auth().currentUser.uid).update({
                        token: this.state.token,
                    });
                })
                .catch(error => this.setState({ message: `驗證碼輸入錯誤` }));
        }
    };
    renderPhoneNumberInput() {
        const { phoneNumber, password } = this.state;
        return (
            <Container style={{ backgroundColor: 'white' }}>
                <Header>
                    <Left />
                    <Body>
                        <Title>登入</Title>
                    </Body>
                    <Right />
                </Header>

                <Text style={{ color: 'black', fontSize: 20, alignSelf: 'center', marginTop: 10 }}>密碼</Text>
                <TextInput style={{ height: 40, borderColor: 'black', borderBottomWidth: 2, color: 'black', borderBottomColor: '#85A5FF', fontSize: 20, width: 80 + "%", alignSelf: "center" }}
                    clearTextOnFocus={true}
                    clearButtonMode='always'
                    onChangeText={(password) => this.setState({ password })}
                    value={password}
                    autoCapitalize='none'
                />

                <Text style={{ color: 'black', fontSize: 20, alignSelf: 'center', marginTop: 10 }}>手機號碼</Text>
                <TextInput style={{ height: 40, borderColor: 'black', borderBottomWidth: 2, color: 'black', borderBottomColor: '#85A5FF', fontSize: 20, width: 80 + "%", alignSelf: "center" }}
                    clearTextOnFocus={true}
                    clearButtonMode='always'
                    onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                    value={phoneNumber}
                    autoCapitalize='none'
                    keyboardType='numeric'
                />

                <TouchableOpacity
                    style={{ paddingTop: 20 }}
                    onPress={() => {
                        //this.signIn();
                        this.checkPassworrd(this.state.password);
                    }}>
                    <View style={{
                        width: 60 + '%',
                        height: 50,
                        borderRadius: 10,
                        justifyContent: 'center',
                        backgroundColor: '#85A5FF',
                        alignItems: 'center',
                        alignSelf: 'center',
                    }}>
                        <Text style={{ fontSize: 20, color: 'white' }}>登入</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ paddingTop: 20 }}
                    onPress={() =>
                        this.props.navigation.navigate('Enroll')
                    }>
                    <View style={{
                        width: 60 + "%",
                        height: 50,
                        borderRadius: 10,
                        justifyContent: 'center',
                        backgroundColor: '#85A5FF',
                        alignItems: 'center',
                        alignSelf: 'center'
                    }}>
                        <Text style={{ fontSize: 20, color: 'white' }}>註冊</Text>
                    </View>
                </TouchableOpacity>

            </Container>


        );
    }


    renderMessage() {
        const { message } = this.state;

        if (!message.length) return null;
        return (
            <Text style={{ paddingBottom: 20, color: '#000' }}>{message}</Text>
        );
    }
    renderVerificationCodeInput() {
        const { codeInput } = this.state;
        return (
            <Container>
                <Header>
                    <Left>
                        <Icon
                            name='chevron-left'
                            color='#85A5FF'
                            onPress={() => {
                                this.props.navigation.goBack();
                            }} />
                    </Left>
                    <Body>
                        <Title>登入</Title>
                    </Body>
                    <Right />
                </Header>
                <Form style={styles.form}>
                    <Item floatingLabel>
                        <Label>手機驗證碼</Label>
                        <Input
                            placeholder='請輸入您的手機驗證碼'
                            onChangeText={value => this.setState({ codeInput: value })}
                            keyboardType='numeric'
                            value={codeInput}
                            style={styles.inputStyle}
                        />
                    </Item>
                </Form>
                <Button title='確認手機驗證碼' color='#85A5FF' onPress={() => {
                    this.confirmCode();
                }} />

            </Container>
        );
    }

    render() {

        const { user, confirmResult1 } = this.state;
        return (
            <View style={{ flex: 1 }}>

                {!user && !confirmResult1 && this.renderPhoneNumberInput()}

                {this.renderMessage()}

                {!user && confirmResult1 && this.renderVerificationCodeInput()}

                {user && this.props.navigation.navigate('Index')}

            </View>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 10
    },
    container1: {
        flex: 5,
        justifyContent: 'space-between',
    },
    subtitle: {
        color: 'black',
        fontSize: 20,
        alignSelf: 'center',
        paddingTop: 20,
    },
});