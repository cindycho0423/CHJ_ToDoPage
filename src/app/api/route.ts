import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

import { FIREBASE_DB } from "@/firebase/firebasedb";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "KanbanData"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "데이터를 가져오는 중 에러 발생" },
      { status: 500 },
    );
  }
}
