import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Clipboard,
    Button,
} from 'react-native';
import {
    Icon,
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
import Work from './Work.js';
import SelfIntroduction from './SelfIntroduction.js';
export default class Personal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clipboardContent: 'The state variable which contains Clipboard Content',
            skill1: '',
            skill2: '',
            skill3: '',
            name: '',//使用者名稱
            showToast: false,
            pInfo: '',//個人簡介
            keys: [''],//傳給下面ChatList時作為驗證block的對象
        };
    }
    componentDidMount() {
        //抓技能
        firebase.database().ref('Skill/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let data = snapshot.val();
            //console.log(data);
            if (data === null) { } else {
                let skill1 = data.skill1;
                let skill2 = data.skill2;
                let skill3 = data.skill3;
                this.setState({ skill1: skill1, skill2: skill2, skill3: skill3, });
            }
        });
        //抓名字
        //(不會修改的用once)
        firebase.database().ref('Personal/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let data = snapshot.val();
            let content = data.name;
            let pInfo = data.pInfo;
            this.setState({ name: content, pInfo: pInfo, });
        });
        //抓Block的資料傳下去到ChatList
        firebase.database().ref('Block/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) { } else {
                let keys = Object.keys(data);
                this.setState({ keys: keys });
            }
        });
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    logout = () => {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            //console.log('User Logged Out!');
            var user = firebase.auth().currentUser.uid
            //console.log(user);
        }).catch(function (error) {
            // An error happened.
            //console.log(error);
        });
    }
    writeToClipboard = async () => {
        Clipboard.setString(this.state.clipboardContent);
        //Alert.alert('已複製');
        Toast.show({
            text: '已複製',
            duration: 1000
        });
    };
    _workToPersonal(open) {
        this.setState({
            open: open,
        });
    }
    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Icon
                            name='exit-to-app'
                            color='#85A5FF'
                            onPress={() => {
                                Alert.alert('登出', '確定要登出？',
                                    [
                                        { text: '取消' },
                                        {
                                            text: '確定',
                                            onPress: () => {
                                                this.logout();
                                                this.props.navigation.navigate('Login');
                                            }
                                        }
                                    ]);
                            }} />
                    </Left>
                    <Body>
                        <Title>{this.state.name}</Title>
                    </Body>
                    <Right>
                        <Icon
                            name='chat'
                            color='#85A5FF'
                            onPress={() => { this.props.navigation.navigate('GroupChat', { blockKeys: this.state.keys }); }}
                        />
                    </Right>
                </Header>
                <Root>
                    <Content>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <HeadShot />
                            </View>
                            <View style={{ flex: 1, alignContent: 'center', paddingLeft: 10 }}>
                                <TouchableOpacity
                                    style={{ paddingBottom: 20 }}
                                    onPress={() => {
                                        this.props.navigation.navigate('PaymentsRecord');
                                    }}
                                >
                                    <View style={{
                                        width: 60 + '%',
                                        padding: 5,
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        backgroundColor: '#85A5FF',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                    }}>
                                        <Text style={{ color: 'white' }}>交易明細</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ paddingBottom: 20 }}
                                    onPress={() => {
                                        this.props.navigation.navigate('BlockList');
                                    }}
                                >
                                    <View style={{
                                        width: 60 + '%',
                                        padding: 5,
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        backgroundColor: '#85A5FF',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                    }}>
                                        <Text style={{ color: 'white' }}>封鎖清單</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Item>
                            <View style={styles.selfIntroductionTitleL}>
                                <Label style={{ fontSize: 20 }}>個人簡介</Label>
                            </View>
                            <View style={styles.selfIntroductionTitle}>
                                <Icon
                                    name='edit'
                                    color='#85A5FF'

                                    onPress={() => {
                                        this.props.navigation.navigate('Edit');
                                        //this.setState({skillBoard:!this.state.skillBoard})
                                    }}
                                />
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

                        {/*//暫時先不要
                         <Card style={{ flexDirection: 'row' }}>
                            <CardItem style={{ flex: 1 }}>
                                <Label>邀請碼</Label>
                            </CardItem>
                            <CardItem style={{ flex: 2 }}>
                                <Text>
                                    dfkdfslfskddsdfs
                        </Text>
                            </CardItem>
                            <CardItem style={{ flex: 1 }}>
                                <Button title='複製'
                                    onPress={
                                        this.writeToClipboard
                                    } />
                            </CardItem>
                        </Card> */}
                        <Card>

                            <CardItem>
                                <Text>{this.state.pInfo}</Text>
                            </CardItem>
                        </Card>
                    </Content>
                </Root>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    selfIntroductionTitle: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 15,
        marginBottom:7,
        marginTop:10,
    },
    selfIntroductionTitleL: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 15,
        marginBottom:7,
        marginTop:10,
    },
});
