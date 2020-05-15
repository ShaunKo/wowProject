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
    Platform,
} from 'react-native';
import {
    Textarea,
    Container,
    Content,
    Header,
    Left,
    Body,
    Title,
    Right,
    Form,
    Item,
    Label,
    Input,
    Card,
    CardItem,
} from 'native-base';
import Dropdown from 'react-native-modal-select-option';
import {
    Icon,
    CheckBox,
    ListItem,
} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modalbox';
//資料放在Location.js
import { city } from './Location.js';
import { district } from './Location.js';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import { checkPropertyChange } from 'json-schema';

let toMessageBoard = (skill, price, start, end, city, district, description, name, bUid, time) => {
    //let ref = firebase.database().ref('MessageBoard/' + firebase.auth().currentUser.uid).push();
    let ref = firebase.database().ref('MessageBoard/').push();
    var key = ref.key;
    ref.set({
        skill: skill,
        price: price,
        start: start,
        end: end,
        city: city,
        district: district,
        description: description,
        name: name,
        key: key,
        bUid: bUid,
        time: time,
    });
}
export default class Speed extends Component {
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
                    district: 'taipeiCity',
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
            price: '',
            //==============時間
            date: new Date(),

            dateTxt: '',
            dateTxt1: '',
            maxDate: this.maxDate,
            minDate: this.minDate,
            mode: 'datetime',
            modeForAndroid :'date',
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
            requiredPrice: true,
            checked: false,//是否有勾選
            allData: [],//search用的
            res: [],
            hasEarner: [],//有找到賣家
            checkLocal: false,

        }
    }
    handleToMessageBoard = () => {
        toMessageBoard(
            this.state.skill,
            this.state.price,
            this.state.dateTxt,
            this.state.dateTxt1,
            this.state.selectedCity.value,
            this.state.selectedDistrict.value,
            this.state.description,
            this.state.name,
            firebase.auth().currentUser.uid,//加入買方uid
            Date.now(),
        )
    }
    //有token
    addNotification = (uid) => {
        firebase.database().ref('Personal/' + uid).once('value', (snapshot) => {
            let data = snapshot.val();
            let token = data.token;
            let ref = firebase.database().ref('Notification/' + uid).push();
            let key = ref.key;
            ref.set({
                //要傳給賣方的東西
                //買方名，項目，描述，價格，時間，地區
                key: key,
                name: this.state.name,
                skill: this.state.skill,
                description: this.state.description,
                start: this.state.dateTxt,
                end: this.state.dateTxt1,
                seen: false,
                city: this.state.selectedCity.value,
                district: this.state.selectedDistrict.value,
                price: this.state.price,
                bUid: firebase.auth().currentUser.uid,//填寫者uid，當賣方確認要回傳資料的時候要找到買方
                sUid: uid,//賣方uid
                avatar: true,//控制Bell前面圖片用的true是購物車
                time: Date.now(),//傳送時間
                token: token,
            });
        });

    }

    //取得personal中的name 存入另一組資料結構
    componentDidMount() {
        //抓出所有人的所有技能(搜尋用)
        firebase.database().ref('Skill/').on('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) { } else {
                let content = Object.values(data);
                this.setState({ allData: content });//所有人的技能（包含skill1,skill2,skill3）
            }
        });
        //抓填寫者的名字//抓名字（烙單專區要用）還要有一個唯一值//抓填寫者的token
        firebase.database().ref('Personal/' + firebase.auth().currentUser.uid).once('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) { } else {
                let name = data.name;
                let bToken = data.bToken;
                this.setState({ name: name, bToken: bToken });
            }
        });
    }


    //比對賣家
    findEarner = (skill, city, district, checkLocal) => {
        firebase.database().ref('Skill/').once('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) {
                //Skill沒東西，表沒有賣方提供資料，則 若沒勾選 1.直接進入MessageBoard 若有勾選 2. 抓10個人出來
                if (this.state.checked === false) {
                    //沒勾選
                    this.handleToMessageBoard();
                    //console.log('a');
                    this.props.navigation.navigate('MessageBoardForSpeed');
                } else {
                    //有勾選，抓
                    let content3 = Object.values(data);
                    let content4 = content3.map(function (item, index, array) {
                        return item.user;
                    });
                    //console.log(content4);
                    content4 = content4.sort(function () {
                        return (0.5 - Math.random());
                    });

                    if (content4 !== [] && content4.length < 10) {
                        for (i = 0; i < content4.length; i++) { //隨機抽10個
                            if (content4[i] !== firebase.auth().currentUser.uid) {//不能是自己
                                this.addNotification(content4[i]);
                                this.props.navigation.goBack();
                                //console.log('b');
                            }
                        }
                    } else {
                        for (i = 0; i < 10; i++) { //大於10隨機抽10個
                            if (content4[i] !== firebase.auth().currentUser.uid) {//不能是自己
                                this.addNotification(content4[i]);
                                this.props.navigation.goBack();
                                //console.log('d');
                            }
                        }
                    }
                }
            } else {
                //沒勾選->比對
                if (this.state.checked === false) {
                    let content = Object.values(data);
                    //沒勾地區篩選就是只比對技能
                    let content1 = content.filter(function (item, index, array) {
                        if (checkLocal === false) { //沒勾城市與區域
                            if (skill === item.skill1 || skill === item.skill2 || skill === item.skill3) {
                                
                                return item;
                            }
                        } else if (checkLocal === true) {//比區域
                            if ((skill === item.skill1 || skill === item.skill2 || skill === item.skill3)) {
                                if (city === item.city && district === item.district) {
                                    
                                    return item;
                                } else if (city === item.city) {
                                   
                                    return item;
                                }
                            }
                        }
                    });
                    //取得比對到的人的uid
                    let content2 = content1.map(function (item, index, array) {
                        return item.user;
                    });
                    
                    content2 = content2.sort(function () {
                        return (0.5 - Math.random());
                    });
                    //如果content2有東西則賣方接收通知資料存到資料庫
                    if (content2.length !== 0 && content2.length < 10) {
                        //沒勾選，有比對到資料，但資料數小於10
                        for (i = 0; i < content2.length; i++) {//隨機抽10個
                            if (content2[i] !== firebase.auth().currentUser.uid) {//不能是自己
                                this.addNotification(content2[i]);
                                this.props.navigation.goBack();
                                
                            }
                        }
                    } else if (content2.length === 0) {
                        //若沒勾選最底下ㄉ，沒有比對到則進入MessageBoard
                        if (this.state.checkLocal === true) {//有比對地區
                            //警告可以不要比對地區
                            Alert.alert('警告', '不勾選地區篩選，可以加大搜索範圍。是否確定將地區設為必要篩選？', [
                                { text: '取消', onPress: () => console.log('点击取消') },
                                {
                                    text: '确定',
                                    onPress: () => {
                                        this.handleToMessageBoard();
                                        this.props.navigation.navigate('MessageBoardForSpeed');
                                    }
                                },
                            ]);
                            
                        } else {
                            //已經沒有比對地區，只能送入MessageBoard
                            this.handleToMessageBoard();
                            this.props.navigation.navigate('MessageBoardForSpeed');
                            
                        }
                    } else {
                        //若沒勾選，有比對到，資料數有10筆以上
                        for (i = 0; i < 10; i++) {//隨機抽10個
                            if (content2[i] !== firebase.auth().currentUser.uid) {//不能是自己
                                this.addNotification(content2[i]);
                                this.props.navigation.goBack();
                                
                            }
                        }
                    }
                    //notification
                    //用uid為首push進入
                    //console.log(content2);
                } else {
                    //已經有資料且有勾選(大家都有機會發送)
                    let content5 = Object.values(data);
                    let content6 = content5.map(function (item, index, array) {
                        return item.user;
                    });
                    content6 = content6.sort(function () {
                        return (0.5 - Math.random());
                    });
                    if (content6.length !== 0 && content6.length < 10) {
                        //已經有資料，但<10筆
                        for (i = 0; i < content6.length; i++) { //隨機抽10個
                            if (content6[i] !== firebase.auth().currentUser.uid) {//不能是自己
                                this.addNotification(content6[i]);
                                this.props.navigation.goBack();
                                
                            }
                        }
                    } else {
                        //若>10
                        for (i = 0; i < 10; i++) { //隨機抽10個
                            if (content6[i] !== firebase.auth().currentUser.uid) {//不能是自己
                                this.addNotification(content6[i]);
                                this.props.navigation.goBack();
                                
                            }
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
    searchFilterFunction = text => {
        if (text === '' || text === null) {
            this.setState({ res: [] });
        } else {
            //抓資料
            let arrayData = [];
            for (i = 0; i < this.state.allData.length; i++) {
                let content = this.state.allData[i];
                let skill1 = content.skill1;
                let skill2 = content.skill2;
                let skill3 = content.skill3;
                if (skill1 !== undefined) {
                    arrayData.push(skill1);
                }
                if (skill2 !== undefined) {
                    arrayData.push(skill2);
                }
                if (skill3 !== undefined) {
                    arrayData.push(skill3);
                }
            }
            //拿掉重複的
            var takeOutRepeat = arrayData.filter(function (element, index, arr) {
                return arr.indexOf(element) === index;
            });
            let res = [];
            for (i = 0; i < takeOutRepeat.length; i++) {
                res.push({ skill: takeOutRepeat[i] });
            }
            const newData =
                res.filter(item => {//傳出陣列
                    if (item.skill !== undefined) {
                        const itemSkill = item.skill.toUpperCase();
                        const textData = text.toUpperCase();
                        return itemSkill.indexOf(textData) > -1;//有比對到就是false
                    }
                });
            var result = Array.from(new Set(newData));
            this.setState({
                res: result,
            });
        }
    };

    //項目與需求欄位為必填
    requiredItems = (skill) => {
        if (this.state.skill.trim() === '') {
            Alert.alert('警告', '請檢查選項是否都填入完畢');
            this.setState({ requiredSkill: false });
        }
        if (this.state.description.trim() === '') {
            Alert.alert('警告', '請檢查選項是否都填入完畢');
            this.setState({ requiredDescription: false });
        }
        if (this.state.dateTxt.trim() === '') {
            Alert.alert('警告', '請檢查選項是否都填入完畢');
            this.setState({ requiredDateTxt: false });
        }
        if (this.state.dateTxt1.trim() === '') {
            Alert.alert('警告', '請檢查選項是否都填入完畢');
            this.setState({ requiredDateTxt: false });
        }
        //地區必填
        if (this.state.selectedCity.value === undefined) {
            Alert.alert('警告', '請檢查選項是否都填入完畢');
            this.setState({ requiredLocation: false });
        }
        if (this.state.selectedDistrict.value === undefined) {
            Alert.alert('警告', '請檢查選項是否都填入完畢');
            this.setState({ requiredLocation: false });
        }
        if (this.state.price === '') {
            Alert.alert('請檢查選項是否都填入完畢');
            this.setState({ requiredPrice: false });
        }
        //若都有資料則傳遞
        if (this.state.skill.trim() !== '' && this.state.description.trim() !== '' &&
            this.state.dateTxt.trim() !== '' && this.state.dateTxt1.trim() !== '' &&
            this.state.selectedCity.value !== undefined && this.state.selectedDistrict.value !== undefined &&
            this.state.price.trim() !== ''
        ) {
            //沒勾則比對
            //抓出有比對到的組成
            //不用估價
            //有勾抓全部
            //存資料到哪
            //1. 存到MessageBoard
            this.findEarner(this.state.skill, this.state.selectedCity.value, this.state.selectedDistrict.value, this.state.checkLocal)
        }
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
                        <Title>快速選單</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>

                    <Form>
                        <View>
                            <Item floatingLabel>
                                {this.state.requiredSkill ?
                                    <Label>欲解決事情種類</Label>
                                    :
                                    <Label style={{ color: 'red' }}>欲解決事情種類</Label>
                                }
                                <Input
                                    maxLength={18}
                                    value={this.state.skill}
                                    onChangeText={(skill) => {
                                        this.searchFilterFunction(skill)
                                        this.setState({ skill: skill });
                                    }}
                                />
                            </Item>

                            <FlatList
                                data={
                                    this.state.res
                                }
                                horizontal={true}
                                renderItem={({ item }) => (
                                    <ListItem
                                        title={item.skill}
                                        onPress={() => {
                                            this.setState({ skill: item.skill, res: [] });
                                        }}
                                    />
                                )}
                                keyExtractor={item => item.skill}//每個skill只會出現一次
                            // ItemSeparatorComponent={this.renderSeparator}
                            // ListHeaderComponent={this.renderHeader}
                            />
                        </View>
                        <Item floatingLabel>
                            {this.state.requiredPrice ?
                                <Label>價格</Label>
                                :
                                <Label style={{ color: 'red' }}>價格</Label>
                            }
                            <Input
                                keyboardType='numeric'
                                value={this.state.price}
                                onChangeText={(value) => { this.setState({ price: value }); }}
                            />
                        </Item>
                    </Form>

                    <Card transparent style={{ alignItems: 'center', paddingTop: 10 }}>
                        {this.state.requiredDateTxt ?
                            <Label>上班時間</Label>
                            :
                            <Label style={{ color: 'red' }}>上班時間</Label>
                        }

                        {
                            this.state.hasChangedS ?
                                <CardItem>
                                    <Button onPress={() => this.setState({ isOpen: true })} title={this.state.dateTxt} />
                                </CardItem>
                                :
                                <CardItem>
                                    <Button onPress={() => this.setState({ isOpen: true })} title="-------" />
                                </CardItem>
                        }
                        {
                            this.state.hasChangedL ?
                                (this.state.hasChangedW ?
                                    <CardItem>
                                        <Button onPress={() => this.setState({ isOpen1: true })} title={this.state.dateTxt1} />
                                    </CardItem>
                                    :
                                    <CardItem>
                                        <Button onPress={() => this.setState({ isOpen1: true })} title="--------" />
                                    </CardItem>
                                )
                                :
                                <Button disabled={true} onPress={() => this.setState({ isOpen1: true })} title="-------" />
                        }

                        {this.state.requiredLocation ?
                            <Label style={{ alignSelf: 'center' }}>地區</Label>
                            :
                            <Label style={{ alignSelf: 'center', color: 'red' }}>地區</Label>
                        }
                        <CardItem>
                            <Dropdown {...city}
                                onSelect={this._onSelectCity.bind(this)}//選擇
                                onShow={this._onShowCity.bind(this)}//model
                                isShowingOptions={this.state.isShowingCity}
                                selectedOption={this.state.selectedCity}
                            />
                        </CardItem>
                        <CardItem>
                            <Dropdown {...this.state.show[0].dropdown}
                                onSelect={this._onSelectDistrict.bind(this)}//選擇
                                onShow={this._onShowDistrict.bind(this)}//model
                                isShowingOptions={this.state.isShowingDistrict}
                                selectedOption={this.state.selectedDistrict}
                            />
                        </CardItem>
                        {this.state.checked ?
                            <View></View>
                            :
                            <CardItem>
                                <CheckBox
                                    checked={this.state.checkLocal}
                                    onPress={() => this.setState({ checkLocal: !this.state.checkLocal })}
                                />
                                <Label>是否將地區設為篩選條件</Label>
                            </CardItem>
                        }
                    </Card>

                    <Modal coverScreen isOpen={this.state.isOpen} onClosed={() => this.setState({ isOpen: false })} style={styles.modal4} position={"center"} >
                    {Platform.OS === 'ios' ? 
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
                                    month = '0' + month
                                }
                                if (date1 < 10) {
                                    date1 = '0' + date1
                                }
                                if (hour < 10) {
                                    hour = '0' + hour
                                }
                                if (mins < 10) {
                                    mins = '0' + mins
                                }
                                console.log(d)

                                var s = year + '-' + month + '-' + date1 + ' ' + hour + ':' + mins;
                                this.setState({ dateTxt: s, hasChangedS: true, hasChangedL: true, minD: d, dateTxt1: '--------' });
                            }} />
                            :
                            <DateTimePicker mode="time" value={new Date()} />
                        }
                        <Button onPress={() => this.setState({ isOpen: false })} style={[styles.btn, styles.btnModal]} title='確認' />
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
                                    month = '0' + month
                                }
                                if (date1 < 10) {
                                    date1 = '0' + date1
                                }
                                if (hour < 10) {
                                    hour = '0' + hour
                                }
                                if (mins < 10) {
                                    mins = '0' + mins
                                }
                                var s = year + '-' + month + '-' + date1 + ' ' + hour + ':' + mins;
                                this.setState({ dateTxt1: s, hasChangedW: true, });
                            }} />
                           
                        <Button onPress={() => this.setState({ isOpen1: false })} style={[styles.btn, styles.btnModal]} title="確認" />
                    </Modal>

                    <View style={{ paddingLeft: 3 + '%', paddingRight: 15, paddingBottom: 10 }}>

                        <Form>
                            <Item>
                                {this.state.requiredDescription ?
                                    <Label>備註</Label>
                                    :
                                    <Label style={{ color: 'red' }}>備註</Label>
                                }
                                <View style={{ flex: 1 }}>
                                    <Textarea
                                        onChangeText={(description) => {
                                            this.setState({
                                                description
                                            })
                                        }}
                                        rowSpan={9} bordered placeholder='請在此詳細說明您的需求，以便快速、準確的找到應徵者（此欄必填）' />
                                </View>
                            </Item>
                        </Form>
                    </View>
                    <Card>
                        <CardItem style={styles.text1}>
                            <CheckBox
                                //title={<Button title='若勾選代表只要有時間皆能勝任' />}
                                checked={this.state.checked}
                                onPress={() => this.setState({ checked: !this.state.checked, checkLocal: false })}
                            />
                            <Text   style={styles.text1}>若勾選將為您寄送工作單至所有鄰近使用者
(包含非專業技能者)</Text>
                        </CardItem>
                    </Card>
                    <View style={{ marginBottom: 15, marginTop: 15, }}>
                        <TouchableHighlight
                            onPress={() => {
                                this.requiredItems(this.state.skill);
                            }}>
                            <View style={{
                                width: 80 + '%',
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
                </Content>
            </Container>
        );
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
                    selectedDistrict: '',
                });
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
    },
    text1:{
        padding:5,
    }

});

