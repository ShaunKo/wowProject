const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
//  alert('hello','ok');
// });

//database trigger => 1. 只要有使用者加入，則加入一人五枚wow幣，且也加入使用者數目 2. 
var fireData = admin.database();
exports.Coin = functions.auth.user().onCreate((user) => {
  fireData.ref('Coin/').once('value',(snapshot)=>{
  	let data = snapshot.val();
  	if(data === null ){
  		fireData.ref('Coin/').set({ TotalCoin : 5 , person : 1 });
  	}else{
  		fireData.ref('Coin/').once('value',(snapshot1)=>{
  			let data1 = snapshot1.val();
  			fireData.ref('Coin/').set({ TotalCoin : data1.TotalCoin + 5 , person : data1.person + 1 });
  		});
  	}
  });
  return '';
});
//========================================
//如果user被除名則要扣掉他的wow幣數及他的所有資料


//========================================
//PaymentRecord是否已經檢舉
exports.Report = functions.https.onCall((data,context)=>{
	const key = data.key;//client傳來的key
	fireData.ref('PaymentRecord/' + key).update({
		reported: false,
	});
});

//交易買方扣款
exports.Deal = functions.https.onCall((data , context) =>{
  const price = data.price;
  const uid = context.auth.uid;//我自己的uid（買方）
  //取出uid 
  fireData.ref('Personal/' + uid).once('value',(snapshot)=>{
    let data = snapshot.val();
    let myCoin = data.myCoin;
    //扣款完存回資料庫
    if( myCoin - price >= 0){
      fireData.ref('Personal/' + uid ).update({
        myCoin: myCoin - price,
      });
    }
  });
});

//捐幣
exports.donate = functions.https.onCall((data, context) =>{
	const price = data.price;//我上傳的錢
  	const uid = context.auth.uid;
  	fireData.ref('Personal/' + uid ).once('value',(snapshot)=>{
  		let data = snapshot.val();
  		let myCoin = data.myCoin;
  		let donate = data.donate;
  		if(myCoin - price >= 0){
  			fireData.ref('Personal/' + uid).update({
  				myCoin: myCoin - price,//捐幣後我的幣數
  				donate: donate + price,//我總共捐出的幣數
  			});
  		}
  	});
});
//=============================
//買方確認交易完成後付款給賣方，賣方獲得，評分
exports.scoreAndEarn = functions.https.onCall((data, context)=>{
	// 上傳分數，跟賺到的幣
	//const uid = context.auth.uid;
	const price = parseInt(data.price);//上傳該工作的幣數
	const sUid = data.sUid;//賣方的uid
	const score = data.score;//買方上傳分數
	const key = data.key;//這份工作的key
	fireData.ref('Personal/' + sUid).once('value',(snapshot)=>{//賣方的score
			let data1 = snapshot.val();
			let finishedJob = data1.finishedJob;//賣方完成的工作數
			let myCoin = data1.myCoin;//賣方原本的幣數
			let scoreS = data1.score;//賣方原本的分數
			let token = data1.token;
		if(scoreS !== undefined ){
			fireData.ref('Personal/' + sUid).update({
				score: Math.round((score + scoreS)/2),
				finishedJob: finishedJob + 1,
				myCoin: (price/10) + myCoin,
			});
		} else {
			fireData.ref('Personal/' + sUid).update({
				score: score,//買方上傳的分數
				finishedJob: finishedJob + 1,
				myCoin: (price/10) + myCoin,
			});
		}

		const payload = {
        notification: {
            title:"已收到款項",
            body: "請至交易明細確認",
            sound: "default"
        },
    };

  //Create an options object that contains the time to live for the notification and the priority
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

//有關badge的
   //每個人進入時就要存，存在db
   if(token!== undefined || token !== null || token !== ''){
    return admin.messaging().sendToDevice(token , payload, options);
}   
		
	});
	//消費明細按下完成後完成紐要變成空的//要在該paymentRecord加入一筆資料
	fireData.ref('PaymentRecord/' + key).update({
		finished: true,
	});
});
//=============================
//BlockUser
exports.blockUser = functions.https.onCall((data,context)=>{
	const uid = context.auth.uid;//自己的uid
	const name = data.name;//被封鎖者的姓名
	const blockId = data.blockId;//client傳來的我要封鎖的人的uid
	fireData.ref('Block/' + uid + '/' + blockId ).update({
		blockId: blockId,
		name: name,
	});
	fireData.ref('Block/' + blockId + '/' + uid ).update({//被封鎖者
		blockId: uid,
	});
});


exports.pushNotification = 
functions.database.ref('/Notification/{userId}/{pushId}').onCreate(( change,context) => {
    //  Grab the current value of what was written to the Realtime Database.
    //var valueObject = change.after.val();
    
    var valueObject = change.val();
    const userId = context.params.userId;//傳送者的uid
    //if(userId === valueObject.sUid){
    	//avatar是false 時suid是別人
    	//如果avatar === false 時，我要加在sUid否則加在bUid
    	fireData.ref('badgeForBell/' + userId).once('value',(snapshot)=>{
    	let data = snapshot.val();
    	if(data === null) {
    		fireData.ref('badgeForBell/' + userId).update({
    		number: 1,
    	});
    	} else {
    		let number = data.number;
    		fireData.ref('badgeForBell/' + userId).update({
    		number: number + 1,
    	});
    	}
    });
  // Create a notification
    const payload = {
        notification: {
            title:valueObject.name,
            body: valueObject.skill,
            sound: "default"
        },
    };
    const token = valueObject.token

  //Create an options object that contains the time to live for the notification and the priority
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

//有關badge的
   //每個人進入時就要存，存在db
   if(token!== undefined || token !== null){
    return admin.messaging().sendToDevice(token , payload, options);
}   
});

//聊天室推播
exports.pushMessage = 
functions.database.ref('/Chat/{chatroom}/{pushId}').onCreate(( change,context) => {
    console.log('Push notification event triggered');
    //  Grab the current value of what was written to the Realtime Database.
    //var valueObject = change.after.val();
    var valueObject = change.val();
    console.log(valueObject);
    const userId = context.params.userId;
    console.log(context);

  // Create a notification
    const payload = {
        notification: {
            title:valueObject.user.name,
            body: valueObject.text,
            sound: "default"
        },
    };
    const token = valueObject.token

  //Create an options object that contains the time to live for the notification and the priority
    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };

	//有關badge的
   //每個人進入時就要存，存在db
   if(token!== undefined || token !== null){
    return admin.messaging().sendToDevice(token , payload, options);
}   
});
