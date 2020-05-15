import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import {
  Container, Header, Left, Body, Title, Right,
} from 'native-base';

export default class AboutCompany extends Component {
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
              }} />
          </Left>
          <Body>
            <Title>使用條款及規則</Title>
          </Body>
          <Right />
        </Header>
        <ScrollView>
          <View>
            <Text style={styles.subtitle}>
              使用者隱私權同意書:
          </Text>
            <Text style={styles.content}>
              非常歡迎您使用"WOWservice:驚嘆服務"，為了讓您能夠安心使用本網站的各項服務與資訊，特此向您說明我們的隱私權保護政策，以保障您的權益，請您詳閱下列內容：
          </Text>
            <Text style={styles.title}>
              隱私權保護政策的適用範圍
          </Text>
            <Text style={styles.content}>
              隱私權保護政策內容，包括本網站如何處理在您使用網站服務時收集到的個人識別資料。隱私權保護政策不適用於本網站以外的相關連結網站，也不適用於非本網站所委託或參與管理的人員。
          </Text>
            <Text style={styles.subtitle}>
              一、個人資料的蒐集、處理及利用方式
          </Text>
            <Text style={styles.content}>
              當您造訪本網站或使用本網站所提供之功能服務時，我們將視該服務功能性質，請您提供必要的個人資料，並在該特定目的範圍內處理及利用您的個人資料；非經您的同意，本網站不會將個人資料用於其他用途。
  本網站在您使用服務信箱、問卷調查等互動性功能時，會保留您所提供的姓名、電子郵件地址、聯絡方式及使用時間等。
  於一般瀏覽時，伺服器會自行記錄相關行徑，包括您使用連線設備的IP位址、使用時間、使用的瀏覽器、瀏覽及點選資料記錄等，做為我們增進網站服務的參考依據，此記錄為內部應用，不對外公佈。
  為提供精確的服務，我們會將收集的問卷調查內容進行統計與分析，分析結果之統計數據或說明文字呈現，除供內部研究外，我們會視需要公佈統計數據及說明文字，但不涉及特定個人之資料。
          </Text>
            <Text style={styles.subtitle}>
              二、資料之保護
          </Text>
            <Text style={styles.content}>
              本網站主機有防火牆、防毒系統等相關的各項資訊安全設備及必要的安全防護措施，加以保護網站及您的個人資料採用嚴格的保護措施，只由經過授權的人員才能接觸您的個人資料，相關處理人員皆簽有保密合約，如有違反保密義務者，將會受到相關的法律處分。
  如因業務需要有必要委託其他單位提供服務時，本網站亦會嚴格要求其遵守保密義務，並且採取必要檢查程序以確定其將確實遵守。
          </Text>
            <Text style={styles.subtitle}>
            三、網站對外的相關連結
            </Text>
            <Text style={styles.content}>
            本網站的網頁提供其他網站的網路連結，您也可經由本網站所提供的連結，點選進入其他網站。但該連結網站不適用本網站的隱私權保護政策，您必須參考該連結網站中的隱私權保護政策。
          </Text>
            <Text style={styles.subtitle}>
            四、與第三人共用個人資料之政策
          </Text>
            <Text style={styles.content}>
            本網站絕不會提供、交換、出租或出售任何您的個人資料給其他個人、團體、私人企業或公務機關，但有法律依據或合約義務者，不在此限。
