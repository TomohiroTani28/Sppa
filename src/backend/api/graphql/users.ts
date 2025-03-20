// src/backend/api/graphql/users.ts
import { gql } from '@apollo/client';
import { print } from 'graphql';

/**
 * createUser mutationドキュメント
 */
const CREATE_USER_DOC = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $passwordHash: String!
    $role: user_role!
    $profilePicture: String
  ) {
    insert_users(
      objects: {
        name: $name
        email: $email
        password_hash: $passwordHash
        role: $role
        profile_picture: $profilePicture
      }
    ) {
      returning {
        id
        name
        email
        role
        profile_picture
      }
    }
  }
`;

/**
 * createUserAPI - 新規ユーザーを作成
 * @param variables name, email, passwordHash, role, profilePicture
 */
export const createUserAPI = async (variables: Record<string, any>) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? '',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET ?? '',
      },
      body: JSON.stringify({
        query: print(CREATE_USER_DOC),
        variables,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.error('Error:', data);
    throw new Error('Failed to create user');
  }
  return data;
};

/**
 * getUserById queryドキュメント
 */
const GET_USER_BY_ID_DOC = gql`
  query GetUserById($id: UUID!) {
    users(where: { id: { _eq: $id } }) {
      id
      name
      email
      role
      profile_picture
    }
  }
`;

/**
 * getUserByIdAPI - ユーザー情報をID指定で取得
 */
export const getUserByIdAPI = async (variables: { id: string }) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT ?? '',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET ?? '',
      },
      body: JSON.stringify({
        query: print(GET_USER_BY_ID_DOC),
        variables,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.error('Error:', data);
    throw new Error('Failed to fetch user');
  }
  return data;
};
