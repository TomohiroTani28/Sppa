// src/@types/zen-observable-ts.d.ts
declare module 'zen-observable-ts' {
    export interface Observer<T> {
      next?: (value: T) => void;
      error?: (error: any) => void;
      complete?: () => void;
    }
  
    export interface Subscription {
      unsubscribe(): void;
      closed: boolean;
    }
  
    export interface ObservableLike<T> {
      subscribe(observer: Observer<T>): Subscription;
      subscribe(
        onNext: (value: T) => void,
        onError?: (error: any) => void,
        onComplete?: () => void,
      ): Subscription;
    }
  
    export interface Observable<T> extends ObservableLike<T> {
      forEach(callback: (value: T) => void): Promise<void>;
      map<R>(callback: (value: T) => R): Observable<R>;
      filter(callback: (value: T) => boolean): Observable<T>;
      flatMap<R>(callback: (value: T) => ObservableLike<R>): Observable<R>;
      from<R>(observable: ObservableLike<R> | R[] | Promise<R>): Observable<R>;
      of<R>(...args: R[]): Observable<R>;
    }
  
    export default Observable;
  }
  
  declare namespace ZenObservable {
    export interface Observer<T> {
      next?: (value: T) => void;
      error?: (error: any) => void;
      complete?: () => void;
    }
  
    export interface Subscription {
      unsubscribe(): void;
      closed: boolean;
    }
  }