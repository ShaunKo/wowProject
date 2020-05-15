
import {
  List,
  Left,
  Body,
  Right,
  Header,
  Title,
  Container,
  Label,
} from 'native-base';
import { Icon, ListItem, Avatar, } from 'react-native-elements';
import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import moment from 'moment';
import 'moment/locale/zh-tw';
const locale = { name: 'zh-tw', config: { months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'), monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'), weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'), weekdaysShort: '日_一_二_三_四_五_六'.split('_'), weekdaysMin: '日_一_二_三_四_五_六'.split('_'), longDateFormat: { LT: 'HH:mm', LTS: 'HH:mm:ss', L: 'YYYY/MM/DD', LL: 'YYYY年M月D日', LLL: 'YYYY年M月D日 HH:mm', LLLL: 'YYYY年M月D日dddd HH:mm', l: 'YYYY/M/D', ll: 'YYYY年M月D日', lll: 'YYYY年M月D日 HH:mm', llll: 'YYYY年M月D日dddd HH:mm' }, meridiemParse: /凌晨|早上|上午|中午|下午|晚上/, meridiemHour: function (hour, meridiem) { if (hour === 12) { hour = 0; } if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') { return hour; } else if (meridiem === '中午') { return hour >= 11 ? hour : hour + 12; } else if (meridiem === '下午' || meridiem === '晚上') { return hour + 12; } }, meridiem: function (hour, minute, isLower) { var hm = hour * 100 + minute; if (hm < 600) { return '凌晨'; } else if (hm < 900) { return '早上'; } else if (hm < 1130) { return '上午'; } else if (hm < 1230) { return '中午'; } else if (hm < 1800) { return '下午'; } else { return '晚上'; } }, calendar: { sameDay: '[今天]LT', nextDay: '[明天]LT', nextWeek: '[下]ddddLT', lastDay: '[昨天]LT', lastWeek: '[上]ddddLT', sameElse: 'L' }, dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/, ordinal: function (number, period) { switch (period) { case 'd': case 'D': case 'DDD': return number + '日'; case 'M': return number + '月'; case 'w': case 'W': return number + '週'; default: return number; } }, relativeTime: { future: '%s內', past: '%s前', s: '幾秒', ss: '%d 秒', m: '1 分鐘', mm: '%d 分鐘', h: '1 小時', hh: '%d 小時', d: '1 天', dd: '%d 天', M: '1 個月', MM: '%d 個月', y: '1 年', yy: '%d 年' } } };
export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      //filter: '',
      filter1: '',
      marked: [],
    }
  }
  componentDidMount() {
    //抓出paymentrecord資料依據時間排序
    // firebase.database().ref('PaymentRecord/').orderByChild('start').on('value', (snapshot) => {
    //   let data = snapshot.val();
    //   let content = Object.values(data);
    //   let filter = content.filter(function (item, index, array) {
    //     if (item.sUid.indexOf(firebase.auth().currentUser.uid) !== -1 || item.bUid.indexOf(firebase.auth().currentUser.uid) !== -1) {
    //       //如果跟我有關我就取出來
    //       return item;
    //     }
    //   });
    //   this.setState({ filter: filter });
    //   //有關我的如果是買方則頭貼？
    //   //有關我的如果是賣方則頭貼？
    //   //依時間比對排序
    // });
    //我要抓start扣掉時間
    let markedDates = [];
    firebase.database().ref('PaymentRecord/').on('value', (snapshot) => {
      let data = snapshot.val();
      if (data === null) { } else {
        let content = Object.values(data);
        let start = content.map(function (item, index, array) {
          if (item.bUid === firebase.auth().currentUser.uid || item.sUid === firebase.auth().currentUser.uid) {
            return item.start.slice(0, 10);
          } else {
            return []
          }
        });
        
        for (i = 0; i < start.length; i++) {
          markedDates.push({
            date: new Date(start[i]),
            dots: [{ key: 0, color: 'red', selectedDotColor: 'blue' }],
          });
        }
        this.setState({ marked: markedDates });
      }
    });
  }
  componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
  selectDate = (date) => {
    //選擇的日期
    //console.log(date)
    // console.log(date.format('YYYY-MM-DD'))

    this.setState({ date: date.format('YYYY-MM-DD') });
    firebase.database().ref('PaymentRecord/').on('value', (snapshot) => {
      let data = snapshot.val();
      if (data === null) { } else {
        let content = Object.values(data);
        //只取出buid跟suid有相關ㄉ

        var filter1 = content.filter(function (item, index, array) {
          if (item.bUid === firebase.auth().currentUser.uid || item.sUid === firebase.auth().currentUser.uid) {
            return item.start.indexOf(date.format('YYYY-MM-DD')) !== -1;
          } 
        });
        // console.log(filter1)
        this.setState({ filter1: filter1 });
      }
    });
  }
  //cut時間
  cutTime = (start) => {
    return start.substr(11);
  }
  day = (start) => {
    return start.slice(8, 10);//8-10
  }
  render() {
    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>行事曆</Title>
          </Body>
          <Right />
        </Header>
        <View>
          <CalendarStrip
            locale={locale}
            daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: '#EEEE00' }}
            style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
            calendarHeaderStyle={{ color: 'white' }}
            onDateSelected={(date) => {
              //如果與選擇的日期一樣的話，則印出工作項目
              //要用時分排序
              this.selectDate(date)
            }}
            highlightDateNumberStyle={{ color: '#EEEE00' }}
            highlightDateNameStyle={{ color: '#EEEE00' }}
            calendarColor={'#85A5FF'}
            markedDates={this.state.marked}
          //markedDates={}
          />
          {/* <Text>{this.state.date}</Text> */}
          <FlatList
            data={this.state.filter1}
            renderItem={({ item }) => (
              item.bUid === firebase.auth().currentUser.uid ? 
              <ListItem
                leftAvatar={<Avatar title={this.day(item.start)} />}
                title={item.sName}
                subtitle={this.cutTime(item.start) + '/' + item.end}
                rightTitle={
                  <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Label>{item.skill}</Label>
                  </View>
                }
                rightSubtitle={
                  <View style={{ flexDirection: 'row', }}>
                    <View style={{ flex: 1 }}>
                      <Icon
                        name='monetization-on'
                        color='#FFBB00'
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Label>{item.price}</Label>
                    </View>
                  </View>}
                bottomDivider
              />
              :
              <ListItem
                leftAvatar={<Avatar title={this.day(item.start)} />}
                title={item.bName}
                subtitle={this.cutTime(item.start) + '/' + item.end}
                rightTitle={
                  <View style={{ flex: 1, alignSelf: 'center', }}>
                    <Label>{item.skill}</Label>
                  </View>
                }
                rightSubtitle={
                  <View style={{ flexDirection: 'row', }}>
                    <View style={{ flex: 1 }}>
                      <Icon
                        name='monetization-on'
                        color='#FFBB00'
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Label>{item.price}</Label>
                    </View>
                  </View>}
                bottomDivider
              />
            )}
          />
        </View>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  container: { flex: 1 }
});