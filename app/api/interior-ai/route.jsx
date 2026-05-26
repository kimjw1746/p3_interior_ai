import { NextResponse } from "next/server";
import axios from "axios";
import { storage } from '../../../config/firebaseConfig';
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";

async function ConvertImageToBase64(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
    throw new Error(`Invalid output image URL for conversion: ${imageUrl}`);
  }
  const resp = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 15000 });
  const contentType = resp.headers?.['content-type'] || 'image/png';
  const base64ImageRaw = Buffer.from(resp.data).toString('base64');
  return `data:${contentType};base64,${base64ImageRaw}`;
}

export async function POST(request) {
  try {
    console.log("API: [Start] POST Request Received.");

    const replicateToken = process.env.REPLICATE_API_TOKEN?.trim();

    console.log("API: [Config] REPLICATE_API_TOKEN exists:", !!replicateToken);
    console.log("API: [Config] REPLICATE_API_TOKEN prefix:", replicateToken?.slice(0, 3));
    console.log("API: [Config] REPLICATE_API_TOKEN length:", replicateToken?.length);

    if (!replicateToken) {
      console.error("API: [Config] Missing REPLICATE_API_TOKEN");
      return NextResponse.json(
        { error: "Server misconfiguration: REPLICATE_API_TOKEN is missing." },
        { status: 500 }
      );
    }

    const { imageUrl, roomType, designType, additionalReq, userEmail } = await request.json();
    console.log("API: [Payload] imageUrl:", imageUrl, "| roomType:", roomType, "| designType:", designType, "| userEmail:", userEmail);

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Invalid imageUrl." },
        { status: 400 }
      );
    }

    // adirik/interior-design (v1) 모델 규격에 맞는 프롬프트 조립
    const prompt = `A highly detailed, photorealistic ${roomType || 'room'} designed in a beautiful ${designType || 'modern'} style. ${additionalReq || ''}`;

    const input = {
      image: imageUrl,
      prompt: prompt
    };

    console.log("API: [Replicate] Creating prediction for adirik/interior-design (v1) via REST API...");
    console.log("API: [Replicate] Prompt:", prompt);

    const createResp = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        input
      },
      {
        headers: {
          "Authorization": `Token ${replicateToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const predictionId = createResp.data.id;
    console.log(`API: [Replicate] Prediction created. ID: ${predictionId}. Starting polling...`);

    // 10분 간격 폴링
    let outputUrl = "";
    const startTime = Date.now();

    while (Date.now() - startTime < 600000) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pollResp = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: { "Authorization": `Token ${replicateToken}` }
        }
      );

      const status = pollResp.data.status;
      console.log(`API: [Replicate] Polling: [${status}] (${Math.round((Date.now() - startTime) / 1000)}s)`);

      if (status === "succeeded") {
        const output = pollResp.data.output;
        if (output && typeof output.url === 'function') {
          outputUrl = output.url();
        } else if (Array.isArray(output)) {
          outputUrl = output[0];
        } else if (typeof output === 'string') {
          outputUrl = output;
        } else {
          outputUrl = output ? String(output) : "";
        }
        break;
      } else if (status === "failed" || status === "canceled") {
        throw new Error(`Replicate prediction ${status}: ${JSON.stringify(pollResp.data.error || '')}`);
      }
    }

    if (!outputUrl || !outputUrl.startsWith("http")) {
      throw new Error("Replicate prediction timed out or returned an invalid URL.");
    }
    console.log("API: [OutputURL] Extracted URL:", outputUrl);

    // 과제 스펙의 ConvertImageToBase64 구동
    const base64Image = await ConvertImageToBase64(outputUrl);
    const fileName = Date.now() + '.png';
    const storageRef = ref(storage, 'interior-ai/' + fileName);

    // Firebase Storage에 업로드
    await uploadString(storageRef, base64Image, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    console.log("downloadUrl: ", downloadUrl);

    // DB 저장 로직 추가 (지시서 스펙과 100% 동일)
    const dbResult = await db.insert(AiGeneratedImage).values({
      roomType: roomType,
      designType: designType,
      orgImage: imageUrl,
      aiImage: downloadUrl,
      userEmail: userEmail
    }).returning({id: AiGeneratedImage.id});

    console.log("DB Insert successful. Result:", dbResult);

    return NextResponse.json({ result: downloadUrl }, { status: 200 });
  } catch (e) {
    console.error("API: [Error] Trace: ", e);

    const message =
      e?.response?.data?.detail ||
      e?.response?.data?.error ||
      e?.message ||
      "Internal server error";

    const status =
      e?.response?.status ||
      (String(message).toLowerCase().includes("authentication token") ? 401 : 500);

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
