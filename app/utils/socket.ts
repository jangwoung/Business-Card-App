let socket: WebSocket;

if (typeof window !== "undefined") {
  socket = new WebSocket(
    "wss://go-websocket-server-675426360044.asia-northeast1.run.app/ws"
  );
}

export { socket };
