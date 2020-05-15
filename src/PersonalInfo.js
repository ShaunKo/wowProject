import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Button,
    Image,
} from 'react-native';
import {
    Icon,
    Avatar,
} from 'react-native-elements';
import {
    Container,
    Header,
    Right,
    Body,
    Left,
    Title,
    Card,
    CardItem,
    Label,
    Textarea,
    Form,
    Item,
    Input,
    Content,
    Toast,
    Root,
} from 'native-base';
import HeadShot from './HeadShot.js';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/functions';
import Work from './Work.js';
import SelfIntroduction from './SelfIntroduction.js';
export default class Personal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skill1: '',
            skill2: '',
            skill3: '',
            name: '',//使用者名稱賣方名
            bName: '',//買方名
            avatarUrl: 'https://www.google.com.tw/',//大頭貼
            sUid: '',//賣方uid
            bUid: '',//買方uid
            skill: '',//解決技能
            start: '',
            end: '',
            city: '',
            district: '',
            description: '',
            price: '',//上頁傳來的價格
            myCoin: '',//買方擁有的幣數
            chose: true,//買方是否已反選（true未反選->有按鈕)
            token: '',//賣方的token
            finishedJob:'',//賣方完成工作數
            score:'',//賣方的評分
            pInfo:'',//賣方的個人簡介
        };
    }

    componentDidMount() {
        //抓上頁傳來的
        const { state: { params: { sUid, price, bUid, skill, start, end, city, district, description, key, }, goBack } } = this.props.navigation;
        this.setState({ sUid: sUid, price: price, bUid: bUid, skill: skill, start, end, city, district, description, key, });
        //抓技能
        firebase.database().ref('Skill/' + sUid).on('value', (snapshot) => {
            let data = snapshot.val();
            //console.log(data);
            if (data === null) { } else {
                let skill1 = data.skill1;
                let skill2 = data.skill2;
                let skill3 = data.skill3;
                this.setState({ skill1: skill1, skill2: skill2, skill3: skill3, });
            }
        });
        //抓買方擁有的幣數
        firebase.database().ref('Personal/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let data = snapshot.val();
            let myCoin = data.myCoin;
            let bName = data.name;
            this.setState({ myCoin: myCoin, bName: bName });
        });
        //抓買方是否已經反選
        firebase.database().ref('Notification/' + firebase.auth().currentUser.uid + '/' + key).once('value', (snapshot) => {
            let data = snapshot.val();
            let chose = data.chose;
            this.setState({ chose: chose });
        });
        //抓賣方名字
        //(不會修改的用once)
        firebase.database().ref('Personal/' + sUid).on('value', (snapshot) => {
            let data = snapshot.val();
            let content = data.name;
            let avatarUrl = data.avatarUrl;//大頭貼
            let finishedJob = data.finishedJob;//完成工作數
            let score = data.score;
            let token = data.token;
            let pInfo = data.pInfo;
            this.setState({ name: content, avatarUrl: avatarUrl, token: token, finishedJob:finishedJob, score:score,pInfo : pInfo, });
        });
    }
    //PaymentRecord
    addRecord = () => {
        //交易明細（上傳資料）
        //PaymentRecord-push
        let ref = firebase.database().ref('PaymentRecord/').push();
        let key = ref.key;
        //項目付款金額買賣方uid
        //時間抽成完成分數
        ref.set({
            sUid: this.state.sUid,//賣方uid
            bUid: firebase.auth().currentUser.uid,//只有買方可以看到這個頁面（買方uid）
            skill: this.state.skill,//技能
            price: this.state.price,//技能價格
            commission: Math.floor((this.state.price * 0.1) * 100) / 100,//抽成佣金Math.floor(15.7784514000 * 100) / 100 
            time: Date.now(),//現在時間
            finished: false,//是否已完成
            key: key,//push唯一值
            start: this.state.start,//工作開始時間
            end: this.state.end,//工作結束時間
            sName: this.state.name,//賣方名稱
            bName: this.state.bName,
            token: this.state.token,//賣方的token（買方按下完成付款後通知賣方）
            //分數
        });
    }
    //Notification通知賣方他被選中
    addNotification = () => {
        //加入賣方+///
        let ref = firebase.database().ref('Notification/' + this.state.sUid).push();
        let key = ref.key;
        ref.set({//只有賣方會出現，所以要抓買方的名字
            //1. avatar = 'congretuation'我就要用icon
            //2. button = 'truefalse' Valuation換底下的button 變成棄單
            //3. already push = true false 是否已按下棄單->棄單會幫買方加回錢
            //4. skill bUid sUid time price key
            avatar: 'inform',
            button: true,//換成棄單按鈕
            giveUp: true,
            skill: this.state.skill,
            bUid: this.state.bUid,
            sUid: this.state.sUid,
            price: this.state.price,
            start: this.state.start,
            end: this.state.end,
            city: this.state.city,
            district: this.state.district,
            description: this.state.description,
            key: key,
            time: Date.now(),
            seen: false,
            name: '搶單成功',//用name的原因是bell要顯示
            token: this.state.token,//賣方的token
            
        });
    }
    //已經按下選擇鈕
    Chose = () => {
        firebase.database().ref('Notification/' + firebase.auth().currentUser.uid + '/' + this.state.key).update({
            chose: false,
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
                        <Title>{this.state.name}</Title>
                    </Body>
                    <Right>
                        <Icon
                            name='info'
                            color='#85A5FF'
                            onPress={() => {
                                this.props.navigation.navigate('Report', { uid: this.state.sUid });//傳買方的
                            }}
                        />
                    </Right>
                </Header>
                <Root>
                    <Content>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Avatar
                                    rounded
                                    size='large'
                                    source={{ uri: this.state.avatarUrl, }}
                                />
                            </View>
                            <View style={{ flex: 1, alignContent: 'center', paddingLeft: 10 }}>
                                <Text style={{ paddingTop: 10}}>完成工作數：{this.state.finishedJob}</Text>
                                <Text style={{ paddingTop: 10}}>評分：{this.state.score}/5</Text>
                                
                                {/* <TouchableOpacity
                                    style={{ paddingBottom: 20 }}
                                    onPress={() => {
                                        this.props.navigation.navigate('PaymentsRecord');
                                    }}>
                                    <View style={{
                                        width: 60 + '%',
                                        padding: 5,
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        backgroundColor: '#ffa042',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                    }}>
                                        <Text style={{ color: 'white' }}>交易明細</Text>
                                    </View>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                        <Item>
                            <View style={styles.selfIntroductionTitle}>
                                <Label style={{ fontSize: 20 }}>個人簡介</Label>
                            </View>
                        </Item>
                        <Card style={{ flexDirection: 'row' }}>
                            <CardItem style={{ flex: 1 }}>
                                <Label>{this.state.skill1}</Label>
                            </CardItem>
                            <CardItem style={{ flex: 1 }}>
                                <Label>{this.state.skill2}</Label>
                            </CardItem>
                            <CardItem style={{ flex: 1 }}>
                                <Label>{this.state.skill3}</Label>
                            </CardItem>
                        </Card>
                        <Card>
                            <CardItem>
                                <Text>{this.state.pInfo}</Text>
                            </CardItem>
                        </Card>
                        {this.state.chose ?
                            <TouchableOpacity
                                style={{marginTop:200}}
                                onPress={() => {
                                    if (this.state.myCoin - this.state.price >= 0) {
                                        console.log(this.state.myCoin);
                                        //買方扣款
                                        var Deal = firebase.functions().httpsCallable('Deal');
                                        //買方反選，所以我要上傳的是價格（到後端後扣除買方價格）
                                        Deal({ price: this.state.price, aler: true });
                                        //建立訂單
                                        this.addRecord();//買方付款後的paymentrecord
                                        //我還要丟入一個Notification通知賣方被選到（要有key）
                                        this.addNotification();
                                        this.Chose();
                                        this.setState({ chose: false });
                                    } else {
                                        console.log(this.state.myCoin);
                                        console.log(this.state.price);
                                        //餘額不足
                                        Alert.alert('餘額不足');
                                    }
                                }}>
                                <View style={{
                                    width: 60 + "%",
                                    height: 50,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    backgroundColor: '#ff7454',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    marginTop: 5,
                                }}>
                                    <Text style={{ fontSize: 20, color: 'white' }}>選擇</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <View style={{ alignItems: 'center', marginTop: 5 }}>
                                <Label style={{ fontSize: 20 }}>已選擇</Label>
                                <Label style={{ fontSize: 15, paddingTop:10, color:'grey' }}>賣方完成工作後，請至交易明細按下完成鈕，完成付款</Label>
                            </View>
                        }
                    </Content>
                </Root>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    
    selfIntroductionTitle: {
        flex: 1,
        alignItems: 'center',
        marginBottom:7,
        marginTop:15,
    },
});
