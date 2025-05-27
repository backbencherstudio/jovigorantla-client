// // socket.ts
// import { io, Socket } from 'socket.io-client';

// let socket: Socket | null = null;

// export const connectSocket = (userId: string): Socket => {
//   if (!socket) {
//     socket = io(`${import.meta.env.VITE_BASE_URL.replace('/api', '')}`, {
//       query: { userId },
//       transports: ['websocket'], // optional for stability
//     });
//   }
//   return socket;
// };

// export const getSocket = (): Socket | null => socket;


// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io(`${import.meta.env.VITE_BASE_URL.replace('/api', '')}`, {
      transports: ['websocket'],
      withCredentials: true, // ✅ send cookies with handshake
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;


