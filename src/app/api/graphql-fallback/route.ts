// src/app/api/graphql-fallback/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // リクエスト内容をログに記録
  console.error(
    "GraphQL fallback API called - GraphQL endpoint might be misconfigured",
  );

  try {
    const body = await request.json();
    console.error("GraphQL fallback request:", body);
  } catch (e) {
    console.error("Failed to parse request body");
  }

  // 適切なGraphQLエラーレスポンスを返す
  return NextResponse.json(
    {
      errors: [
        {
          message:
            "GraphQLエンドポイントの設定が正しくありません。環境変数を確認してください。",
          extensions: {
            code: "MISCONFIGURED_ENDPOINT",
          },
        },
      ],
    },
    { status: 500 },
  );
}

export async function GET() {
  return NextResponse.json(
    {
      errors: [
        {
          message: "GraphQL endpoints only accept POST requests",
          extensions: {
            code: "METHOD_NOT_ALLOWED",
          },
        },
      ],
    },
    { status: 405 },
  );
}
