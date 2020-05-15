import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Modal,
    TouchableOpacity,
    Button,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';
import {
    Icon,
    Avatar,
    ListItem,
} from 'react-native-elements';
import {
    Container,
    Header,
    Right,
    Body,
    Left,
    Title,
    Content,
    Label,
    Item,
} from 'native-base';
import { Table, Row, Rows, TableWrapper, Col, Cell } from 'react-native-table-component';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import '@react-native-firebase/functions';
export default class PaymentsRecord extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: '',
            filter1: '',
            myRecordB: [],//如果我是買方
            myRecordS: [],
            reported: true,
        }
    }


    componentDidMount() {
        firebase.database().ref('PaymentRecord/').on('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) { } else {
                let content = Object.values(data);
                //console.log(content);
                let rowData = [];
                let data1 = [];
                //如果我是賣方
                var myRecordS = content.filter(function (item, index, array) {
                    return (item.sUid).indexOf(firebase.auth().currentUser.uid) !== -1;
                });
                for (i = 0; i < myRecordS.length; i++) {
                    //if (myRecordS[i].finished === false) {
                    let skill = myRecordS[i].skill;
                    let price = myRecordS[i].price;
                    let time = myRecordS[i].time;
                    time = this.getTime(time);
                    //let finished = '未完成';
                    let commission = myRecordS[i].commission;
                    rowData[i] = [[skill], [time], [commission], [price], [price - commission]]
                    data1.push(rowData[i]);
                    this.setState({
                        rowData: data1,
                    });

                }

                //
                //console.log(myRecordS)
                //如果我是買方

                var myRecordB = content.filter(function (item, index, array) {
                    return (item.bUid).indexOf(firebase.auth().currentUser.uid) !== -1;
                });

                this.setState({ filter: myRecordS, filter1: myRecordB });
                //比對出我在這筆交易中扮演的角色
                //找出跟我有關的
                //如果我是買方
            }
        });
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    getTime = (time) => {
        let year = new Date(time).getFullYear();
        let month = new Date(time).getMonth() + 1;
        let date = new Date(time).getDate();
        return year + ' / ' + month + ' / ' + date;
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

    pay = (price, sUid, score, key, token) => {
        //上傳price(價格),sUid（賣方uid）,score(評分),key(此工作的key值加入finished用)
        var scoreAndEarn = firebase.functions().httpsCallable('scoreAndEarn');
        scoreAndEarn({
            price: price,
            sUid: sUid,
            score: score,
            key: key,
            token: token,
        });
    }

    //檢舉未付款
    report = (uid) => {//傳入買方uid
        firebase.database().ref('Report/').push({
            report: '未付款',
            uid: uid,
        });
    }
    //是否已經檢舉過
    alreadyReport = (key) => {
        var Report = firebase.functions().httpsCallable('Report');
        Report({
            key: key,//已經檢舉過是false
        });
        //this.setState({ reported : false })
    }

    render() {

        return (
            <Container>
                <Header>
                    <Left>
                        <Icon
                            name='chevron-left'
                            color='#85A5FF'
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                        />
                    </Left>

                    <Body>
                        <Title>消費明細</Title>
                    </Body>

                    <Right />
                </Header>
                <View
                    style={{ flex: 1 }}
                //contentContainerStyle={{flex: 1}}
                >

                    <Text style={{ alignSelf: 'center', fontSize: 20, marginTop: 10 }}>我的工作明細</Text>

                    <FlatList
                        data={this.state.filter}
                        renderItem={({ item }) => (
                            item.finished === false ?
                                <ListItem
                                    title={<View style={{ paddingLeft: 20 }}><Label>{item.bName}</Label></View>}
                                    rightTitle=
                                    {item.reported !== false ?
                                        <TouchableOpacity
                                            style={{ paddingTop: 20 }}
                                            onPress={() => {
                                                //alert詢問是否要檢舉
                                                Alert.alert(
                                                    '檢舉',
                                                    '您已完成工作，對方遲遲未付款，確定要檢舉？請妥善使用檢舉機制，若發現濫用情形，您的帳號可能會被關閉。',
                                                    [{ text: '取消' }, {
                                                        text: '確定', onPress: () => {
                                                            //檢舉
                                                            this.report(item.bUid);
                                                            this.alreadyReport(item.key);
                                                        }
                                                    }],
                                                );
                                            }}>
                                            <View style={{
                                                //width: 60 + "%",
                                                padding: 5,
                                                height: 30,
                                                borderRadius: 10,
                                                justifyContent: 'center',
                                                backgroundColor: 'red',
                                                alignItems: 'center',
                                                alignSelf: 'center'
                                            }}>
                                                <Text style={{ fontSize: 15, color: 'white' }}>檢舉未付款</Text>
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        <Text>已檢舉</Text>
                                    }
                                    rightSubtitle={<Label>$:{item.price}</Label>}
                                    subtitle={
                                        <View style={{ paddingLeft: 20, }}>
                                            <Label>{item.skill}</Label>
                                        </View>
                                    }
                                    onPress={() => {
                                        //跳下一頁顯示明細
                                        this.props.navigation.navigate('Work', { skill: item.skill, price: item.price, commission: item.commission, time: item.time });
                                    }}
                                />
                                :
                                <ListItem
                                    title={<View style={{ paddingLeft: 20 }}><Label>{item.bName}</Label></View>}
                                    rightTitle={<Text>完成</Text>}
                                    subtitle={
                                        <View style={{ paddingLeft: 20, }}>
                                            <Label>{item.skill}</Label>
                                        </View>
                                    }
                                    rightSubtitle={<Label>$:{item.price}</Label>}
                                    onPress={() => {
                                        //跳下一頁顯示明細
                                        this.props.navigation.navigate('Work', { skill: item.skill, price: item.price, commission: item.commission, time: item.time });
                                    }}
                                />
                        )}
                        keyExtractor={item => item.key}
                        ItemSeparatorComponent={this.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                    />


                    <Text style={{ alignSelf: 'center', fontSize: 20, paddingTop: 30, }}>我的消費明細</Text>
                    <FlatList
                        data={this.state.filter1}
                        onEndReachedThreshold={0}
                        renderItem={({ item }) => (
                            item.finished === false ?
                                <ListItem
                                    title={<View style={{ paddingLeft: 20 }}><Label>{item.sName}</Label></View>}
                                    rightTitle={
                                        <TouchableOpacity
                                            style={{ paddingTop: 20 }}
                                            onPress={() => {
                                                //
                                                Alert.alert(
                                                    '評分',
                                                    '給他一個分數吧，評分完畢才能確認付款喔！',
                                                    [
                                                        { text: '1', onPress: () => { this.pay(item.price, item.sUid, 1, item.key, item.token) } },
                                                        { text: '2', onPress: () => { this.pay(item.price, item.sUid, 2, item.key, item.token) } },
                                                        { text: '3', onPress: () => { this.pay(item.price, item.sUid, 3, item.key, item.token) } },
                                                        { text: '4', onPress: () => { this.pay(item.price, item.sUid, 4, item.key, item.token) } },
                                                        { text: '5', onPress: () => { this.pay(item.price, item.sUid, 5, item.key, item.token) } },
                                                        { text: '取消' },
                                                    ],
                                                    { cancelable: true },
                                                );
                                            }}>
                                            <View style={{
                                                padding: 5,
                                                height: 30,
                                                borderRadius: 10,
                                                justifyContent: 'center',
                                                backgroundColor: '#00DD00',
                                                alignItems: 'center',
                                                alignSelf: 'center'
                                            }}>
                                                <Text style={{ fontSize: 15, color: 'black' }}>完成</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                    subtitle={
                                        <View style={{ paddingLeft: 20, }}>
                                            <Label>{item.skill}</Label>
                                        </View>
                                    }
                                    rightSubtitle={
                                        <Item>
                                            <Icon 
                                                name='monetization-on'
                                                color='#FFBB00' 
                                            />
                                                <Label>{item.price}</Label>
                                        </Item>
                                    }
                                //onPress={() => {}}
                                />
                                :
                                <ListItem
                                    title={<View style={{ paddingLeft: 20, }}><Label>{item.sName}</Label></View>}
                                    rightTitle={<Text>完成</Text>}
                                    rightSubtitle={
                                        <Item>
                                            <Icon 
                                                name='monetization-on'
                                                color='#FFBB00' 
                                            />
                                                <Label>{item.price}</Label>
                                        </Item>
                                    }
                                    subtitle={
                                        <View style={{ paddingLeft: 20, }}>
                                            <Label>{item.skill}</Label>
                                        </View>
                                    }
                                //onPress={() => { }}
                                />
                        )}
                        keyExtractor={item => item.key}
                        ItemSeparatorComponent={this.renderSeparator}
                    // ListHeaderComponent={this.renderHeader}
                    />
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: { padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#537791' },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' }
});