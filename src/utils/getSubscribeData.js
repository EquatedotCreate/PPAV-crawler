import 'babel-polyfill';
import * as newVideos from '../models/newVideos';
import * as subscribe from '../models/subscribe';

const getSubscribeData = () => {
  return new Promise(resolve => {
    Videos_new.getRandomThreeVideos().then(returnArr => {
      Subscribe.findSubscribeId().then(senderIDArr => {
        const senderIDArrLength = senderIDArr.length;
        const count = senderIDArr.length;
        const returnObj = {
          returnArr,
          senderIDArr,
          senderIDArrLength,
          count,
        };
        resolve(returnObj);
      });
    });
  });
};

export default getSubscribeData;
