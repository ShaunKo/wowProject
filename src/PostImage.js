import React,{Component} from 'react';
import {
    View , 
    Image,
    Text,
    FlatList,
    ScrollView
}from 'react-native';
import {
    ListItem
}from 'react-native-elements';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

//沒用到
export default class PostImage extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[]
        }
    }
 //去資料庫抓圖片資料


 componentDidMount(){
     console.log(this.props.userId)
     firebase.database().ref("Work/"+this.props.userId).on('value',(snapshot)=>{
         let data = snapshot.val()
         if(data === null){}else{
         let content = Object.values(data)
         
         this.setState({data:content})
         }
     })
 }

 
    render(){
        return(

            <FlatList
            data={this.state.data}
            
            renderItem={({ item }) => (
                <ScrollView horizontal={true}>
                    <Image style={{width:50,height:50}} source={{uri:item.picture1}} />
                    <Image style={{width:50,height:50}} source={{uri:item.picture2}} />
                    <Image style={{width:50,height:50}} source={{uri:item.picture3}} />
                    </ScrollView>
            )}
            keyExtractor={(item,index) => `${index}`}
            listKey={(item, index) => 'D' + index.toString()}
            //ItemSeparatorComponent={this.renderSeparator}
            //ListHeaderComponent={this.renderHeader}
        />
        
        );
        
    }
    
}