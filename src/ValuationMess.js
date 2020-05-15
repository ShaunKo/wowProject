import React, { Component } from 'react';
import {
    View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert,
} from 'react-native';
import {
    Container, Header, Right, Left, Body, Title, Item, Input, Form, Textarea,
} from 'native-base';
import {
    Icon,
} from 'react-native-elements'
import {
    Table,
    Row,
    Rows,
    TableWrapper,
    Col,
} from 'react-native-table-component';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class ValuationMess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: '',
            skill: '',
            city: '',
            district: '',
            start: '',
            end: '',
            description: '',
            uid: '',
            price: '',
            valuation: '',
            changeButton: true,
            name: '',//賣方名字
            sellUid: '',
            avatar: '',//賣方的頭貼
            token: '',//買方的token
            self: true,
        };
    }
    componentDidMount() {
        const { state: { params: { avatar, skill, city, district, start, end, description, bUid, key, price, sUid }, goBack } } = this.props.navigation;
        this.setState({ avatar, skill, city, district, start, end, description, bUid, key, price, sUid })//上頁傳來是買方的
        //抓賣方名稱
        
        if (sUid === 'N') {
            this.setState({ self: false });
            
        } else {
            firebase.database().ref('Personal/' + sUid).once('value', (snapshot) => {
                let data = snapshot.val();
                let name = data.name;
                this.setState({ name: name });
            });
            
        }
        //抓出changeButton
        //抓買方的token
        firebase.database().ref('Personal/' + bUid).once('value', (snapshot) => {//買方的uid
            let data = snapshot.val();
            let token = data.token;
            
            this.setState({ token: token });
        });
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
                    <Left>
                        <Icon
                            name='chevron-left'
                            color='#85A5FF'
                            onPress={() => {
                                this.props.navigation.goBack();
                            }} />
                    </Left>
                    <Body>
                        <Title>搶賺</Title>
                    </Body>
                    <Right>
                        <Icon
                            name='info'
                            color='#85A5FF'
                            onPress={() => {
                                this.props.navigation.navigate('Report', { uid: this.state.bUid });//傳買方的
                            }}
                        />
                    </Right>
                </Header>
                <ScrollView>
                    <View style={styles.container}>
                        <Table borderStyle={{ borderWidth: 1 }}>
                            {/* <Row data={this.state.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text} /> */}
                            <TableWrapper style={styles.wrapper}>
                                <Col data={['項目', '地區', '起始時間', '結束時間', '價格']} style={styles.title} heightArr={[40, 40, 40, 40]} textStyle={styles.text} />
                                <Rows data={[
                                    [this.state.skill],
                                    [this.state.city + '/' + this.state.district],
                                    [this.state.start],
                                    [this.state.end],
                                    [this.state.price],
                                ]} flexArr={[2]} style={styles.row} textStyle={styles.text} />
                            </TableWrapper>

                            <Row data={['細節', this.state.description]} flexArr={[1, 2]} style={styles.head} textStyle={styles.text} />
                        </Table>

                        {this.state.self ?//是否為自己
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={{ paddingBottom: 20, marginTop:20 }}
                                onPress={() => {
                                    let ref = firebase.database().ref('Notification/' + this.state.bUid).push();
                                    let key = ref.key;
                                    ref.set({
                                        key: key,//key
                                        avatar: false,//控制通知的頭貼
                                        skill: this.state.skill,//需求技能
                                        name: this.state.name,//賣方名
                                        sUid: this.state.sUid,//賣方uid
                                        bUid: this.state.bUid,//買方uid
                                        time: Date.now(),//傳送時間
                                        chose: true,//買方是否已經反選
                                        price1: this.state.price,//技能價格paymentRecord要用，但不能跟price一樣名稱要避免顯示在Bell
                                        start: this.state.start,
                                        end: this.state.end,
                                        city: this.state.city,
                                        district: this.state.district,
                                        description: this.state.description,
                                        seen: false,
                                        token: this.state.token,
                                    });
                                    //有人按下搶賺就把MessageBoard資料刪除
                                    firebase.database().ref('MessageBoard/' + this.state.key ).remove();
                                    this.setState({ self : false });//按下搶賺
                                    //進入notification＋uid中 加入true表已搶過，
                                    //改變搶賺紐
                                    //按下加入資料（ true/false ）
                                    //以買方uid為首
                                    //avatar :false
                                    //賣方name 
                                    //傳送時間
                                    //skill
                                }}
                            >
                                <View style={{
                                    width: 60 + "%",
                                    height: 50,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    backgroundColor: '#ff7454',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                }}>
                                    <Text style={{ fontSize: 20, color: 'white' }}>搶賺</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        <View></View>
                        }

                    </View>

                </ScrollView>

            </Container>
        )
    }
}



const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { backgroundColor: '#f1f8ff' },
    wrapper: { flexDirection: 'row' },
    title: { backgroundColor: '#f6f8fa' },
    row: { height: 40 },
    text: { textAlign: 'center' }
});