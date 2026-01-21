
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

/**
 * User Inventory Service
 * Quản lý kho đồ và trang bị phòng học
 */

export const buyRoomItem = async (uid: string, itemId: string, cost: number) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    points: (prev: number) => prev - cost,
    'inventory.ownedItems': arrayUnion(itemId)
  });
};

export const equipItem = async (uid: string, itemId: string, slot: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    [`inventory.equipped.${slot}`]: itemId
  });
};
