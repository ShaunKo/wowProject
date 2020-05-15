import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Modal,
    TouchableOpacity,
    Button,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';
import {
    Icon,
    Avatar,
    ListItem,
} from 'react-native-elements';
import {
    Container,
    Header,
    Right,
    Body,
    Left,
    Title,
    Content,
    Label,
} from 'native-base';
import { Table, Row, Rows, TableWrapper, Col, Cell } from 'react-native-table-component';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import '@react-native-firebase/functions';
export default class Work extends Component {

    constructor(props) {
        super(props);

        this.state = {

            tableHead: ['項目', '消費時間', '平台抽成', '付款金額', '實收金額'],
            widthArr: [150, 80, 70, 80, 90],
            rowData: [],

        }
    }



    componentDidMount() {
        const { state: { params: { skill, time, commission, price }, goBack } } = this.props.navigation;
        this.setState({skill:skill, time:time, commission:commission, price:price })
    }

    getTime = (time) => {
        let year = new Date(time).getFullYear();
        let month = new Date(time).getMonth() + 1;
        let date = new Date(time).getDate();
        return year + ' / ' + month + ' / ' + date;
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Icon
                            name='chevron-left'
                            color='#ffa042'
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}
                        />
                    </Left>

                    <Body>
                        <Title>消費明細</Title>
                    </Body>

                    <Right />
                </Header>


                <View style={styles.container}>
                    

                                <Table borderStyle={{ borderWidth: 1 }}>
                                    {/* <Row data={this.state.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text} /> */}
                                    <TableWrapper style={styles.wrapper}>
                                        <Col data={['項目', '消費時間', '平台抽成', '付款金額', '實收金額']} style={styles.title} heightArr={[40, 40, 40, 40]} textStyle={styles.text} />
                                        <Rows data={[
                                            [this.state.skill],
                                            [this.getTime(this.state.time)],
                                            [this.state.commission],
                                            [this.state.price],
                                            [this.state.price - this.state.commission],
                                        ]} flexArr={[2]} style={styles.row} textStyle={styles.text} />
                                    </TableWrapper>
                                </Table>
                           
            
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: { padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    title: {  backgroundColor: '#FFBB00' },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' },
    wrapper: { flexDirection: 'row' },
});