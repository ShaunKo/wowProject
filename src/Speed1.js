import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
    ScrollView,
    FlatList,
    TextInput,
    Button,
    Alert,
    ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modalbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    Textarea, Container, Header, Left, Body, Title, Right
} from 'native-base';
import Dropdown from 'react-native-modal-select-option';
import {
    Icon, ListItem, SearchBar, CheckBox
} from 'react-native-elements';

//資料放在Location.js
import { city } from './Location.js'
import { district } from './Location.js'
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

//目前沒在用
let addNotificationS = (receiver, item1, item2, item3, item4, item5, item6, item7, item8, item9) => {
    var ref = friebase.database().ref("NotificationS/" + receiver).push()
    var postId = ref.key;
    ref.set({//receiver是賣方
        //token:item1,//接收者的token
        description: item1,
        city: item2,
        district: item3,
        start: item4,
        end: item5,
        skill: item6,
        uid: item7,//買方的uid
        token: item8,
        valuation: item9,
        pushId: postId,
        //speed:item10,
    })
}

//先去做比對
//有比對到進入cardtest
//沒有比對到則存入資料庫，再messageboard印出

export default class Speed1 extends Component {

    maxDate = new Date();
    minDate = new Date();
    constructor(props) {
        super(props);
        this.maxDate.setDate(new Date().getDate() + 365);
        this.minDate.setDate(new Date().getDate());
        this.state = {

            //Dropdown value
            selectedCity: '',
            isShowingCity: false,
            selectedDistrict: '',
            isShowingDistrict: false,
            check: false,
            show: [
                {
                    district: "taipeiCity",
                    dropdown: {
                        defaultValue: { value: 0, label: '請選擇城市' },

                        options: [
                            { value: 1, label: '請選擇城市' },
                        ],
                        label: '您的所在區域',
                        animationType: 'none',
                    }
                },
            ],
            //要上傳firebase 的資料
            skill: '',
            description: '',
            name: '',

            //==============時間
            date: new Date(),

            dateTxt: '',
            dateTxt1: '',
            tokenB: '',
            maxDate: this.maxDate,
            minDate: this.minDate,
            mode: 'datetime',
            minuteInterval: 30,
            timeZoneOffsetInMinutes: 8 * 60,
            hasChangedS: false,
            hasChangedL: false,
            hasChangedW: false,
            isOpen: false,
            isOpen1: false,
            year: '',
            month: '',
            date1: '',
            hour: '',
            min: '',
            minD: '',
            //必填選項
            requiredSkill: true,
            requiredDescription: true,
            requiredDateTxt: true,
            requiredLocation: true,

            checked: false,

            userId: '',//賣方的uid,
            token: '',
            alreadyValuation: true,
            //speed:false
        }
    }



    handleAdd = (receiver, description, city, district, start, end, skill, token) => {
        addNotificationS(
            receiver,//賣方的uid
            description,
            city,
            district,
            start,
            end,
            skill,
            firebase.auth().currentUser.uid,
            token,
            this.state.alreadyValuation,
            //this.state.speed
            //應該要有買方的uid
        )
    }


