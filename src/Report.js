import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Button,
} from 'react-native';
import {
    Left,
    Right,
    Container,
    Header,
    Body,
    Title,
    Textarea,
    Label,
} from 'native-base';
import {
    Icon,
} from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
export default class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasReport1: true,
            hasReport2: true,
            //hasReport3: true,
            report1: '',//檢舉內容
            report2: '',
            //report3:'',
            reportDescription: '',
            uid: undefined,
        }
    }
    componentDidMount() {
        const { state: { params: { uid }, goBack } } = this.props.navigation;
        this.setState({ uid })
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
                            }}
                        />
                    </Left>
                    <Body>
                        <Title>檢舉</Title>
                    </Body>
                    <Right>
                        <Button
                            title='檢舉'
                            onPress={() => {
                                if (this.state.report1 !== null && this.state.report2 !== null && this.state.reportDescription !== null) {
                                    firebase.database().ref('Report').push({
                                        //別人的uid
                                        //report 內容
                                        //description
                                        report1: this.state.report1,
                                        report2: this.state.report2,
                                        //report3: this.state.report3,
                                        description: this.state.reportDescription,
                                        uid: this.state.uid,
                                    });
                                    this.props.navigation.goBack();
                                }
                            }}
                        />
                    </Right>
                </Header>
                <View style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>
                    <Text style={{ color: '#AAAAAA' }}>
                        被舉報者，如經查證屬實，本公司將直接移除該使用者的該項工作技能，嚴重者將被本公司直接請出App，並保留法律追溯權。
                        請妥善運用檢舉功能，如經發現濫用此功能，您的帳號可能會被關閉。
                    </Text>
                </View>
                {this.state.hasReport1 ?
                    <TouchableOpacity
                        style={{ marginTop: 20 }}
                        onPress={() => {
                            this.setState({ hasReport1: false, report1: '含有血腥、色情、暴力內容' })
                        }}>
                        <View style={{
                            width: 80 + '%',
                            height: 50,
                            borderRadius: 50,
                            borderColor: '#ff7454',
                            borderWidth: 1,
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}>
                            <Text style={{ color: '#ff7454', fontSize: 17, letterSpacing: 10 }}>含有血腥色情暴力內容</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={{ marginTop: 20 }}
                        onPress={() => {
                            this.setState({ hasReport1: true, report1: undefined })
                        }}>
                        <View style={{
                            width: 80 + '%',
                            height: 50,
                            borderRadius: 50,
                            justifyContent: 'center',
                            backgroundColor: '#ff7454',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}>
                            <Text style={{ color: 'white', fontSize: 17, letterSpacing: 10 }}>含有血腥色情暴力內容</Text>
                        </View>
                    </TouchableOpacity>
                }
                {this.state.hasReport2 ?
                    <TouchableOpacity
                        style={{ marginTop: 20 }}
                        onPress={() => {
                            this.setState({ hasReport2: false, report2: '涉及言語辱罵' })

                        }}>
                        <View style={{
                            width: 80 + '%',
                            height: 50,
                            borderRadius: 50,
                            borderColor: '#ff7454',
                            borderWidth: 1,
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}>
                            <Text style={{ color: '#ff7454', fontSize: 17, letterSpacing: 10 }}>涉及言語辱罵</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={{ marginTop: 20 }}
                        onPress={() => {
                            this.setState({ hasReport2: true, report2: undefined })
                        }}>
                        <View style={{
                            width: 80 + "%",
                            height: 50,
                            borderRadius: 50,
                            justifyContent: 'center',
                            backgroundColor: '#ff7454',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}>
                            <Text style={{ color: 'white', fontSize: 17, letterSpacing: 10 }}>涉及言語辱罵</Text>
                        </View>
                    </TouchableOpacity>
                }
                {/* {this.state.hasReport3 ?
                    <TouchableOpacity
                        style={{ marginTop: 20 }}
                        onPress={() => {
                            this.setState({ hasReport3: false, report3: '涉及言語辱罵' })

                        }}>
                        <View style={{
                            width: 80 + "%",
                            height: 50,
                            borderRadius: 50,
                            borderColor: '#ff7454',
                            borderWidth: 1,
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}>
                            <Text style={{ color: '#ff7454', fontSize: 17, letterSpacing: 10 }}>工作與分類不符</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={{ marginTop: 20 }}
                        onPress={() => {
                            this.setState({ hasReport3: true, report3: '' })
                        }}>
                        <View style={{
                            width: 80 + '%',
                            height: 50,
                            borderRadius: 50,
                            justifyContent: 'center',
                            backgroundColor: '#ff7454',
                            alignItems: 'center',
                            alignSelf: 'center'
                        }}>
                            <Text style={{ color: 'white', fontSize: 17, letterSpacing: 10 }}>工作與分類不符</Text>
                        </View>
                    </TouchableOpacity>
                } */}
                <Textarea
                    onChangeText={(reportDescription) => {
                        this.setState({
                            reportDescription
                        })
                    }}
                    rowSpan={3} bordered placeholder='其他' maxLength={50} style={{
                        marginTop: 20, marginBottom: 20, width: 80 + '%', alignItems: 'center', borderRadius: 20,
                        alignSelf: 'center', borderColor: '#ff7454'
                    }} />
            </Container>
        );
    }
}