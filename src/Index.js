import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    FlatList,
    Alert,
    RefreshControl,
} from 'react-native';
import {
    Container,
    Header,
    Left,
    Body,
    Title,
    Right,
    Label,
    Card,
    CardItem,
    Content,
    Fab,
    Button,
} from 'native-base';
import {
    Icon,
    ListItem,
} from 'react-native-elements';
import Slider from '@react-native-community/slider';
import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator, } from 'react-navigation-stack';
import Personal from './Personal';
import Calendar from './Calendar';
import Bell from './Bell.js';
import MessageBoard from './MessageBoard.js';
import PostImage from './PostImage.js';
import Work from './Work.js';
import Valuation from './Valuation.js';
import IconWithBadge from './IconWithBadge.js';
import PaymentsRecord from './PaymentsRecord.js';
import Edit from './Edit.js';
import PersonalInfo from './PersonalInfo.js';
import Speed from './Speed.js';
import BlockList from './BlockList.js';
import Report from './Report.js';
import MessageBoardForSpeed from './MessageBoardForSpeed.js';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import '@react-native-firebase/functions';
import database from '@react-native-firebase/database';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCoin: '',//總幣數
            person: '',//總人數
            myCoin: 0,//我的wow幣數
            value: 0,//我亦捐出的wow幣數
            donate: 0,//我捐出的
            arr: [],//排行榜的所有資料
            loading: false,
            refreshing: false,
            keys:[''],//要傳到ChatList的BlockUser名單
        };
    }
    componentDidMount() {
        //抓使用者人數總wow幣數
        firebase.database().ref('Coin/').on('value', (snapshot) => {
            let data = snapshot.val();
            //不可能會沒資料
            let totalCoin = data.TotalCoin;
            let person = data.person;
            this.setState({ totalCoin: totalCoin, person: person });
        });
        //抓我的wow幣數
        firebase.database().ref('Personal/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let data = snapshot.val();
            let myCoin = data.myCoin;//我的幣
            let donate = data.donate;//我捐出的幣
            this.setState({ myCoin: myCoin, donate: donate });
        });
        //抓出捐助最多的前10名 
        let arr = [];
        firebase.database().ref('Personal/').orderByChild('donate').limitToLast(10).on('child_added', (snapshot) => {
            let data = snapshot.val();
            //console.log(data);
            arr.push(data);
            this.setState({ arr: arr });
        });
        //抓Block的資料傳下去到ChatList
        firebase.database().ref('Block/' + firebase.auth().currentUser.uid ).on('value',(snapshot)=>{
            let data = snapshot.val();
            if(data === null){}else{
                let keys = Object.keys(data);
                this.setState({ keys : keys });
            }
        });
    }
    timeOut = () => {
        setTimeout(()=>{
            this.setState({
                refreshing: false,
            });
        }, 1000);
    }
    componentWillUnmount() {
        clearTimeout(this.timeOut);
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
                        <Title>WoW</Title>
                    </Body>
                    <Right>
                        <Icon
                            name='chat'
                            color='#85A5FF'
                            onPress={() => {
                                this.props.navigation.navigate('GroupChat',{blockKeys:this.state.keys}) 
                            }}//chatroom
                        />
                    </Right>
                </Header>
                <Content refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            let arr = [];
                            firebase.database().ref('Personal/').orderByChild('donate').limitToLast(10).once('value', (snapshot) => {
                                let data = snapshot.val();
                                //console.log(data);
                                let content = Object.values(data);
                                console.log(content);
                                //arr.push(data);
                                //console.log(arr)
                                this.setState({ arr: content ,refreshing:true });
                            });
                            this.timeOut();
                        }}
                    />}>
                    <Card>
                        <CardItem style={{ alignSelf: 'center' }}>
                            <Slider
                                style={{ width: 70 + '%', height: 40, }}
                                minimumValue={0}
                                value={this.state.value}
                                step={1}
                                onValueChange={value => this.setState({ value })}
                                maximumValue={parseInt(this.state.myCoin)}
                            />
                            {this.state.myCoin === 0 ?
                            <Text>數量: 0/{parseInt(this.state.myCoin)}</Text>
                            :
                            <Text>數量: {parseInt(this.state.value)}/{parseInt(this.state.myCoin)}</Text>
                            }
                        </CardItem>
                        <CardItem style={{ alignSelf: 'center', }}>
                            <Button
                                info
                                style={{ padding: 10 }}
                                onPress={() => {
                                    if(this.state.myCoin > 0){
                                        var donate = firebase.functions().httpsCallable('donate');
                                        donate({ price : this.state.value });//上傳捐出幣數
                                    } else {
                                        Alert.alert('已經沒幣可捐了');
                                    }
                                }}>
                                <Icon
                                    name='monetization-on'
                                    color='#FFBB00'
                                />
                                <Label>捐出</Label>
                            </Button>
                        </CardItem>
                    </Card>
                    <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                            <Card>
                                <CardItem>
                                    <Label>我的幣數</Label>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Label>
                                            {this.state.myCoin}
                                        </Label>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Card>
                                <CardItem>
                                    <Label>使用者數</Label>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Label>
                                            {this.state.person}
                                        </Label>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>
                        
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Card>
                                <CardItem>
                                    <Label>捐出幣總數</Label>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Label>
                                            {this.state.donate}
                                        </Label>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Card>
                                <CardItem>
                                    <Label>流通幣數</Label>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Label>
                                            {this.state.totalCoin}
                                        </Label>
                                    </Body>
                                </CardItem>
                            </Card>
                        </View>
                    </View>

                    <Card>
                        <CardItem>
                            <Label>捐獻WOW幣排行榜</Label>
                        </CardItem>
                        <CardItem>
                            <FlatList
                                data={this.state.arr}
                                inverted
                                horizontal={true}
                                renderItem={({ item }) => (
                                    <ListItem
                                        leftAvatar={{ source: { uri: item.avatarUrl } }}
                                        title={item.name + '-' + item.donate}
                                    />
                                )}
                                keyExtractor={item => item.phoneNumber}//每個skill只會出現一次
                                ItemSeparatorComponent={this.renderSeparator}
                                ListHeaderComponent={this.renderHeader}
                            />
                        </CardItem>
                    </Card>
                    {/*這邊可用FlatList
                        
                    */}
                    <TouchableOpacity
                        style={{  width: 60, height: 60, alignSelf: 'center', marginBottom: 10,marginTop:10 }}
                        onPress={() => { this.props.navigation.navigate('Speed') }}>
                        <Image
                            style={{ marginBottom: 5 + "%",  width: 100 + '%', height: 100 + '%', transform: [{ scale: 1 }], alignSelf: "center" }}
                            source={require('./randomBtn.png')}
                        />
                    </TouchableOpacity>
                </Content>
            </Container>
        );
    }
}


