import React, { Component } from 'react';
import { View, Button, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Container, Header, Right, Left, Body, Title, Item, Input, 
} from 'native-base';
import {
  Icon,
} from 'react-native-elements';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

//不用ㄌ
let addItem = (item1, item2, item3, item4, item5, item6,item7,item8,item9,item10) => {
  //email跟password不需要存入
  firebase.database().ref('/Personal/' + firebase.auth().currentUser.uid).set({
    //uid:firebase.auth().currentUser.uid,
    name: item1,
    gender: item2,
    phoneNumber: item3,
    email: item4,
    uid: item5,
    collection: item6,
    avatarUrl:item7,
    BFC:{
      count:item8,
    },
    score:item9,
    password:item10,
  });
};

export default class EnrollPhone extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '',
      confirmResult: null,
      name: '',
      email: '',
      selected: '',
      checked: true,
      collection: 0,
      checkuser: false,
      avatarUrl:'./avatar.png',
      password:'',
    };
  }

  checkUser = (phoneNumber) => {
    firebase.database().ref('Personal/').once('value', (snapshot) => {
      let data = snapshot.val();
      if (data === null){
        this.signIn();
      } else {
      let content = Object.values(data);
      //console.log(content);
      let content1 = content.some(function (item, index, array) {
        return item.phoneNumber === phoneNumber;
      });
      if (content1 === false) {
        this.signIn();
      } else {
        Alert.alert('警告', '此號碼已被使用');
      }
    }
    });
  }

  componentDidMount() {
    const { state: { params: { name, email, selected, checked , password }, goBack } } = this.props.navigation;
    this.setState({ name: name, email: email, selected: selected, checked: checked,password:password })
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      }
    });
  }


  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({ message: '寄送驗證碼' });

    phoneNumber.replace('0', '')
    firebase.auth().signInWithPhoneNumber('+886' + phoneNumber)
      .then(confirmResult => this.setState({ confirmResult, message: '驗證碼已寄出!' }))
      .catch(error => this.setState({ message: '錯誤' }));

  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;
    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: '確認' });
        })
        .catch(error => this.setState({ message: '驗證碼輸入錯誤' }));
    }
  };


  handleSubmit = (a) => {
    addItem(
      '@' + this.state.name,
      this.state.selected,
      this.state.phoneNumber,
      this.state.email,
      a,
      //firebase.auth().currentUser.uid,
      this.state.collection,
      this.state.avatarUrl,
      0,
      3,
      this.state.password,
    );
  }



  renderPhoneNumberInput() {
    const { phoneNumber } = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <Icon
              name="chevron-left"
              color="#ffa042"
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          </Left>
          <Body>
            <Title>註冊</Title>
          </Body>
          <Right>
            <Button
              title="確認"
              onPress={() => {
                this.checkUser(phoneNumber)
              }}
            />
          </Right>
        </Header>
        <ScrollView>



          <Text style={styles.title}>手機號碼</Text>
          <Item>
            <Input
              placeholder="請輸入您的手機號碼"
              //onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
              onChangeText={value => this.setState({ phoneNumber: value })}
              keyboardType="numeric"
              //value={this.phoneNumber}
              value={phoneNumber}
              style={styles.inputStyle}
            />
          </Item>
        </ScrollView>
      </Container>
    );
  }

  renderMessage() {
    const { message } = this.state;
    if (!message.length) {return null; } 
    return (
      <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;
    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Code ... '}
          value={codeInput}
        />
        <Button title="確認手機驗證碼" color="#841584" onPress={
          this.confirmCode
        } />
      </View>
    );
  }

  render() {
    const { user, confirmResult } = this.state;
    return (
      <View style={{ flex: 1 }}>

        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {user && this.props.navigation.navigate('HomePage') && this.handleSubmit(firebase.auth().currentUser.uid)}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  title: {
    marginLeft: 10,
    fontSize: 18,
    //paddingTop:5
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 5,
  },
  inputStyle: {
    borderBottomColor: '#FFDD55',
    borderBottomWidth: 1,
  },
});
