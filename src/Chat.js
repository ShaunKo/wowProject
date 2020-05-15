import { GiftedChat } from 'react-native-gifted-chat';
import React, { Component } from 'react';
import {
  Alert,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Title,
  Right,
} from 'native-base';
import {
  Icon,
} from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import '@react-native-firebase/functions';
//首先建立
let addChat = (message, otherUserId, token,seen) => {
  //聊天室建立//user1是別人
  var ref = firebase.database().ref('Chat/' + firebase.auth().currentUser.uid + '_' + otherUserId).push();
  var key = ref.key;
  ref.set({
    _id: message._id,
    text: message.text,
    createdAt: Date.now(),
    token: token,//對方ㄉtoken
    user: message.user,
    seen: seen,
    chatRoom:firebase.auth().currentUser.uid + '_' + otherUserId,
    key:key,
  });
}
let alreadyAddChat = (message, chatRoom, token,seen) => {
  var ref = firebase.database().ref('Chat/' + chatRoom).push();
  var key = ref.key;
  ref.set({
    seen: true,
    _id: message._id,
    text: message.text,
    createdAt: Date.now(),
    token: token,
    user: message.user,
    seen: seen,
    chatRoom:chatRoom,
    key:key,
  });
}
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isLoadingEarlier: false,
      name: '',
      otherUserId: '',//上頁傳來的別人的uid
      titleName: '',
      token: '',//對方的token
    };
  }

  addChat = (message, token) => {
    addChat(
      message,
      this.state.otherUserId,
      token,
      true,
    );
  }
  alreadyAddChat = (message, chatRoom, token) => {
    alreadyAddChat(
      message,
      chatRoom,
      token,
      true,
    );
  }
  componentDidMount() {
    const { state: { params: { otherUserId }, goBack } } = this.props.navigation;
    this.setState({ otherUserId: otherUserId });
    //抓user名
    firebase.database().ref('Personal/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let data = snapshot.val();
      if (data === null) { } else {
        let name = data.name;
        this.setState({ name: name });
      }
    });
    //我要抓對方名稱及對方的token
    firebase.database().ref('Personal/' + otherUserId).once('value', (snapshot) => {
      let data = snapshot.val();
      let titleName = data.name;
      let token = data.token;
      //console.log(titleName)
      this.setState({ titleName: titleName, token: token });
    });
    //抓訊息
    //這邊要先抓到聊天室名稱
    firebase.database().ref('Chat/').on('value', (snapshot1) => {
      let data1 = snapshot1.val();
      if (data1 === null) { } else {
        let keys = Object.keys(data1);
        if (keys.indexOf(firebase.auth().currentUser.uid + '_' + otherUserId) !== -1) {
          var ref = firebase.database().ref('Chat/' + firebase.auth().currentUser.uid + '_' + otherUserId);
          let array = [];
          ref.orderByChild('createdAt').on('child_added', function (snapshot) {
            let data = snapshot.val();
            array.push(data);
          });
          this.setState({ messages: array });
        } else if (keys.indexOf(otherUserId + '_' + firebase.auth().currentUser.uid) !== -1) {
          var ref = firebase.database().ref('Chat/' + otherUserId + '_' + firebase.auth().currentUser.uid);
          let array = [];
          ref.orderByChild('createdAt').on('child_added', function (snapshot) {
            let data = snapshot.val();
            array.push(data);
          });
          this.setState({ messages: array });
        }
      }
    });
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  handleBlock = () => {
    var blockUser = firebase.functions().httpsCallable('blockUser');
    blockUser({ blockId: this.state.otherUserId , name: this.state.titleName});
  }
  handleAddChat = (messages) => {
    firebase.database().ref('Chat/').once('value', (snapshot) => {
      let data = snapshot.val();
      if (data === null) {
        this.addChat(messages, this.state.token);
      } else {
        let keys = Object.keys(data);
        if (keys.indexOf(firebase.auth().currentUser.uid + '_' + this.state.otherUserId) !== -1) {//如果有比對到且要對方的uid
          this.alreadyAddChat(messages, keys[keys.indexOf(firebase.auth().currentUser.uid + '_' + this.state.otherUserId)], this.state.token);
        } else if (keys.indexOf(this.state.otherUserId + '_' + firebase.auth().currentUser.uid) !== -1) {
          this.alreadyAddChat(messages, keys[keys.indexOf(this.state.otherUserId + '_' + firebase.auth().currentUser.uid)], this.state.token);
        } else {
          this.addChat(messages, this.state.token);
        }
      }
    });
  }

  onSend(messages = []) {
    //第一次加
    //this.addChat(messages[0])//別人
    //如果已經有
    this.setState(previousState => ({
      messages: GiftedChat.append(messages, previousState.messages),
    }));
    this.handleAddChat(messages[0]);
  }
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Icon
              name='chevron-left'
              color='#85A5FF'
              onPress={() => { this.props.navigation.goBack(); }}
            />
          </Left>
          <Body>
            <Title>{this.state.titleName}</Title>
          </Body>
          <Right>
            <Icon
              name='not-interested'
              color='#85A5FF'
              onPress={() => {
                //傳送資料到Block
                Alert.alert(
                  '提醒', '確定要封鎖此使用者？',
                  [{ text: '取消' }, {
                    text: ' 確定', onPress: () => { 
                      var blockUser = firebase.functions().httpsCallable('blockUser');
                      blockUser({ blockId: this.state.otherUserId , name: this.state.titleName}); }
                  }]);
              }}
            />
          </Right>
        </Header>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => {
            this.onSend(messages);
          }}
          scrollToBottom
          user={{
            _id: firebase.auth().currentUser.uid,//我
            name: this.state.name,
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          }}
          onLongPress={(context, message) => {
            //刪訊息
            console.log(message);
          }}
          inverted={false}
        />
      </Container>
    )
  }
}