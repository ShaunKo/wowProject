import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    RefreshControl,
} from 'react-native';
import {
    Container,
    Header,
    Left,
    Body,
    Title,
    Right,
    Content,
} from 'native-base';
import {
    Icon,
    ListItem,
    SearchBar,
} from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class MessageBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            value: '',
            arr: [],//取得資料
        }
    }


    //取出firebase data 結合佈告欄 list method，
    // allTogether = (a) => {
    //     if (a.length == 1) {
    //         return a[0]
    //     } else {
    //         for (var i = 0; i < a.length; i++) {
    //             var b = a[i]
    //             //console.log(a.concat(content1[i+1]))
    //             return b.concat(a[i + 1])
    //         }
    //     }
    // }


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

    //抓取firebase的資料
    componentDidMount() {
        //一開始的開通，有所有資料，並排序
        let newData = [];
        firebase.database().ref('MessageBoard/').orderByChild('time').on('child_added', (snapshot) => {
            let data = snapshot.val();
            if (data === null) { } else {
                newData.push(data)
                this.setState({ arr: newData });
            }
        });
        // firebase.database().ref('MessageBoard/').orderByChild('time').on('value', (snapshot) => {
        //     let data = snapshot.val();
        //     if (data == null) {
        //         let content = []
        //     } else {
        //         let content = Object.values(data);
        //         //console.log(content)
        //         let content1 = content.map(item => Object.values(item))
        //         //console.log(content1)
        //         let content2 = this.allTogether(content1)
        //         //content2.pop()//處理this.c的bug
        //         //console.log(content2)
        //         //=======================
        //         let content3 = Object.values(data);
        //         //console.log(content)
        //         let content4 = content.map(item => Object.values(item))
        //         console.log(content4)
        //         let content5 = this.allTogether(content4)
        //         //console.log("content5="+content5)
        //         //Object.values(data)輸出data內的東西
        //         //第一次頁面原有的所有資料，之後會存給arrayholder
        //         //let arrayholder = Object.values(data)
        //         //之後會改變的資料

        //         //console.log(content)
        //         this.setState({
        //             content2,
        //             content5,
        //             refreshing: false,//一開始不需要刷新
        //         })
        //     }
        // });
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    // flatlist的header
    //處理查詢
    renderHeader = () => {
        return (
            <SearchBar
                placeholder='查找想完成的技能'
                lightTheme
                round
                onChangeText={text => this.searchFilterFunction(text)}
                autoCorrect={false}
                value={this.state.value}
            />
        );
    };

    searchFilterFunction = text => {
        this.setState({
            value: text,
        });
        firebase.database().ref('/MessageBoard/').on('value', (snapshot) => {
            let data = snapshot.val();
            if(data === null ){} else{
            let content = Object.values(data);
            const newData = content.filter(function (item, index, array) {
                const itemSkill = item.skill.toUpperCase();
                const textData = text.toUpperCase();
                return itemSkill.indexOf(textData) > -1;
            });
            this.setState({ arr: newData });
            //     this.state.content5 = this.state.content2
            //     const newData =
            //         this.state.content5.
            //             filter(item => {//傳出陣列
            //                 if (item.skill !== undefined) {
            //                     const itemSkill = item.skill.toUpperCase();
            //                     const textData = text.toUpperCase();
            //                     //console.log(textData)
            //                     return itemSkill.indexOf(textData) > -1;//有比對到就是false
            //                 }


            //             })
            //     var result = Array.from(new Set(newData));

            //     this.setState({
            //         content5: result,
            //     });
        }
        })
    };
    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Icon
                            name='chevron-left'
                            color='#85A5FF'
                            onPress={() => {
                                this.props.navigation.navigate('Tab');
                            }}
                        />
                    </Left>
                    <Body>
                        <Title>落單專區</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={{ flex: 1 }} >
                    <FlatList
                        data={this.state.arr}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    //抓資料
                                    let newData = [];
                                    firebase.database().ref('MessageBoard/').orderByChild('time').on('child_added', (snapshot) => {
                                        let data = snapshot.val();
                                        if (data === null) { } else {
                                            newData.push(data)
                                            this.setState({ arr: newData });
                                        }
                                    });
                                    setTimeout(() => {
                                        this.setState({
                                            refreshing: false,
                                        });
                                    }, 1000);
                                }}
                            />}
                        renderItem={({ item }) => (
                            <ListItem
                                title={item.name}
                                rightTitle={this.getTime(item.time)}
                                subtitle={
                                    <View>
                                        <Text>技能：{item.skill}</Text>
                                        <Text>區域：{item.city + item.district}</Text>
                                        <Text>起始時間：{item.start}</Text>{/*價格改成時間*/}
                                        <Text>結束時間：{item.end}</Text>
                                        <Text>細節：{item.description ? (item.description.length > 30 ? item.description.substr(0, 30) + "..." : item.description) : ""}</Text>
                                    </View>
                                }
                                onPress={() => {
                                    //取得userId透過navigation傳下去
                                    if (firebase.auth().currentUser.uid === item.bUid) {
                                        this.props.navigation.navigate('ValuationMess', {
                                            bUid: item.bUid,
                                            name: item.name,
                                            skill: item.skill,
                                            city: item.city,
                                            district: item.district,
                                            start: item.start,
                                            end: item.end,
                                            description: item.description,
                                            key: item.key,
                                            price: item.price,
                                            sUid: 'N',
                                        });
                                        //按下後是更加清楚的請求
                                    } else {
                                        this.props.navigation.navigate('ValuationMess', {
                                            bUid: item.bUid,
                                            name: item.name,
                                            skill: item.skill,
                                            city: item.city,
                                            district: item.district,
                                            start: item.start,
                                            end: item.end,
                                            description: item.description,
                                            key: item.key,
                                            price: item.price,
                                            sUid: firebase.auth().currentUser.uid,
                                        });
                                    }
                                }}

                            />

                        )}
                        //這邊要再有一個unique的key
                        keyExtractor={item => item.key}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                    />
                </View>
            </Container>
        );
    }
}