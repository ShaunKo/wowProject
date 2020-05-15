import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
} from 'react-native';
import {
  ListItem,
  Icon,
} from 'react-native-elements';
import {
  Container,
  Header,
  Right,
  Left,
  Body,
  Title,
  Label,
} from 'native-base';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class Bell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      content: [],
      seen: false,
    };
  }

  renderSeparator = () => {//分隔線
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  componentDidMount() {
    firebase.database().ref('Notification/' + firebase.auth().currentUser.uid).orderByChild('time').on('value', (snapshot) => {
      let data = snapshot.val();
      if (data === null) { } else {
        let content = Object.values(data);
        content = content.sort(function (a, b) {
          return a.time < b.time ? 1 : -1;
        });
        this.setState({ content: content });
      }
    });
  }
  getTime = (time) => {
    let date = new Date(time).getDate();
    let hours = new Date(time).getHours();
    let minutes = new Date(time).getMinutes();
    if (minutes < 10) { // 補零
      return date + ' / ' + hours + ':' + 0 + minutes;
    } else {
      return date + ' / ' + hours + ':' + minutes;
    }
  }
  //如果沒有price則不要
  noPrice = (price) => {
    if (price === undefined) {
      return '';
    } else {
      return (
        <View style={{ flexDirection: 'row', }}>
          <View style={{ flex: 1 }}>
            <Icon
              name='monetization-on'
              color='#FFBB00'
            />
          </View>
          <View style={{ flex: 1 }}>
            <Label>{price}</Label>
          </View>
        </View>
      );
    }
  }
  leftAvatar = (avatar, seen) => {
    if (avatar === true) {
      if (seen === true) {
        return <Icon name='shopping-cart' color='black' raised reverse />
      } else {
        return <Icon name='shopping-cart' color='#FF8800' raised reverse />
      }
    } else if (avatar === 'inform') {
      if (seen === true) {
        return <Icon name='error' color='black' raised reverse />
      } else {
        return <Icon name='error' color='#FF8800' raised reverse />
      }
    } else {
      if (seen === true) {
        return <Icon name='assignment-ind' color='black' raised reverse />
      } else {
        return <Icon name='assignment-ind' color='#FF8800' raised reverse />
      }
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>通知</Title>
          </Body>
          <Right />
        </Header>

        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.content}
            renderItem={({ item }) => (
              <ListItem
                leftAvatar={
                  this.leftAvatar(item.avatar, item.seen)
                }
                onLongPress={() => {
                  Alert.alert('提醒', '是否要刪除此通知？', [
                    { text: '取消' },
                    {
                      text: '確定',
                      onPress: () => {
                        firebase.database().ref('Notification/' + firebase.auth().currentUser.uid + '/' + item.key).remove();
                      }
                    }]);
                }}
                title={item.name}
                rightTitle={this.getTime(item.time)}
                rightSubtitle={this.noPrice(item.price)}
                subtitle={item.skill}
                onPress={() => {
                  if (item.avatar === true) {
                    this.props.navigation.navigate('Valuation', {
                      city: item.city,
                      district: item.district,
                      skill: item.skill,
                      description: item.description,
                      start: item.start,
                      end: item.end,
                      bUid: item.bUid,//買方的uid
                      sUid: item.sUid,
                      key: item.key,
                      avatar: item.avatar,//true的話是購物車
                      price: item.price,
                      token: item.token,//賣方token
                      bToken: item.bToken,//買方token
                    });
                  } else if (item.avatar === 'inform') {
                    //不用跳頁(我要在這顯示賣方ㄉ單子)
                    //跳買方chat
                    console.log(item.bUid)//有錯
                    this.props.navigation.navigate('Chat', {
                      //傳入買方的uid
                      otherUserId: item.bUid,
                    });
                  } else {
                    this.props.navigation.navigate('PersonalInfo', {
                      sUid: item.sUid,
                      bUid: item.bUid,
                      skill: item.skill,
                      price: item.price1,//傳下去的是賣方搶後上傳的
                      start: item.start,
                      end: item.end,
                      city: item.city,
                      district: item.district,
                      description: item.description,
                      key: item.key,
                      token: item.token,//賣方token
                      bToken: item.bToken,//買方token
                    });
                  }
                  //按下去的時候，我要存一筆是否已讀的資料進入Notification/然後this.setState({})
                  if (item.seen === false) {
                    firebase.database().ref('Notification/' + firebase.auth().currentUser.uid + '/' + item.key).update({
                      seen: true,
                    });
                  } else { }
                }}
              />
            )}
            keyExtractor={item => item.key}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>

      </Container>
    );
  }
}

export default Bell;