import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import {
    Icon,
    Badge,
} from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class IconWithBadge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //isZero:false,
            number: 0,
        };
    }

    componentDidMount() {
        firebase.database().ref('badgeForBell/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
            let data = snapshot.val();
            if (data === null) { } else {
                let number = data.number;
                this.setState({ number: number });
            }
        });
    }
    componentWillUnmount() {
            this.setState = (state, callback) => {
                return;
            };
        }
    //badge歸零
    removeBadge = () => {
        firebase.database().ref('badgeForBell/' + firebase.auth().currentUser.uid).update({
            number:0,
        });
    }
    render() {
        const { name, color } = this.props;
        return (
            <View>
                {this.state.number === 0 || this.state.number === null ?
                    <Icon name='notifications' size={25} color={color} />
                    :
                    <View>
                        <View>
                            <Badge
                                status='success'
                                value={this.state.number}
                                containerStyle={{ position: 'absolute', top: -5, right: -13 }}
                            >
                            </Badge>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                //按下歸零number
                                this.removeBadge();
                            }}
                        >
                            <Icon name='notifications' size={25} color={color} onPress={() => {
                                //按下歸零number
                                //firebase.database().ref('badgeForBell/' + firebase.auth().currentUser.uid).remove();
                            }} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
} 