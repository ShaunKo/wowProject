import React, { Component } from 'react';
import {
    Text,
    Button,
    View,
    Alert,
    FlatList,
} from 'react-native';
import {
    Container,
    Header,
    Left,
    Body,
    Title,
    Right,
    Content,
    Tabs,
    Tab,
    TabHeading,
} from 'native-base';
import {
    Icon,
    ListItem,
    Badge,
} from 'react-native-elements';
import Chat from './Chat.js';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import '@react-native-firebase/storage';
let addChat = (message) => {
    var ref = firebase.database().ref('GroupChat/').push();
    ref.set({
        _id: message._id,
        text: message.text,
        createdAt: Date.now(),
        user: message.user,
    });
}
export default class GroupChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            name: '',//抓UserName
            avatar: '',//大頭貼URL
            data: [],
            dataChat: [],
            lastTime: '',
            //blockKeys:[],
        };
    }
    componentDidMount() {
        const { state: { params: { blockKeys }, goBack } } = this.props.navigation;
    //this.setState({ blockKeys: blockKeys });
    //console.log(blockKeys);
        //GroupChat
        //抓user名
        firebase.database().ref('Personal/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) { } else {
                let name = data.name;
                this.setState({ name: name });
            }
        });
        //抓訊息//要排序//最多取50筆
        let array = [];
        var ref = firebase.database().ref('GroupChat/');
        ref.orderByChild('createdAt').limitToLast(30).on('child_added', function (snapshot) {
            // console.log(snapshot.key + " was " + snapshot.val().createdAt + " m tall");
            let data = snapshot.val();
            array.push(data);
            //console.log(array);

        });
        this.setState({ messages: array });
        //抓大頭貼
        firebase.app().storage().ref('/Avatar/' + firebase.auth().currentUser.uid).getDownloadURL().then(function (url) {
            //console.log(url)
            this.setState({ avatar: url });
        }).catch(function (error) {
            // Handle any errors
        });

        //ChatList
        //只要比對到自己的聊天室，就抓出資料然後取出最後一筆
        //如果是對方的則黑色粗體
        firebase.database().ref('Chat/').on('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) { } else {
                let keys = Object.keys(data);
                let array = [];
                //console.log(keys);
                for (i = 0; i < keys.length; i++) {
                    if (keys[i].indexOf(firebase.auth().currentUser.uid) !== -1) {
                        //只要有比對到我自己的uid，我就取出資料
                        //取出對方名跟對方id
                        var other1 = keys[i].replace(firebase.auth().currentUser.uid, '');
                        var other2 = other1.replace('_', '');
                       // console.log(other2);
                       if(blockKeys.indexOf(other2) === -1){//如果blockList陣列中沒有比對到則取出
                        firebase.database().ref('Chat/' + keys[i]).orderByChild('createdAt').limitToLast(1).on('child_added', (snapshot1) => {
                            //我要排序，然後array.push()出最後一筆資料
                            let data1 = snapshot1.val();
                            data1.uid = other2;
                            firebase.database().ref('Personal/' + other2).on('value', (snapshot2) => {
                                let data2 = snapshot2.val();
                                let otherName = data2.name;//別人的名字
                                data1.otherName = otherName;
                                //console.log(data1)
                                array.push(data1);
                                //console.log(array);
                                this.setState({ dataChat: array });

                            });
                        });
                    }
                    }
                }
            }
        });
    }
    componentWillUnmount() {
            this.setState = (state, callback) => {
                return;
            };
        }
    //GroupChat
    handleAddChat = (message) => {
        addChat(message);
    }
    onSend(messages = []) {
        //console.log(messages)
        this.setState(previousState => ({
            messages: GiftedChat.append(messages, previousState.messages),
        }))
        this.handleAddChat(messages[0]);
    }
    //ChatList
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
    getTime(str) {
        var date = new Date(str);
        let hour = date.getHours();
        let min = date.getMinutes();
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (min < 10) {
            min = '0' + min;
        }
        let time = hour + ':' + min;
        return time;
    }
    renderTime = (time) => {
        return (
            <View>
                <Text style={{ position: 'absolute', top: -20, right: 5 }}>{this.getTime(time)}</Text>
            </View>
        );
    }
    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Icon
                            name='chevron-left'
                            color='#85A5FF'
                            onPress={() => { this.props.navigation.goBack(); }} />
                    </Left>
                    <Body>
                        <Title>聊天</Title>
                    </Body>
                    <Right />
                </Header>
                <Tabs>
                    <Tab heading={<TabHeading><Icon name='group' /><Text>群聊</Text></TabHeading>}>
                        <GiftedChat
                            messages={this.state.messages}
                            onSend={messages => this.onSend(messages)}
                            user={{
                                _id: firebase.auth().currentUser.uid,
                                name: this.state.name,
                                avatar: this.state.avatar,
                            }}
                            inverted={false}
                            renderUsernameOnMessage={true}
                            onLongPress={(context, message) => {
                                //長按檢舉？刪除訊息？
                                console.log(message);
                            }}
                            scrollToBottom={true}
                            onPressAvatar={(user) => { console.log(user); }}//只會出現user內的資料
                        />
                    </Tab>
                    <Tab heading={<TabHeading><Icon name='person' /><Text>私聊</Text></TabHeading>}>
                        {/*ChatList*/}
                        <FlatList
                            data={this.state.dataChat}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                            renderItem={({ item }) => (
                                item.seen === true && item.user._id !== firebase.auth().currentUser.uid ?
                                //&& item.user._id !== firebase.auth().currentUser.uid
                                    <ListItem
                                        //leftAvatar={{}}
                                        // onLongPress={() => {
                                        //     Alert.alert('警告', '刪除該聊天室？', [{
                                        //         text: "確定", onPress: () => { this.deleteChatRoom(item.uid) }
                                        //     }, { text: "取消" }])
                                        // }}
                                        badge={{ value: '', badgeStyle:{backgroundColor:'#FF3333'}, }}
                                        onPress={() => {
                                            this.props.navigation.navigate('Chat', { otherUserId: item.uid });
                                            firebase.database().ref('Chat/' + item.chatRoom + '/' + item.key).update({
                                                seen:false,
                                            });
                                        }}
                                        title={item.otherName}//對方的名字
                                        rightTitle={this.renderTime(item.createdAt)}
                                        subtitle={item.text}
                                    />
                                    :
                                    <ListItem
                                        //leftAvatar={{}}
                                        // onLongPress={() => {
                                        //     Alert.alert('警告', '刪除該聊天室？', [{
                                        //         text: "確定", onPress: () => { this.deleteChatRoom(item.uid) }
                                        //     }, { text: "取消" }])
                                        // }}
                                        onPress={() => { this.props.navigation.navigate('Chat', { otherUserId: item.uid }) }}//這裡有錯
                                        title={item.otherName}
                                        rightTitle={this.renderTime(item.createdAt)}
                                        subtitle={item.text}
                                    />
                            )}
                            keyExtractor={item => item._id}
                            ItemSeparatorComponent={this.renderSeparator}
                            ListHeaderComponent={this.renderHeader}
                        />
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}