import PushNotification from 'react-native-push-notification'
import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'

let payload = null;
let notificationId = '';

const setNotificationData = notificationData => {
  payload = notificationData
}

const getNotificationData = () => {
  return payload
}

/* It responds to incoming notifications when app is in foreground. */
const foregroundNotificationListener = () => {
  messaging().onMessage(notification => {
    if (notificationId !== notification.messageId) {
      notificationId = notification.messageId
      generateNotification(notification)
    }
    // if(notification){
    //   generateNotification(notification)
    // }
  })
}

/* It generates the notification for the app. */
const generateNotification = remoteMessage => {
  const { notification, data } = remoteMessage
  const notificationObj = { ...data }
  setNotificationData(notificationObj)
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'meme-feed', // (required)
        channelName: 'meme feed', // (required)
      },
      (created) => { } // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }
  PushNotification.localNotification({
    /* Android Only Properties */
    autoCancel: true,
    channelId: 'meme-feed',
    /* iOS and Android properties */
    title: notification.title, // (optional)
    message: notification.body, // (required)
    number: 10,
  });
};


// export { setNotificationListener, getNotificationData, setNotificationData }
export { setNotificationData, getNotificationData, foregroundNotificationListener }
