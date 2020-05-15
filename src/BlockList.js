import React, { Component } from 'react';
import {
    Container,
    Header,
    Content,
    Left,
    Body,
    Title,
    Right,
} from 'native-base';
import {
    FlatList,
    Alert,
    View,
} from 'react-native';
import {
    ListItem,
    Icon,
} from 'react-native-elements';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage'
export default class BlockList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: [],
            text: true,
        }
    }
    componentDidMount() {
        firebase.database().ref('Block/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let data = snapshot.val();

            if (data === null) { } else {
                let content = Object.values(data);
                let newContent = content.filter(function(item,index,array){
                    if(item.name === undefined){
                        return ''
                    } else {
                        return item
                    }
                });
                this.setState({ arr: newContent });
            }
        });
    }
    componentWillUnmount() {
            this.setState = (state, callback) => {
                return;
            };
        }
    renderSeparator = () => {//分隔線
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#CED0CE',
                    //marginLeft: '14%',
                }}
            />
        );
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
                            }}
                        />
                    </Left>
                    <Body>
                        <Title>已封鎖</Title>
                    </Body>
                    <Right />
                </Header>
                <Container>
                    <FlatList
                        data={this.state.arr}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                        renderItem={({ item }) => (
                            <ListItem
                                onLongPress={() => {
                                    Alert.alert('提醒', '解除封鎖', [{
                                        text: '取消'
                                    }, {
                                        text: '確定', onPress: () => {
                                            firebase.database().ref('Block/' + firebase.auth().currentUser.uid + '/' + item.blockId).remove();
                                            firebase.database().ref('Block/' + item.blockId + '/' + firebase.auth().currentUser.uid).remove();
                                            this.setState({ test: false });
                                        }
                                    }]);
                                }}
                                //onPress={() => { this.props.navigation.navigate('Chat', { otherUserId: item.uid }) }}//這裡有錯
                                title={item.name}
                            // rightTitle={this.renderTime(item.createdAt)}
                            // subtitle={item.text}
                            />
                        )}
                        //
                        keyExtractor={item => item.blockId}
                        ItemSeparatorComponent={this.renderSeparator}

                    />
                </Container>
            </Container>
        );
    }
} 
