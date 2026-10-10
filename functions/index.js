const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

// Se dispara cada vez que se crea un documento en "notifications"
// (ver NotificationService.create en la app) y manda un push real al
// celular del destinatario, usando el/los fcmTokens guardados en su
// documento de usuario.
exports.sendNotificationPush = onDocumentCreated(
  "notifications/{notificationId}",
  async (event) => {

    const notification = event.data?.data();

    if (!notification?.userId) {
      return;
    }

    const userSnap = await getFirestore()
      .collection("users")
      .doc(notification.userId)
      .get();

    const tokens = userSnap.data()?.fcmTokens;

    if (!tokens || !tokens.length) {
      return;
    }

    try {

      await getMessaging().sendEachForMulticast({
        tokens,
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: {
          link: notification.link || ""
        }
      });

    } catch (error) {

      console.error("Error enviando push:", error);

    }

  }
);
