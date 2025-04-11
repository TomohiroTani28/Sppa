import { graphqlClient } from "@/lib/graphql-client";
import { gql } from "@apollo/client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// サインアップミューテーション
const CREATE_USER = gql`
  mutation CreateUser($user: users_insert_input!) {
    insert_users_one(object: $user) {
      id
      name
      email
      role
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    // バリデーション
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["tourist", "therapist"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // パスワードハッシュ化
    const password_hash = await hash(password, 10);

    // Hasuraにユーザー作成
    const { data, errors } = await graphqlClient.mutate({
      mutation: CREATE_USER,
      variables: { 
        user: {
          name,
          email,
          password_hash,
          role,
          verified_at: new Date().toISOString(), // 自動承認
        } 
      },
    });

    if (errors) {
      console.error("Registration GraphQL errors:", errors);
      return NextResponse.json(
        { error: errors[0].message },
        { status: 500 }
      );
    }

    // 成功レスポンス
    return NextResponse.json({
      id: data.insert_users_one.id,
      name: data.insert_users_one.name,
      email: data.insert_users_one.email,
      role: data.insert_users_one.role,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
} 