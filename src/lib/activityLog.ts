import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type ActivityAction =
  | "create_listing"
  | "edit_listing"
  | "delete_listing"
  | "create_event"
  | "edit_event"
  | "delete_event"
  | "fund_wallet"
  | "withdraw"
  | "register_event"
  | "submit_review"
  | "sign_in"
  | "sign_out"
  | "sign_up";

export type ActivityTargetType =
  | "business"
  | "product"
  | "property"
  | "event"
  | "wallet"
  | "auth"
  | "review";

interface LogActivityParams {
  userId: string;
  userEmail: string;
  userName: string;
  action: ActivityAction;
  targetType: ActivityTargetType;
  targetId?: string;
  targetName?: string;
  details?: string;
}

/**
 * Log a user activity to the activity_logs Firestore collection.
 * This is fire-and-forget — errors are logged but never thrown.
 */
export const logActivity = async (params: LogActivityParams): Promise<void> => {
  try {
    await addDoc(collection(db, "activity_logs"), {
      userId: params.userId,
      userEmail: params.userEmail,
      userName: params.userName,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId || "",
      targetName: params.targetName || "",
      details: params.details || "",
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    // Log silently — don't break the user's workflow
    console.error("Activity log error:", error);
  }
};