    allTogether = (a) => {
        if (a.length == 1) {
            return a[0]
        } else {
            for (var i = 0; i < a.length; i++) {
                var b = a[i]
                //console.log(a.concat(content1[i+1]))
                for (var j = 1; j < a.length; j++) {
                    b.push(a[j][i])
                    //return b//.concat(a[i + 1])//.concat(a[i+2])
                }
                return b
            }
        }
    }
    //取得personal中的name 存入另一組資料結構
    async componentDidMount() {
        const { state: { params: { userId, token }, goBack } } = this.props.navigation;
        console.log('type: ', userId);
        this.setState({ userId: userId, token: token })
        
        
        await firebase.messaging().registerForRemoteNotifications();
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    firebase.messaging().getToken().then(token => {
                        console.log("LOG: ", token);
                        this.setState({ tokenB: token })
                    })
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            console.log('User Now Has Permission')
                            //alert("User Now Has Permission")
                        })
                        .catch(error => {
                            console.log('User has rejected permissions ')
                            // User has rejected permissions  
                        });
                }
            });
       
        firebase.database().ref("/Personal/" + firebase.auth().currentUser.uid).once('value', (snapshot) => {
            let data = snapshot.val();
            let name = data.name
            this.setState({
                name
            })
        })
        //抓自己的token(買方的token)傳到CardTest
        firebase.database().ref("NotificationS/").on("value", (snapshot) => {
            let data = snapshot.val()
            if (data === null) { } else {
                let content = Object.values(data)
                //let content1 = content.map(item=>Object.keys(item))
                var content1 = content.find(function (item, index, array) {
                    return Math.max(Object.keys(item));
                });
                console.log(content1)
            }
        })
    }


    //項目與需求欄位為必填
    requiredItems = (skill) => {
        if (this.state.skill.trim() === '') {
            Alert.alert("警告", "請檢查選項是否都填入完畢")
            this.setState({ requiredSkill: false })
        }
        if (this.state.description.trim() === '') {
            Alert.alert("警告", "請檢查選項是否都填入完畢")
            this.setState({ requiredDescription: false })
        }
        if (this.state.dateTxt.trim() === "") {
            Alert.alert("警告", "請檢查選項是否都填入完畢")
            this.setState({ requiredDateTxt: false })
        }
        if (this.state.dateTxt1.trim() === "") {
            Alert.alert("警告", "請檢查選項是否都填入完畢")
            this.setState({ requiredDateTxt: false })
        }
        if (this.state.selectedCity.value === undefined) {
            Alert.alert("警告", "請檢查選項是否都填入完畢")
            this.setState({ requiredLocation: false })
        }
        if (this.state.selectedDistrict.value === undefined) {
            Alert.alert("警告", "請檢查選項是否都填入完畢")
            this.setState({ requiredLocation: false })
        }

        //若都有資料則傳遞
        //清空Card資料
        if (this.state.skill.trim() !== '' && this.state.description.trim() !== '' &&
            this.state.dateTxt.trim() !== '' && this.state.dateTxt1.trim() !== '' &&
            this.state.selectedCity.value !== '' && this.state.selectedDistrict.value !== ''
        ) {
            this.handleAdd(this.state.userId, this.state.description, this.state.selectedCity.value, this.state.selectedDistrict.value, this.state.dateTxt, this.state.dateTxt1, this.state.skill, this.state.token, this.state.count)//賣方的token
            this.props.navigation.navigate("Card")
        }

    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Icon
                            name="chevron-left"
                            onPress={
                                () => {
                                    this.props.navigation.goBack()
                                }
                            }
                        />
                    </Left>
                    <Body>

                        <Title>委託單</Title>

                    </Body>
                    <Right />
                </Header>

                <View style={{ flex: 1 }}>
                    {/* <View style={{ flex: 1 }}> */}

                    <ScrollView>
                        <View style={{ flexDirection: 'row', justifyContent: "space-around", paddingTop: 10 }}>
                            <View >
                                {this.state.requiredSkill ?
                                    <Text>需要解決的事情(必填)</Text>
                                    :
                                    <Text style={{ color: "red" }}>需要解決的事情(必填)</Text>
                                }
                                <TextInput
                                    placeholder='請輸入工作項目'
                                    //underlineColorAndroid="transparent"
                                    //keybordType='numeric'
                                    style={{ height: 80, width: 150, fontSize: 17 }}
                                    //multiline={true}
                                    onChangeText={(skill) => {
                                        this.setState({
                                            skill: skill
                                        })
                                    }}
                                />
                                {this.state.requiredDateTxt ?
                                    <Text>上班時間</Text>
                                    :
                                    <Text style={{ color: "red" }}>上班時間</Text>
                                }
                                <ScrollView scrollEnable >

                                    {
                                        this.state.hasChangedS ?
                                            <Button onPress={() => this.setState({ isOpen: true })} title={this.state.dateTxt} />
                                            :
                                            <Button onPress={() => this.setState({ isOpen: true })} title="-------" />
                                    }
                                    {
                                        this.state.hasChangedL ?
                                            (this.state.hasChangedW ?
                                                <Button onPress={() => this.setState({ isOpen1: true })} title={this.state.dateTxt1} />
                                                :
                                                <Button onPress={() => this.setState({ isOpen1: true })} title="--------" />
                                            )
                                            :
                                            <Button disabled={true} onPress={() => this.setState({ isOpen1: true })} title="-------" />
                                    }
                                    <Modal coverScreen isOpen={this.state.isOpen} onClosed={() => this.setState({ isOpen: false })} style={styles.modal4} position={"center"} >

                                        <DateTimePicker
                                            value={this.state.date}
                                            //date={this.state.date}
                                            maximumDate={this.state.maxDate}
                                            minimumDate={this.state.minDate}
                                            mode={this.state.mode}
                                            minuteInterval={this.state.minuteInterval}
                                            onChange={(event, date) => {
                                                this.setState({ date: date });
                                                //顯示出來的數字
                                                var year = date.getFullYear();//2019
                                                var month = date.getMonth() + 1;//事實上9月是8
                                                console.log(month)//9
                                                var date1 = date.getDate();
                                                var hour = date.getHours();
                                                var mins = date.getMinutes();

                                                //顯示出來了字串
                                                var d = new Date()
                                                d.setFullYear(year)
                                                d.setMonth(month - 1)//9，9月
                                                d.setDate(date1)
                                                d.setHours(hour)
                                                d.setMinutes(mins)
                                                if (month < 10) {
                                                    month = "0" + month
                                                }
                                                if (date1 < 10) {
                                                    date1 = "0" + date1

                                                }
                                                if (hour < 10) {
                                                    hour = "0" + hour

                                                }
                                                if (mins < 10) {
                                                    mins = "0" + mins
                                                }
                                                console.log(d)

                                                var s = year + "-" + month + "-" + date1 + ' ' + hour + ':' + mins;
                                                this.setState({ dateTxt: s, hasChangedS: true, hasChangedL: true, minD: d, dateTxt1: '--------' });
                                            }} />



                                        <Button onPress={() => this.setState({ isOpen: false })} style={[styles.btn, styles.btnModal]} title="確認" />
                                    </Modal>


                                    <Modal coverScreen isOpen={this.state.isOpen1} onClosed={() => this.setState({ isOpen1: false })} style={styles.modal4} position={"center"} >

                                        <DateTimePicker
                                            value={this.state.date}
                                            maximumDate={this.state.maxDate}
                                            minimumDate={this.state.minD}
                                            mode={this.state.mode}
                                            minuteInterval={this.state.minuteInterval}
                                            onChange={(event, date) => {
                                                this.setState({ date: date });
                                                var year = date.getFullYear();
                                                var month = date.getMonth() + 1;
                                                var date1 = date.getDate();
                                                var hour = date.getHours();
                                                var mins = date.getMinutes();
                                                if (month < 10) {
                                                    month = "0" + month

                                                }
                                                if (date1 < 10) {
                                                    date1 = "0" + date1

                                                }
                                                if (hour < 10) {
                                                    hour = "0" + hour

                                                }
                                                if (mins < 10) {
                                                    mins = "0" + mins
                                                }
                                                var s = year + "-" + month + "-" + date1 + ' ' + hour + ':' + mins;
                                                this.setState({ dateTxt1: s, hasChangedW: true, });
                                            }} />
                                        <Button onPress={() => this.setState({ isOpen1: false })} style={[styles.btn, styles.btnModal]} title="確認" />
                                    </Modal>
                                </ScrollView>
                            </View>
                            <View>
                                {this.state.requiredLocation ?
                                    <Text style={{ alignSelf: "center" }}>地區</Text>
                                    :
                                    <Text style={{ alignSelf: "center", color: "red" }}>地區</Text>
                                }
                                <Dropdown {...city}
                                    onSelect={this._onSelectCity.bind(this)}//選擇
                                    onShow={this._onShowCity.bind(this)}//model
                                    isShowingOptions={this.state.isShowingCity}
                                    selectedOption={this.state.selectedCity}
                                />

                                <Dropdown {...this.state.show[0].dropdown}
                                    onSelect={this._onSelectDistrict.bind(this)}//選擇
                                    onShow={this._onShowDistrict.bind(this)}//model
                                    isShowingOptions={this.state.isShowingDistrict}
                                    selectedOption={this.state.selectedDistrict}
                                />
                            </View>
                        </View>

                        <View style={{ paddingLeft: 3 + "%", paddingRight: 15, paddingBottom: 10 }}>
                            {this.state.requiredDescription ?
                                <Textarea
                                    onChangeText={(description) => {
                                        this.setState({
                                            description
                                        })
                                    }}
                                    rowSpan={9} bordered placeholder="請在此詳細說明您的需求，以便快速、準確的找到應徵者（此欄必填）" />
                                :
                                <Textarea
                                    onChangeText={(description) => {
                                        this.setState({
                                            description
                                        })
                                    }}
                                    placeholderTextColor="red"
                                    rowSpan={9} bordered placeholder="請在此詳細說明您的需求，以便快速、準確的找到應徵者（此欄必填）" />

                            }
                        </View>
                        <View>
                            <TouchableHighlight
                                onPress={() => {
                                    this.requiredItems(this.state.skill)
                                }}>
                                <View style={{
                                    width: 80 + "%",
                                    height: 50,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    backgroundColor: '#ff7454',
                                    alignItems: 'center',
                                    alignSelf: 'center'
                                }}>
                                    <Text style={{ color: 'white', fontSize: 17, letterSpacing: 10 }}>送出</Text>
                                </View>
                            </TouchableHighlight>
                        </View>

                    </ScrollView>
                </View>
            </Container>
        )


    }
    _onShowCity() {
        this.setState({
            isShowingCity: !this.state.isShowingCity,
        });
    }



    _onSelectCity(isShow) {
        this.setState({
            isShowingCity: !this.state.isShowingCity,
            selectedCity: isShow,
        },
            async function () {
                const everyoneAdd = district.filter(item => {
                    return item.district == this.state.selectedCity.value
                })
                await this.setState({
                    show: everyoneAdd,
                    check: true,//如果修改城市，則selectedDistrict，要重選
                    selectedDistrict: ""
                })
                console.log(this.state.selectedCity.value)
            }
        )
    }

    _onShowDistrict() {
        this.setState({
            isShowingDistrict: !this.state.isShowingDistrict,
        });
    }
    _onSelectDistrict(isShow) {
        this.setState({
            isShowingDistrict: !this.state.isShowingDistrict,
            selectedDistrict: isShow,


        });

    }
}

const styles = StyleSheet.create({



    modal: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    modal2: {
        height: 230,
        backgroundColor: "black"
    },

    modal3: {
        height: 300,
        width: 300,
        backgroundColor: "black"
    },

    modal4: {
        height: 250,
        width: 100 + "%",
    },

    btn: {
        margin: 10,
        backgroundColor: "black",
        color: "black",
        padding: 10
    },

    btnModal: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 50,
        height: 50,
        backgroundColor: "transparent"
    },

    text: {
        color: "black",
        fontSize: 22
    }

});

