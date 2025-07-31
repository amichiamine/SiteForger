import { useEffect, useRef, useState } from 'react';
import { websocketService } from '../services/websocket';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const listenersRef = useRef<Map<string, Function>>(new Map());

  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
    };

    const handleError = (error: any) => {
      setConnectionError(error.message || 'WebSocket error');
    };

    const handleMaxReconnectAttempts = () => {
      setConnectionError('Unable to connect to server');
    };

    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('error', handleError);
    websocketService.on('maxReconnectAttemptsReached', handleMaxReconnectAttempts);

    return () => {
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('error', handleError);
      websocketService.off('maxReconnectAttemptsReached', handleMaxReconnectAttempts);
    };
  }, []);

  const send = (type: string, payload: any) => {
    websocketService.send(type, payload);
  };

  const subscribe = (event: string, callback: Function) => {
    websocketService.on(event, callback);
    listenersRef.current.set(event, callback);

    return () => {
      websocketService.off(event, callback);
      listenersRef.current.delete(event);
    };
  };

  useEffect(() => {
    return () => {
      // Cleanup all listeners on unmount
      listenersRef.current.forEach((callback, event) => {
        websocketService.off(event, callback);
      });
    };
  }, []);

  return {
    isConnected,
    connectionError,
    send,
    subscribe
  };
};