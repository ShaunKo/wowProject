import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    Platform,
    Button,
    View,
    TouchableOpacity,
} from 'react-native';
import {
    Avatar,
} from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import SyanImagePicker from 'react-native-syan-image-picker';


export default class HeadShot extends Component {
    constructor(props) {
        super(props)
        //this.getImage = this.getImage.bind(this)
        this.state = {
            //image_uri: '',
            //imgSource: '',//物件
            imageUri: 'https://www.google.com.tw/',
            //avatar: '',//http://
            photos: [],//多選照片
            photoUri: [],
            //httpurl:'',
            base: [],//照片base64字串
        }
    }

    componentDidMount() {
       //從db抓大頭貼
       firebase.database().ref('Personal/' + firebase.auth().currentUser.uid).once('value',(snapshot)=>{
            let data = snapshot.val();
            let imageUri = data.avatarUrl;
            this.setState({ imageUri :imageUri });
       });
    }
    componentWillUnmount() {
            this.setState = (state, callback) => {
                return;
            };
        }
    updateAvatarUrl = (url) => {
        firebase.database().ref('Personal/' + firebase.auth().currentUser.uid ).update({
            avatarUrl:url,
        });
    }
    //加入storage 然後取出url裝進db
    addAvatar = async (message) => {
        const ref = firebase.storage().ref('Avatar/' + firebase.auth().currentUser.uid );
        ref.putString(message[0] , 'data_url').then(function (snapshot) {
            //console.log('Uploaded a base64 string!');
        });
        const url = await ref.getDownloadURL();
        //裝進db
        this.updateAvatarUrl(url);
    }
 
    getImage = () => {
        //options 是選擇設定
        SyanImagePicker.asyncShowImagePicker({
            imageCount: 1,//選擇照片數量
            isRecordSelected: false,//不要紀錄上一次選擇的照片
            //isCrop: true,//是否允許裁減（單選才能裁減）
            //showCropCircle: true,//是否圓形裁減
            quality: 0.1,
            compress: true,
            enableBase64: true,
            //minimumCompressSize:10,
            freeStyleCropEnabled: true,
        })
            .then(photos => {
                // 選擇成功
                //console.log('成功');
                let photoUri = photos.map(function (item, index, array) {
                    return item.uri;
                });
                let base = photos.map(function (item, index, array) {
                    return item.base64;
                });
                //console.log(photos)
                this.setState({
                    photos: [...this.state.photos, ...photos],
                    photoUri,
                    base,
                });
                this.setState({imageUri : photoUri[0]})
                this.addAvatar(base);
            })
            .catch(err => {
                // 取消选择，err.message为"取消"
                //console.log('取消選擇');
            });
    };
    render() {
        return (
            <TouchableOpacity
                onPress={
                    this.getImage
                }>
                <View>
                    <Avatar
                        size='large'
                        rounded
                        source={{
                            uri: this.state.imageUri
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}
