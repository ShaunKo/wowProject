import React , {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {
    Card,
    CardItem,
    Label,
    Textarea,
} from 'native-base';
import {
    Icon,
} from 'react-native-elements';
//不用ㄌ
export default class SelfIntroduction extends Component{
    constructor(props){
        super(props);
        this.state={
            input:true,
        }
    }
    render(){
        return(
            <View>
            {this.state.input ?
                <Card>
                    <CardItem>
                        <View style={styles.selfIntroductionTitle}>
                            <Label>個人簡介</Label>
                        </View>
                        <View style={styles.selfIntroductionTitleIconRight}>
                            <Icon
                                name='edit'
                                color='#ffa042'
                                onPress={() => { this.setState({ input: !this.state.input }); }}
                            />
                        </View>
                    </CardItem>
                    <CardItem>
                        <Text>抓資料</Text>
                    </CardItem>
                </Card>
                :
                <Card>
                    <CardItem style={styles.selfIntroduction}>
                        <View style={styles.selfIntroductionTitleIconLeft}>
                            <Icon
                                name='chevron-left'
                                color='#ffa042'
                                onPress={() => { this.setState({ input: !this.state.input }); }}
                            />
                        </View>
                        <View style={styles.selfIntroductionTitle}>
                            <Label>個人簡介</Label>
                        </View>
                        <View style={styles.selfIntroductionTitleIconRight}>
                            <Icon
                                name='save'
                                color='#ffa042'
                                onPress={() => { this.setState({ input: !this.state.input }); }}
                            />
                        </View>
                    </CardItem>
                    <CardItem>
                        <View style={styles.selfIntroductionTextarea}>
                            <Textarea
                                rowSpan={6}
                                maxLength={250}
                                placeholder='個人簡介（250字）'
                            />
                        </View>
                    </CardItem>
                </Card>
            }
            </View>
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
    selfIntroductionTitleIconRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    selfIntroductionTitleIconLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },
    selfIntroductionTextarea: {
        flex: 1,
        marginRight: 5,
        marginLeft: 5,
    },
});
