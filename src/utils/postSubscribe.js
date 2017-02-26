import 'babel-polyfill';
import delay from 'delay';
import * as newVideos from '../models/newVideos';
import * as pushNewVideosLogss from '../models/pushNewVideosLogs';
import * as subscribe from '../models/subscribe';
import FacebookOP from './facebook';

const fb = new FacebookOP();


const postSubscribe = async () => {
  const returnArr = await newVideos.getRandomThreeVideos();
  const senderIDArr = await subscribe.findSubscribeId();
  const senderIDArrLength = senderIDArr.length;

  let successNumber = 0;
  let overOneDayNumber = 0;
  let failedNumber = 0;

  for (let idx = 0; idx < senderIDArrLength; ++idx) {
    const str = '今日新增送到📢\n\n提醒您❗❗❗\n如果超過24小時未與PPAV互動，PPAV將無法推播給您❗❗❗\n建議您在收到推播後可以隨意回個一生平安喜樂\n以免明天無法收到推播喔💔💔💔';
    const pushNewVideos = await fb.sendGenericMessageByArr(senderIDArr[idx].senderID, returnArr).then(delay(300));
    const pushNewVideosText = await fb.sendTextMessage(senderIDArr[idx].senderID, str);

    if (pushNewVideos && pushNewVideosText) {
      successNumber++;
    } else if (pushNewVideos && !pushNewVideosText) {
      overOneDayNumber++;
    } else {
      failedNumber++;
      subscribe.updateSubscribeData(senderIDArr[idx].senderID, false);
    }
    console.log(`需要推播人數：${senderIDArrLength} ｜ 推播成功：${successNumber} ｜ 24小時內未回覆：${overOneDayNumber} ｜ 推播失敗：${failedNumber}`);

    if ((idx + 1) === senderIDArrLength) {
      pushNewVideosLogss.savePushNewVideoData(idx + 1, senderIDArrLength, successNumber, overOneDayNumber, failedNumber);
    }
  }
};

export default postSubscribe;
