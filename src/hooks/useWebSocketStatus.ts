import { useEffect, useState } from 'react';

export function useWebSocketStatus(wsEndpoint: string) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let ws: WebSocket;
    
    const connect = () => {
      setStatus('connecting');
      setError(null);
      
      try {
        ws = new WebSocket(wsEndpoint);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          setStatus('connected');
        };
        
        ws.onclose = (event) => {
          console.log('WebSocket disconnected', event.code, event.reason);
          setStatus('disconnected');
          setError(`WebSocket closed: ${event.code} ${event.reason}`);
          
          // 自動再接続
          setTimeout(connect, 5000);
        };
        
        ws.onerror = (event) => {
          console.error('WebSocket error', event);
          setError('WebSocket connection error');
        };
      } catch (err) {
        console.error('Failed to create WebSocket', err);
        setStatus('disconnected');
        setError(`Failed to create WebSocket: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    connect();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [wsEndpoint]);
  
  return { status, error };
} 