const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;

    let iconName;
    if (routeName === '首頁') {
        iconName = 'home'
    } else if (routeName === '行事曆') {
        iconName = 'insert-invitation';
    } else if (routeName === '個人頁面') {
        iconName = 'account-circle'
    } else if (routeName === '通知') {
        iconName = 'notifications'
    } else if (routeName === '訂單') {
        iconName = 'assignment'
    }

    if (iconName === 'notifications') {
        return <IconWithBadge name={iconName} size={25} color={tintColor} />
    } 
    else {
        return <Icon name={iconName} size={25} color={tintColor} />;
    }
};


const Tab = createBottomTabNavigator(
    {
        '首頁':
            {
                screen: Index,
            },
        '行事曆': {
            screen: Calendar,

        },
        '個人頁面': {
            screen: Personal,
        },
        '通知': {
            screen: Bell,
        },
        '訂單': {
            screen: MessageBoard,
        }

    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) =>
                getTabBarIcon(navigation, focused, tintColor),
        }),
        tabBarOptions: {
            activeTintColor: 'orange',
            inactiveTintColor: 'gray',
            showLabel: false
        },
    }
);



const Root = createStackNavigator(
    {
        Tab: {
            screen: Tab
        },
        Personal: {
            screen: Personal,
        },
        Work: {
            screen: Work
        },
        
        Report:{
            screen:Report,
        },
        BlockList:{
            screen:BlockList,
        },
        Valuation: {
            screen: Valuation
        },
        PaymentsRecord: {
            screen: PaymentsRecord
        },
        Edit: {
            screen: Edit,
        },
        PersonalInfo:{
            screen:PersonalInfo,
        },
        Speed:{
            screen:Speed,
        },
        MessageBoardForSpeed:{
            screen:MessageBoardForSpeed,
        },
    },

    {
        headerMode: 'none'
    }
)

//export default createAppContainer(Tab);
export default createAppContainer(Root);