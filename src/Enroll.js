import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    Alert,
} from 'react-native';
import {
    Container,
    Content,
    Header,
    Right,
    Left,
    Body,
    Title,
    Item,
    Input,
    Picker,
    Form,
    Label,
    Card,
    CardItem,
} from 'native-base';
import {
    Icon,
    CheckBox,
} from 'react-native-elements';
import Dropdown from 'react-native-modal-select-option';
import { city } from './Location.js';
import { district } from './Location.js';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import '@react-native-firebase/messaging';

let addData = (name, email, password, phoneNumber, gender, myCoin, donate, avatarUrl, token, city, district,finishedJob) => {
    firebase.database().ref('Personal/' + firebase.auth().currentUser.uid).set({
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        gender: gender,
        //blockList(可放在sqllite)
        //前一個月
        myCoin: myCoin,//我的wow幣
        donate: donate,//我捐出的wow幣
        avatarUrl: avatarUrl,//我的大頭貼
        token: token,
        city: city,
        district: district,
        finishedJob:finishedJob,
    });
}
export default class Enroll extends Component {
    //要先驗證完手機再送資料庫
    constructor(props) {
        super(props);
        this.state = {
            selectedCity: '',
            isShowingCity: false,
            selectedDistrict: '',
            isShowingDistrict: false,
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
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            collection: 0,
            phoneNumber: '',
            checked: true,
            selected: undefined,
            message: '',
            token: '',//push notification token
            finishedJob:0,//完成工作數量
            //naData: [],
        };
    }
    //地區======
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
    //======
    handleAddData = () => {
        addData(
            this.state.name,
            this.state.email,
            this.state.password,
            this.state.phoneNumber,
            this.state.gender,
            5,//我的wow幣
            0,//我捐出的wow幣
            'https://www.google.com.tw',
            this.state.token,
            this.state.selectedCity.value,//加入地區
            this.state.selectedDistrict.value,
            0,
        );
    }
    componentDidMount(){
        this.checkPermission();
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    addToSkill = () => {
        firebase.database().ref('Skill/' + firebase.auth().currentUser.uid ).set({
            user: firebase.auth().currentUser.uid,
            city: this.state.selectedCity.value,//加入地區
            district: this.state.selectedDistrict.value,
        });
    }
    //push notification===========================
    getToken = async () => {
        fcmToken = await firebase.messaging().getToken();
        this.setState({ token: fcmToken });
        //console.log(fcmToken);
    };
    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            this.getToken();
        } catch (error) {
            //console.log('permission rejected', error);
        }
    };
    checkPermission = async () => {
        const isRegisteredForRemoteNotifications = firebase.messaging().isRegisteredForRemoteNotifications;
        //await firebase.messaging().requestPermission();
        const enabled = await firebase.messaging().hasPermission();
        if (enabled && isRegisteredForRemoteNotifications) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    };
    //======================================
    checkPasssword = (password, name, phoneNumber) => {
        firebase.database().ref('Personal/').once('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) {
                //signIn+上傳
                this.signIn();
                //this.handleAddData();
            } else {
                let content = Object.values(data);
                let isUsedName = content.some(function (item, index, array) {
                    return item.name === name;
                });
                let isUsed = content.some(function (item, index, array) {
                    return item.password === password;
                });
                let isUsedPhone = content.some(function (item, index, array) {
                    return item.phoneNumber === phoneNumber;
                });
                // console.log(isUsed);
                // console.log(isUsedName);
                //return isUsed;
                if (isUsedName) {
                    Alert.alert('警告', '該名稱已被使用', [{ text: '確定' }]);
                } else {
                    if (isUsed) {
                        Alert.alert('警告', '該密碼已被使用', [{ text: '確定' }]);
                    } else {
                        if (isUsedPhone) {
                            Alert.alert('警告', '此號碼已被使用', [{ text: '確定' }]);
                        } else {
                            //signin+上傳
                            this.signIn();
                            //this.handleAddData();
                        }
                    }
                }
            }
        });
    }

    signIn = () => {
        const { phoneNumber } = this.state;
        this.setState({ message: '正在寄送驗證碼...' });
        phoneNumber.replace('0', '');
        firebase.auth().signInWithPhoneNumber('+886' + phoneNumber)
            .then(confirmResult => this.setState({ confirmResult, message: '驗證碼已寄出!' }))
            .catch(error => Alert.alert('驗證碼未寄出', '請確認手機號碼是否填寫正確')//this.setState({ message: '' })
            );
    };
    confirmCode = () => {
        const { codeInput, confirmResult } = this.state;
        if (confirmResult && codeInput.length) {
            confirmResult.confirm(codeInput)
                .then((user) => {
                    this.setState({ message: '確認' });
                    this.handleAddData();
                    this.addToSkill();
                    this.props.navigation.navigate('Index');
                })
                .catch((error) => {
                    this.setState({ message: '驗證碼輸入錯誤' });
                });
        }
    };
    onValueChange(value) {
        this.setState({
            selected: value,
        });
    }
    renderVerificationCodeInput() {
        const { codeInput } = this.state;
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
                        <Title>註冊</Title>
                    </Body>
                    <Right />
                </Header>
                <Form style={styles.form}>
                    <Item floatingLabel>
                        <Label>手機驗證碼</Label>
                        <Input
                            placeholder='請輸入您的手機驗證碼'
                            onChangeText={value => this.setState({ codeInput: value })}
                            keyboardType='numeric'
                            value={codeInput}
                            style={styles.inputStyle}
                        />
                    </Item>
                </Form>
                <Button title='確認手機驗證碼' color='#85A5FF' onPress={() => {
                    this.confirmCode();
                }} />

            </Container>
        );
    }
    renderMessage() {
        const { message } = this.state;
        if (!message.length) { return null; }
        return (
            <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
        );
    }
    renderPhoneNumberInput() {
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
                        <Title>註冊</Title>
                    </Body>
                    <Right>
                        <Button
                            title='確認'
                            onPress={() => {
                                if (this.state.name.length > 15) {
                                    Alert.alert('警告', '姓名不得超過15個字元', [{ text: '確定' }]);
                                } else if (this.state.name === '') {
                                    Alert.alert('警告', '欄位不得為空', [{ text: '確定', onPress: () => console.log('come') }]);
                                } else if (this.state.email === '') {
                                    Alert.alert('警告', '欄位不得為空', [{ text: '確定', onPress: () => console.log('come') }]);
                                } else if (this.state.email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/) !== 0) {
                                    Alert.alert('警告', 'email格式不符', [{ text: '確定' }]);
                                } else if (this.state.password === '' || this.state.password.length <= 6 || this.state.password.length >= 15) {
                                    Alert.alert('警告', '欄位不得為空，必須至少6個字元，最多15個字元', [{ text: '確定' }]);
                                }
                                else if (this.state.password !== this.state.confirmPassword) {
                                    Alert.alert('警告', '請檢查密碼是否一致', [{ text: '確定' }]);
                                }
                                else if (this.state.phoneNumber === '') {
                                    Alert.alert('警告', '欄位不得為空', [{ text: '確定' }]);
                                } else if (this.state.phoneNumber.search(/^09[0-9]{8}$/) != 0) {
                                    Alert.alert('警告', '請輸入正確的手機號碼', [{ text: '確定' }]);
                                }
                                else if (this.state.selectedCity.value === undefined) {
                                    Alert.alert('警告', '所在城市尚未填入');
                                }
                                else if (this.state.selectedDistrict.value === undefined) {
                                    Alert.alert('警告', '所在地區尚未填入');
                                }
                                //性別
                                else if (this.state.selected === undefined) {
                                    Alert.alert('警告', '請選擇性別', [{ text: '確認' }]);
                                }
                                else if (this.state.checked === false) {
                                    Alert.alert('警告', '請詳閱使用條款', [{ text: '確定' }]);
                                }
                                //看最後的navigation
                                else {
                                    this.checkPasssword(this.state.password, this.state.name, this.state.phoneNumber);
                                }
                            }} />
                    </Right>

                </Header>
                <Content>
                    <Form>
                        <Text style={styles.title}>姓名</Text>
                        <Item>
                            <Input
                                placeholder='請輸入您的姓名'
                                onChangeText={(name) => this.setState({ name })}
                                value={this.name}
                                autoCapitalize='none'
                                style={styles.inputStyle}
                            />
                        </Item>
                        <Text style={styles.title}>電子信箱</Text>
                        <Item>
                            <Input
                                placeholder='請輸入您的電子信箱'
                                autoCapitalize='none'
                                keyboardType='email-address'
                                onChangeText={(email) => this.setState({ email })}
                                value={this.email}
                                style={styles.inputStyle}
                            />
                        </Item>
                        <Text style={styles.title}>密碼</Text>
                        <Item>
                            <Input
                                placeholder='請輸入您的密碼'
                                secureTextEntry={true}
                                autoCapitalize='none'
                                onChangeText={(password) => this.setState({ password })}
                                value={this.password}
                                style={styles.inputStyle}
                            />
                        </Item>
                        <Text style={styles.title}>確認密碼</Text>
                        <Item>
                            <Input
                                placeholder='請再次輸入您的密碼'
                                secureTextEntry={true}
                                autoCapitalize='none'
                                onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                                value={this.confirmPassword}
                                style={styles.inputStyle}
                            />
                        </Item>
                        <Text style={styles.title}>手機號碼</Text>
                        <Item>
                            <Input
                                placeholder='請輸入您的手機號碼'
                                onChangeText={(phoneNumber) => this.setState({ phoneNumber: phoneNumber })}
                                //onChangeText={value => this.setState({ phoneNumber: value })}
                                keyboardType='numeric'
                                //value={this.phoneNumber}
                                value={this.state.phoneNumber}
                                style={styles.inputStyle}
                            />
                        </Item>
                    </Form>
                    <Text style={styles.title}>生理性別</Text>
                    <Form style={{ backgroundColor: 'white', width: 30 + "%", alignSelf: "center", borderRadius: 10 }}>
                        <Picker
                            mode='dropdown'
                            placeholder='選擇'
                            placeholderStyle={{ color: 'orange' }}
                            note={false}
                            selectedValue={this.state.selected}//選擇到的顯示label
                            onValueChange={this.onValueChange.bind(this)}
                        >
                            <Picker.Item label='男' value='male' />
                            <Picker.Item label='女' value='female' />
                        </Picker>
                    </Form>
                    <Text style={styles.title}>地區</Text>
                    <Form style={{ alignSelf : 'center'}}>
                    <Item>
                            <Dropdown {...city}
                                onSelect={this._onSelectCity.bind(this)}//選擇
                                onShow={this._onShowCity.bind(this)}//model
                                isShowingOptions={this.state.isShowingCity}
                                selectedOption={this.state.selectedCity}
                            />
                        </Item>
                        <Item>
                            <Dropdown {...this.state.show[0].dropdown}
                                onSelect={this._onSelectDistrict.bind(this)}//選擇
                                onShow={this._onShowDistrict.bind(this)}//model
                                isShowingOptions={this.state.isShowingDistrict}
                                selectedOption={this.state.selectedDistrict}
                            />
                        </Item>
                        </Form>
                        <View style={styles.checkBox}>
                    <CheckBox
                        title={
                            <Button
                                title='同意使用條款|隱私與保護政策'
                                onPress={() => { this.props.navigation.navigate('AboutCompany'); }}
                            />}
                        checked={this.state.checked}
                        onPress={() => this.setState({ checked: !this.state.checked })}
                    />
                    </View>
                </Content>
            </Container>
        );
    }
    render() {
        const { user, confirmResult } = this.state;
        return (
            <View style={{ flex: 1 }}>
                {!user && !confirmResult && this.renderPhoneNumberInput()}
                {this.renderMessage()}
                {!user && confirmResult && this.renderVerificationCodeInput()}
                {user}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        marginLeft: 10,
        fontSize: 18,
        //paddingTop:5
        alignSelf: 'flex-end',
        marginRight: 10,
        marginTop: 5,
    },
    inputStyle: {
        borderBottomColor: '#FFDD55',
        borderBottomWidth: 1,
    },
    checkBox:{
        marginBottom:15,
        marginTop:10,
    },
});