前項但書之情形包括但不限於：
經由您同意。
法律明文規定。
為免除您生命、身體、自由或財產上之危險。
與公務機關或學術研究機構合作，基於公共利益為統計或學術研究而有必要，且資料經過提供者處理或蒐集著依其揭露方式無從識別特定之當事人。
當您在網站的行為，違反服務條款或可能損害或妨礙網站與其他使用者權益或導致任何人遭受損害時，經網站管理單位研析揭露您的個人資料是為了辨識、聯絡或採取法律行動所必要者。
有利於您的權益。
本網站委託廠商協助蒐集、處理或利用您的個人資料時，將對委外廠商或個人善盡監督管理之責。
          </Text>
            <Text style={styles.subtitle}>
            五、Cookie之使用
          </Text>
            <Text style={styles.content}>
            為了提供您最佳的服務，本網站會在您的電腦中放置並取用我們的Cookie，若您不願接受Cookie的寫入，您可在您使用的瀏覽器功能項中設定隱私權等級為高，即可拒絕Cookie的寫入，但可能會導至網站某些功能無法正常執行 。
          </Text>
            <Text style={styles.subtitle}>
            六、隱私權保護政策之修正
          </Text>
            <Text style={styles.content}>
            本網站隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於網站上。
 平台服務同意書:
 
         使用者需遵從平台服務同意書，如有違反疑慮，本平台將進行查證。若平台查證屬實，即有權利對該帳戶懲處；若造成平台相關損失，即須負相關賠償責任。平台使用者包括使用WOWservice一切公開資訊者。以下為使用者同意書規定，並將下述文中WOWservice簡稱為WOW:
         </Text>
         <Text style={styles.content}>
 1.第一階段使用者可獲得5枚WOW幣，成為使用者將擁有邀請代碼，可開放邀請碼將更多人加入，凡使用邀請碼者雙方皆可多得1枚WOW幣。
 </Text>
 <Text style={styles.content}>
 2.使用者須保持活躍，所持WOW幣非永久存留，使用者超過48小時無交易成功紀錄將扣除其WOW幣1枚；超過72小時無交易成功紀錄後，每24小時扣除1枚WOW幣，直至該使用者剩餘3枚WOW幣。若原本即≤3枚WOW幣使用者，不受此規範。
 </Text>
 <Text style={styles.content}>
 3.使用者的交易次數、頻率、邀請人數將能做為加成效果。加成活動將由WOW平台公布時程、日期、公式等詳細資訊。
 </Text>
 <Text style={styles.content}>
 4.不接受違法交易，亦指交易內容不得違反中華民國法律規範之訂單內容；不接受虛假交易，亦指交易內容經平台判定不屬實或捏造，交易雙方並未達成WOW平台理想交易宗旨。如違反本條規定，WOW有權停止該帳戶之一切資訊。
 </Text>
 <Text style={styles.content}>
 5.不得攻擊、竄改、捏造WOWservice一切資訊。凡經平台查證屬實，該使用者於平台上之一切權利將被剝奪，並需負相關法律責任。
 </Text>
 <Text style={styles.content}>
 6.WOW平台擁有修改使用者同意書之一切權利，修正之同意書將會公告於網站、APP等平台相關之公開頁面。如使用者於修改後同意書發佈後7日內未同意，卻仍使用WOW平台任何資訊，即視同已同意修改後之同意書。
 </Text>
 <Text style={styles.content}>
 7.平台上一切內容不得違反服務地區之法律規範。
 </Text>
 <Text style={styles.content}>
 8.雙方於交易過程若產生任何糾紛皆與WOW平台無關，如造成WOW平台相關損失皆須負相關賠償責任。
 </Text>
 <Text style={styles.content}>
 9.使用者如需發布交易內容於非WOW平台之一切公開頁面，內容需經雙方同意才得以複製、錄影音等透漏於第三者。如違反本條規定，WOW有權利針對違反之帳戶懲處。
 </Text>
 <Text style={styles.content}>
 10.使用WOW幣進行任何交易將收取10%手續費(以WOW幣收取)；捐款之WOW幣收取5%捐款手續費。
 </Text>
 <Text style={styles.content}>
 11.WOWservice所擁有之權利包括但不限於上述之規範，亦保留一切權利。
 </Text>
          
            
          </View>

        </ScrollView>

      </Container>

    );
  }
}

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontSize: 18,
    padding: 5,
  },
  subtitle: {
    alignSelf: 'center',
    fontSize: 15,
    padding: 5,
  },
  content: {
    alignSelf: 'center',
    fontSize: 13,
    padding: 5,
  },
});
