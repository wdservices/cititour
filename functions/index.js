const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onCall } = require("firebase-functions/v2/https");
const { HttpsError } = require("firebase-functions/v2/https");
const functionsV1 = require("firebase-functions/v1");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
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

async function verifyAdminRole(uid) {
  if (!uid) throw new HttpsError("permission-denied", "Authentication required");
  const adminDoc = await admin.firestore().collection("admin_users").doc(uid).get();
  if (!adminDoc.exists) throw new HttpsError("permission-denied", "Admin user not found");
  const data = adminDoc.data() || {};
  const validRoles = ["admin", "super_admin"];
  if (!validRoles.includes(data.role)) throw new HttpsError("permission-denied", "Insufficient role");
  if (data.status === "suspended") throw new HttpsError("permission-denied", "Admin account suspended");
  if (data.disabled === true) throw new HttpsError("permission-denied", "Admin account disabled");
  return true;
}

async function destroyCloudinaryImage(pid) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "tourph";
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiKey || !apiSecret) {
      console.warn("Cloudinary API keys not configured, skipping destroy for:", pid);
      return false;
    }
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `public_id=${pid}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    const body = new URLSearchParams();
    body.append("public_id", pid);
    body.append("api_key", apiKey);
    body.append("timestamp", String(timestamp));
    body.append("signature", signature);

    const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const json = await resp.json().catch(() => ({}));
    return resp.ok && json.result !== "not found";
  } catch (e) {
    console.error("Cloudinary destroy failed for", pid, e.message);
    return false;
  }
}

function collectPublicIds(userDoc, walletDoc, businesses, marketplace, house_listings) {
  const ids = new Set();
  const userData = userDoc || {};
  const walletData = walletDoc || {};
  if (userData.logoPublicId) ids.add(userData.logoPublicId);
  if (userData.imagePublicId) ids.add(userData.imagePublicId);
  if (walletData.logoPublicId) ids.add(walletData.logoPublicId);
  for (const b of businesses) {
    const bd = b.data || {};
    if (bd.logoPublicId) ids.add(bd.logoPublicId);
    if (Array.isArray(bd.imagePublicIds)) bd.imagePublicIds.forEach((i) => i && ids.add(i));
  }
  for (const m of marketplace) {
    const md = m.data || {};
    if (md.logoPublicId) ids.add(md.logoPublicId);
    if (Array.isArray(md.imagePublicIds)) md.imagePublicIds.forEach((i) => i && ids.add(i));
  }
  for (const h of house_listings) {
    const hd = h.data || {};
    if (hd.logoPublicId) ids.add(hd.logoPublicId);
    if (Array.isArray(hd.imagePublicIds)) hd.imagePublicIds.forEach((i) => i && ids.add(i));
    if (Array.isArray(hd.rooms)) {
      for (const r of hd.rooms) {
        if (r && Array.isArray(r.imagePublicIds)) r.imagePublicIds.forEach((i) => i && ids.add(i));
      }
    }
  }
  return Array.from(ids).filter(Boolean);
}

async function collectOwnedData(userId) {
  const db = admin.firestore();
  const [userSnap, walletSnap, businessSnap, marketplaceSnap, houseSnap] = await Promise.all([
    db.collection("users").doc(userId).get(),
    db.collection("wallet").doc(userId).get(),
    db.collection("businesses").where("ownerId", "==", userId).get(),
    db.collection("marketplace").where("ownerId", "==", userId).get(),
    db.collection("house_listings").where("ownerId", "==", userId).get(),
  ]);
  const userDoc = userSnap.exists ? userSnap.data() : null;
  const walletDoc = walletSnap.exists ? walletSnap.data() : null;
  const businesses = businessSnap.docs.map((d) => ({ id: d.id, data: d.data() }));
  const marketplace = marketplaceSnap.docs.map((d) => ({ id: d.id, data: d.data() }));
  const house_listings = houseSnap.docs.map((d) => ({ id: d.id, data: d.data() }));

  const miniSet = new Map();
  house_listings.forEach((h) => {
    if (h.data && h.data.miniSiteActive === true) miniSet.set(h.id, h);
  });
  const miniSnap = await db.collection("mini_sites").where("ownerId", "==", userId).get();
  miniSnap.docs.forEach((d) => miniSet.set(d.id, { id: d.id, data: d.data() }));
  const mini_sites = Array.from(miniSet.values());

  const allCloudinaryPublicIds = collectPublicIds(userDoc, walletDoc, businesses, marketplace, house_listings);
  return { userSnap, walletSnap, userDoc, walletDoc, businesses, marketplace, house_listings, mini_sites, allCloudinaryPublicIds };
}

exports.archiveAndDeleteUser = onCall(async (request) => {
  await verifyAdminRole(request.auth?.uid);
  const { userId } = request.data || {};
  if (!userId || typeof userId !== "string") throw new HttpsError("invalid-argument", "userId is required");

  const collected = await collectOwnedData(userId);
  const { userDoc, walletDoc, businesses, marketplace, house_listings, mini_sites, allCloudinaryPublicIds } = collected;

  const archivedId = uuidv4();
  const archiveData = {
    id: archivedId,
    deletedBy: request.auth.uid,
    deletedAt: admin.firestore.Timestamp.now(),
    targetUserId: userId,
    userDoc: userDoc || null,
    walletDoc: walletDoc || null,
    businesses,
    marketplace,
    house_listings,
    mini_sites,
    allCloudinaryPublicIds,
    reason: "admin_deletion",
  };
  await admin.firestore().collection("deleted_accounts_log").doc(archivedId).set(archiveData);

  const db = admin.firestore();
  const batch = db.batch();
  const docsToDelete = [];
  docsToDelete.push(db.collection("users").doc(userId));
  docsToDelete.push(db.collection("wallet").doc(userId));
  businesses.forEach((b) => docsToDelete.push(db.collection("businesses").doc(b.id)));
  marketplace.forEach((m) => docsToDelete.push(db.collection("marketplace").doc(m.id)));
  house_listings.forEach((h) => docsToDelete.push(db.collection("house_listings").doc(h.id)));
  docsToDelete.forEach((ref) => batch.delete(ref));
  await batch.commit();
  const deletedCount = docsToDelete.length;

  let cloudinaryDestroyed = 0;
  for (const pid of allCloudinaryPublicIds) {
    const ok = await destroyCloudinaryImage(pid);
    if (ok) cloudinaryDestroyed++;
  }

  return { ok: true, archivedId, deletedCount, cloudinaryDestroyed };
});

exports.cleanupUserData = functionsV1.firestore.document("users/{userId}").onDelete(async (snap, context) => {
  const userId = context.params.userId;
  try {
    const archiveSnap = await admin
      .firestore()
      .collection("deleted_accounts_log")
      .where("targetUserId", "==", userId)
      .limit(1)
      .get();
    if (!archiveSnap.empty) {
      console.log(`cleanupUserData: skipping userId=${userId} — already archived`);
      return null;
    }
  } catch (e) {
    console.error("cleanupUserData: archive check failed, proceeding anyway:", e.message);
  }

  const collected = await collectOwnedData(userId);
  const { businesses, marketplace, house_listings, allCloudinaryPublicIds } = collected;

  const db = admin.firestore();
  const batch = db.batch();
  businesses.forEach((b) => batch.delete(db.collection("businesses").doc(b.id)));
  marketplace.forEach((m) => batch.delete(db.collection("marketplace").doc(m.id)));
  house_listings.forEach((h) => batch.delete(db.collection("house_listings").doc(h.id)));
  try {
    await batch.commit();
  } catch (e) {
    console.error("cleanupUserData: batch delete failed:", e.message);
  }

  for (const pid of allCloudinaryPublicIds) {
    await destroyCloudinaryImage(pid);
  }
  return null;
});

exports.restoreDeletedAccount = onCall(async (request) => {
  await verifyAdminRole(request.auth?.uid);
  const { archiveId } = request.data || {};
  if (!archiveId || typeof archiveId !== "string") {
    throw new HttpsError("invalid-argument", "archiveId is required");
  }
  const archiveSnap = await admin.firestore().collection("deleted_accounts_log").doc(archiveId).get();
  if (!archiveSnap.exists) throw new HttpsError("not-found", "Archive not found");
  const arc = archiveSnap.data();
  if (!arc) throw new HttpsError("internal", "Empty archive document");

  const db = admin.firestore();
  const batch = db.batch();
  let restoredDocs = 0;

  if (arc.targetUserId && arc.userDoc) {
    batch.set(db.collection("users").doc(arc.targetUserId), arc.userDoc);
    restoredDocs++;
  }
  if (arc.targetUserId && arc.walletDoc) {
    batch.set(db.collection("wallet").doc(arc.targetUserId), arc.walletDoc);
    restoredDocs++;
  }
  if (Array.isArray(arc.businesses)) {
    arc.businesses.forEach((b) => {
      if (b.id && b.data) {
        batch.set(db.collection("businesses").doc(b.id), b.data);
        restoredDocs++;
      }
    });
  }
  if (Array.isArray(arc.marketplace)) {
    arc.marketplace.forEach((m) => {
      if (m.id && m.data) {
        batch.set(db.collection("marketplace").doc(m.id), m.data);
        restoredDocs++;
      }
    });
  }
  if (Array.isArray(arc.house_listings)) {
    arc.house_listings.forEach((h) => {
      if (h.id && h.data) {
        batch.set(db.collection("house_listings").doc(h.id), h.data);
        restoredDocs++;
      }
    });
  }

  await batch.commit();
  return { ok: true, restoredDocs };
});
