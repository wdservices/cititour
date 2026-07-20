const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Cloud Function: sendChatNotification
 *
 * Triggers when a chat document is updated (new message sent).
 * Finds the recipient via the `participants` array, fetches their
 * push tokens from the businesses collection, and sends an FCM
 * multicast to all their registered devices.
 */
exports.sendChatNotification = onDocumentUpdated("chats/{chatId}", async (event) => {
  const newValue = event.data.after.data();
  const previousValue = event.data.before.data();

  // Only fire if lastMessage actually changed (new message arrived)
  if (newValue.lastMessage === previousValue.lastMessage) return null;

  const lastSenderId = newValue.lastSenderId;
  const participants = newValue.participants || [];

  // Find the recipient — the participant who didn't send the last message
  const recipientId = participants.find((id) => id !== lastSenderId);
  if (!recipientId) return null;

  try {
    // 1. Fetch the recipient's business document for push tokens
    const recipientDoc = await admin.firestore().collection("businesses").doc(recipientId).get();
    if (!recipientDoc.exists) {
      // Try users collection as fallback (customer might not have a business doc)
      const userDoc = await admin.firestore().collection("users").doc(recipientId).get();
      if (!userDoc.exists) return null;

      const userData = userDoc.data();
      const tokens = userData.pushTokens || [];
      if (tokens.length === 0) return null;

      const senderName = newValue.customerName || newValue.participantDetails?.[lastSenderId]?.name || "Customer";
      const messagePayload = {
        notification: {
          title: senderName,
          body: newValue.lastMessage,
        },
        data: {
          chatId: event.params.chatId,
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
        tokens: tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(messagePayload);
      console.log(`Delivered ${response.successCount} messages to user ${recipientId}`);
      return null;
    }

    const recipientData = recipientDoc.data();
    const tokens = recipientData.pushTokens || [];
    if (tokens.length === 0) return null;

    // 2. Build sender display name
    const senderName = newValue.businessName
      || newValue.participantDetails?.[lastSenderId]?.name
      || "Business";

    // 3. Send FCM multicast to all recipient devices
    const messagePayload = {
      notification: {
        title: senderName,
        body: newValue.lastMessage,
      },
      data: {
        chatId: event.params.chatId,
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(messagePayload);
    console.log(`Delivered ${response.successCount} messages to ${recipientId}`);

    return null;
  } catch (error) {
    console.error("Failed to send push notification:", error);
    return null;
  }
});
