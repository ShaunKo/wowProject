import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import {
    Container,
    Header,
    Left,
    Right,
    Body,
    Title,
    Textarea,
    Content,
    Card,
    CardItem,
    Input,
    Label,
    Item,
} from 'native-base';
import {
    Icon,
    ListItem,
} from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
//think: user ID 與 地區 可以在Enroll 加入

//=======================================================
//一個人三份工作
let addSkill1 = (skill) => {
    firebase.database().ref('Skill/' + firebase.auth().currentUser.uid).update({
        skill1: skill,
    });
}
let addSkill2 = (skill) => {
    firebase.database().ref('Skill/' + firebase.auth().currentUser.uid).update({
        skill2: skill,
    });
}
let addSkill3 = (skill) => {
    firebase.database().ref('Skill/' + firebase.auth().currentUser.uid).update({
        skill3: skill,
    });
}

//=======================================================
export default class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //skill: '',
            res: [],//去掉重複後的資料
            allData: [],//資料庫抓下來的所有資料
            text1: null,
            text2: null,
            text3: null,
            textarea:null,
            number: '',//第幾分技能
            open: true,//展開技能填寫
            open2: true,
            open3: true,
            skill1: '',
            skill2: '',
            skill3: '',
            city: '',
            district:'',
        }
    }
    //先抓所有技能
    //刪掉重複技能
    //依字比對
    //有的話就更新資料丟入FlatList
    componentDidMount() {
        //抓出所有人的所有技能
        firebase.database().ref('Skill/').on('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) { } else {
                let content = Object.values(data);
                this.setState({ allData: content });//所有人的技能（包含skill1,skill2,skill3）
            }
        });
        //抓地區
        firebase.database().ref('Personal/' + firebase.auth().currentUser.uid ).once('value',(snapshot)=>{
            let data = snapshot.val();
            let city = data.city;
            let district = data.district;
            this.setState({ city : city, district : district });
        });
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    //加入個人的第一個技能
    handleAddSkill1 = (text) => {
        addSkill1(
            text,
        );
    }
    handleAddSkill2 = (text) => {
        addSkill2(
            text,
        );
    }
    handleAddSkill3 = (text) => {
        addSkill3(
            text,
        );
    }
    handleTextarea = () => {
        firebase.database().ref('Personal/' + firebase.auth().currentUser.uid).update({
            pInfo: this.state.textarea,
        });
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
                        <Title>編輯</Title>
                    </Body>
                    <Right>
                        <Icon
                            name='save'
                            color='#85A5FF'
                            onPress={() => {
                                if (this.state.text1 !== null) {
                                    this.handleAddSkill1(this.state.text1);
                                    this.setState({ text1: '' });
                                }
                                if (this.state.text2 !== null) {
                                    this.handleAddSkill2(this.state.text2);
                                    this.setState({ text2: '' });
                                } if (this.state.text3 !== null) {
                                    this.handleAddSkill3(this.state.text3);
                                    this.setState({ text3: '' });
                                }
                                if (this.state.textarea !== null ){
                                    this.handleTextarea();
                                    this.setState({ textarea: '' });
                                }
                                //加入user Id 
                                // firebase.database().ref('Skill/' + firebase.auth().currentUser.uid ).update({
                                //     user : firebase.auth().currentUser.uid,
                                //     city : this.state.city,
                                //     district: this.state.district,
                                // });
                                this.props.navigation.goBack();
                            }}
                        />
                    </Right>
                </Header>
                    <Content>
                        <Card style={{ flexDirection: 'row' }}>
                            <CardItem style={{ flex: 1 }}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => { this.setState({ number: 1, open: !this.state.open, open2: true, open3: true }); }}
                                >
                                    <Label>技能1</Label>
                                </TouchableOpacity>
                            </CardItem>
                            <CardItem style={{ flex: 1 }}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => { this.setState({ number: 2, open2: !this.state.open2, open: true, open3: true, }); }}
                                >
                                    <Label>技能2</Label>
                                </TouchableOpacity>
                            </CardItem>
                            <CardItem style={{ flex: 1 }}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => { this.setState({ number: 3, open3: !this.state.open3, open: true, open2: true, }); }}
                                >
                                    <Label>技能3</Label>
                                </TouchableOpacity>
                            </CardItem>
                        </Card>
                        {this.state.open ?
                            <View></View>
                            :
                            <View>
                                <Card>
                                    <CardItem>
                                        <Label>技能1</Label>
                                        <Input
                                            maxLength={18}
                                            onChangeText={(text1) => {
                                                this.searchFilterFunction(text1);
                                                this.setState({ text1 });
                                            }}
                                            value={this.state.text1}
                                        />
                                    </CardItem>
                                </Card>
                                <FlatList
                                    data={
                                        this.state.res
                                    }
                                    horizontal={true}
                                    renderItem={({ item }) => (
                                        <ListItem
                                            title={item.skill}
                                            onPress={() => {
                                                this.setState({ text1: item.skill, res: [] });
                                            }}
                                        />
                                    )}
                                    keyExtractor={item => item.skill}//每個skill只會出現一次
                                    ItemSeparatorComponent={this.renderSeparator}
                                    ListHeaderComponent={this.renderHeader}
                                />
                            </View>
                        }
                        {this.state.open2 ?
                            <View></View>
                            :
                            <View>
                                <Card>
                                    <CardItem>
                                        <Label>技能2</Label>
                                        <Input
                                            maxLength={18}
                                            onChangeText={(text2) => {
                                                this.searchFilterFunction(text2);
                                                this.setState({ text2 });
                                            }}
                                            value={this.state.text2}
                                        />
                                    </CardItem>
                                </Card>
                                <FlatList
                                    data={
                                        this.state.res
                                    }
                                    horizontal={true}
                                    renderItem={({ item }) => (
                                        <ListItem
                                            title={item.skill}
                                            onPress={() => {
                                                this.setState({ text2: item.skill, res: [] });
                                            }}
                                        />
                                    )}
                                    keyExtractor={item => item.skill}//每個skill只會出現一次
                                    ItemSeparatorComponent={this.renderSeparator}
                                    ListHeaderComponent={this.renderHeader}
                                />
                            </View>
                        }
                        {this.state.open3 ?
                            <View></View>
                            :
                            <View>
                                <Card>
                                    <CardItem>
                                        <Label>技能3</Label>
                                        <Input
                                            maxLength={18}
                                            onChangeText={(text3) => {
                                                this.searchFilterFunction(text3);
                                                this.setState({ text3 });
                                            }}
                                            value={this.state.text3}
                                        />
                                    </CardItem>
                                </Card>
                                <FlatList
                                    data={
                                        this.state.res
                                    }
                                    horizontal={true}
                                    renderItem={({ item }) => (
                                        <ListItem
                                            title={item.skill}
                                            onPress={() => {
                                                this.setState({ text3: item.skill, res: [] });
                                            }}
                                        />
                                    )}
                                    keyExtractor={item => item.skill}//每個skill只會出現一次
                                    ItemSeparatorComponent={this.renderSeparator}
                                    ListHeaderComponent={this.renderHeader}
                                />
                            </View>
                        }
                        {/* } */}
                        <Card>
                            <CardItem style={styles.selfIntroduction}>
                                <View style={styles.selfIntroductionTitle}>
                                    <Label>個人簡介</Label>
                                </View>
                            </CardItem>
                            <CardItem>
                                <View style={styles.selfIntroductionTextarea}>
                                    <Textarea
                                        rowSpan={6}
                                        maxLength={250}
                                        onChangeText={(textarea) => {
                                            this.setState({ textarea });
                                        }}
                                        value={this.state.textarea}
                                        placeholder='個人簡介（250字）'
                                    />
                                </View>
                            </CardItem>
                        </Card>
                    </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    selfIntroduction: {
        flexDirection: 'row',
    },
    selfIntroductionTitle: {
        flex: 1,
    },
    selfIntroductionTextarea: {
        flex: 1,
        marginRight: 5,
        marginLeft: 5,
    },
});
