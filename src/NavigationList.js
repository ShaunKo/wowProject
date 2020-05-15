import React , {Component} from 'react';
import {Image} from 'react-native';
import {Icon} from 'react-native-elements';
import 'react-native-gesture-handler';
import {createAppContainer,createDrawerNavigator,createSwitchNavigator} from 'react-navigation';
import {createStackNavigator,} from 'react-navigation-stack';
import Login from './Login.js';
import Enroll from './Enroll.js';
import ValuationMess from './ValuationMess.js';
import AboutCompany from './AboutCompany.js';
import FirstPage from './FirstPage.js';
import MessageBoard from './MessageBoard.js';

import Speed from './Speed.js';
import Index from './Index.js';

// import Card from './Card.js';

import Chat from './Chat.js';
import GroupChat from './GroupChat.js';

// const afterLogin = createStackNavigator({
//     HomePage:{
//         screen:HomePage,
//     },
//     MessageBoard:{
//         screen:MessageBoard,
//     },
// })

const RootStack = createStackNavigator(
{
    FirstPage:{
        screen:FirstPage,
    },
    Enroll:{
        screen:Enroll
    },
    // EnrollPhone:{
    //     screen:EnrollPhone
    // },
    Login:{
        screen:Login
    },
    AboutCompany:{
        screen:AboutCompany
    },
    //afterLogin,
    //Index,
    // HomePage:{
    //     screen:HomePage,
    // },
    MessageBoard:{
        screen:MessageBoard,
    },
    ValuationMess:{
        screen:ValuationMess,
    },
    // Speed:{
    //     screen:Speed,
    // },
    // Speed1:{
    //     screen:Speed1
    // },
    Index:{
        screen:Index,
    },
    // Card:{
    //     screen:Card,
    // },
    Chat:{
        screen:Chat,
    },
    GroupChat:{
        screen:GroupChat,
    },

},
{
    initialRouteName:'FirstPage',
    defaultNavigationOptions:
    {
        headerTitle:"WOW",
        headerTintColor:"white",
        headerStyle:{
            backgroundColor:"black",
        },
        headerTitleStyle:{
            fontSize:30,
            fontWeight:"bold",
        },
        headerBackTitle:null,
    },
    headerMode:'none'
},

);



  export default MyApp = createAppContainer(
        RootStack,
        //afterLogin
);