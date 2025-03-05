import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore 관련 함수들을 가져옵니다
import { NextRequest, NextResponse } from "next/server"; // Next.js API 핸들링에 필요한 타입들을 가져옵니다

import { FIREBASE_DB } from "@/firebase/firebasedb"; // Firebase 데이터베이스 연결 객체를 가져옵니다
import { KanbanData, Todo, TodoStatus } from "@/types/todo"; // 칸반 데이터 관련 타입들을 가져옵니다

/**
 * GET 함수 - 칸반 보드 데이터를 가져오는 함수
 * Firestore에서 칸반 데이터를 조회하고, 데이터가 없으면 초기 데이터를 생성합니다.
 */
export async function GET() {
  try {
    // "KanbanData" 컬렉션에서 "board" 문서를 참조합니다
    const docRef = doc(FIREBASE_DB, "KanbanData", "board");
    // 문서 데이터를 가져옵니다
    const docSnap = await getDoc(docRef);

    // 문서가 존재하는 경우 그 데이터를 반환합니다
    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    } else {
      // 문서가 존재하지 않는 경우, 초기 칸반 데이터를 생성합니다
      const initialData: KanbanData = {
        TODO: [],
        ON_PROGRESS: [],
        DONE: [],
      };
      // 초기 데이터를 Firestore에 저장합니다
      await setDoc(doc(FIREBASE_DB, "KanbanData", "board"), initialData);
      // 생성된 초기 데이터를 반환합니다
      return NextResponse.json(initialData);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "데이터를 가져오는 중 에러 발생" },
      { status: 500 },
    );
  }
}

/**
 * POST 함수 - 새로운 할 일을 생성하는 함수
 * 클라이언트로부터 받은 데이터를 검증하고, 새 할 일을 생성하여 Firestore에 저장합니다.
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문의 JSON 데이터를 파싱합니다
    const body = await request.json();

    // 제목과 마감일이 없는 경우 400 에러를 반환합니다
    if (!body.title) {
      return NextResponse.json(
        { error: "제목은 필수 항목입니다" },
        { status: 400 },
      );
    }
    if (!body.dueDate) {
      return NextResponse.json(
        { error: "마감일은 필수 항목입니다" },
        { status: 400 },
      );
    }

    // 상태값이 없을 경우 기본값 "TODO"로 설정합니다
    const status: TodoStatus = body.status || "TODO";
    // 상태값이 유효하지 않은 경우 400 에러를 반환합니다
    if (!["TODO", "ON_PROGRESS", "DONE"].includes(status)) {
      return NextResponse.json(
        { error: "유효하지 않은 상태값입니다" },
        { status: 400 },
      );
    }

    // 새로운 할 일 객체를 생성합니다
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description || "",
      dueDate: body.dueDate,
    };

    // Firestore에서 칸반 데이터를 가져옵니다
    const docRef = doc(FIREBASE_DB, "KanbanData", "board");
    const docSnap = await getDoc(docRef);

    let currentKanban: KanbanData;

    // 칸반 데이터가 존재하면 가져오고, 없으면 초기 구조를 생성합니다
    if (docSnap.exists()) {
      currentKanban = docSnap.data() as KanbanData;
    } else {
      currentKanban = {
        TODO: [],
        ON_PROGRESS: [],
        DONE: [],
      };
    }

    // 새 할 일을 해당 상태 배열의 맨 앞에 추가합니다 (최신 항목이 맨 위에 표시되도록)
    currentKanban[status] = [newTodo, ...currentKanban[status]];

    // 업데이트된 칸반 데이터를 Firestore에 저장합니다
    await setDoc(docRef, currentKanban);

    // 생성된 할 일과 업데이트된 칸반 데이터를 반환합니다
    return NextResponse.json(
      {
        task: newTodo,
        kanbanData: currentKanban,
        message: "할 일이 성공적으로 추가되었습니다",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "할 일을 생성하는 중 에러 발생" },
      { status: 500 },
    );
  }
}

/**
 * DELETE 함수 - 할 일을 삭제하는 함수
 * 클라이언트로부터 받은 ID와 상태값을 기반으로 해당 할 일을 삭제합니다.
 */
export async function DELETE(request: NextRequest) {
  try {
    // 요청 본문에서 삭제할 할 일의 ID와 상태값을 가져옵니다
    const { id, status } = await request.json();

    // ID가 없거나 상태값이 유효하지 않은 경우 400 에러를 반환합니다
    if (!id) {
      return NextResponse.json(
        { error: "ID는 필수 항목입니다" },
        { status: 400 },
      );
    }
    if (!["TODO", "ON_PROGRESS", "DONE"].includes(status)) {
      return NextResponse.json(
        { error: "유효하지 않은 상태값입니다" },
        { status: 400 },
      );
    }

    // Firestore에서 칸반 데이터를 가져옵니다
    const docRef = doc(FIREBASE_DB, "KanbanData", "board");
    const docSnap = await getDoc(docRef);

    // 칸반 데이터가 존재하지 않는 경우 404 에러를 반환합니다
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "데이터를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    // Firestore에서 가져온 데이터를 칸반 데이터 타입으로 변환합니다
    const currentKanban = docSnap.data() as KanbanData;

    // 해당 상태 배열에서 지정된 ID를 가진 할 일을 필터링하여 제외합니다
    currentKanban[status as TodoStatus] = currentKanban[
      status as TodoStatus
    ].filter((todo) => todo.id !== id);

    // 업데이트된 칸반 데이터를 Firestore에 저장합니다
    await setDoc(docRef, currentKanban);

    // 삭제 성공 메시지와 업데이트된 칸반 데이터를 반환합니다
    return NextResponse.json(
      {
        message: "할 일이 성공적으로 삭제되었습니다",
        kanbanData: currentKanban,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "할 일을 삭제하는 중 에러 발생" },
      { status: 500 },
    );
  }
}

/**
 * PATCH 함수 - 할 일을 부분 수정하는 함수
 * 클라이언트로부터 받은 ID, 상태값, 그리고 업데이트할 데이터를 기반으로 할 일을 수정합니다.
 */
export async function PATCH(request: NextRequest) {
  try {
    // 요청 본문에서 업데이트할 칸반 데이터를 가져옵니다
    const { updatedKanban } = await request.json();

    // 업데이트할 데이터가 없는 경우 400 에러를 반환합니다
    if (!updatedKanban) {
      return NextResponse.json(
        { error: "업데이트할 데이터가 없습니다" },
        { status: 400 },
      );
    }

    // 유효한 KanbanData 구조인지 확인합니다
    if (
      !updatedKanban.TODO ||
      !updatedKanban.ON_PROGRESS ||
      !updatedKanban.DONE ||
      !Array.isArray(updatedKanban.TODO) ||
      !Array.isArray(updatedKanban.ON_PROGRESS) ||
      !Array.isArray(updatedKanban.DONE)
    ) {
      return NextResponse.json(
        { error: "유효하지 않은 칸반 데이터 구조입니다" },
        { status: 400 },
      );
    }

    // Firestore의 칸반 데이터 문서를 참조합니다
    const docRef = doc(FIREBASE_DB, "KanbanData", "board");

    // 업데이트된 칸반 데이터를 Firestore에 저장합니다
    await setDoc(docRef, updatedKanban);

    // 업데이트 성공 메시지와 업데이트된 칸반 데이터를 반환합니다
    return NextResponse.json(
      {
        message: "칸반 보드가 성공적으로 업데이트되었습니다",
        kanbanData: updatedKanban,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "칸반 보드를 업데이트하는 중 에러 발생" },
      { status: 500 },
    );
  }
}
