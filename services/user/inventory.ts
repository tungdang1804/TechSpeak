import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

export const buyRoomItem = async (uid: string, itemId: string, cost: number) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    points: increment(-cost),
    'inventory.ownedItems': arrayUnion(itemId)
  });
};

export const equipItem = async (uid: string, itemId: string, slot: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    [`inventory.equipped.${slot}`]: itemId
  });
};