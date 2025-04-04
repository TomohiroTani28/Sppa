// src/realtime/chat-listener.ts
import { gql, FetchResult } from "@apollo/client";
import graphqlClientPromise from "@/lib/hasura-client";
import { Observable } from "rxjs";

const CHAT_SUBSCRIPTION = gql`
  subscription ChatMessages($chatId: UUID!) {
    chat_messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
      id
      sender_id
      receiver_id
      message_text
      translated_text
      is_read
      created_at
    }
  }
`;

export const subscribeToChat = (chatId: string, callback: (messages: any[]) => void) => {
  return new Observable((observer) => { // asyncを削除
    graphqlClientPromise().then((graphqlClient) => { // graphqlClientPromise()の解決をthenで行う。
      const subscription = graphqlClient.subscribe({
        query: CHAT_SUBSCRIPTION as any,
        variables: { chatId },
      }).subscribe({
        next: (response: FetchResult<any>) => {
          if (response.data) {
            observer.next(response.data.chat_messages);
            callback(response.data.chat_messages);
          }
        },
        error: (err: Error) => {
          console.error("Chat subscription error:", err);
          observer.error(err);
        },
        complete: () => observer.complete(),
      });

      return () => subscription.unsubscribe(); // クリーンアップ関数を同期的に返す
    });
  });
};