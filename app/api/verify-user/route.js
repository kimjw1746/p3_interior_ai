import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { Users } from "../../../config/schema";
import { eq } from "drizzle-orm";

export async function POST(req){
  const { user } = await req.json();

  try {
    // 사용자가 이미 DB에 있는지 확인
    const userInfo = await db.select().from(Users).where(
      eq(Users.email, user?.primaryEmailAddress.emailAddress)
    )
    console.log("User:", userInfo);

    // 없다면 새로 저장
    if(userInfo?.length == 0){
      const SaveResult = await db.insert(Users).values({
        name: user?.fullName,
        email: user?.primaryEmailAddress.emailAddress,
        imageUrl: user?.imageUrl
      }).returning({Users})
      
      return NextResponse.json({'result': SaveResult[0].Users})
    }
    
    // 이미 있다면 기존 정보 반환
    return NextResponse.json({'result': userInfo[0]})

  } catch(e) {
    console.error("Error verifying user:", e);
    return NextResponse.json({error: e})
  }
}
