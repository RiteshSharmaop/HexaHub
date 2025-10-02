import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { RoomProvider } from './context/RoomContext.tsx'
import { SocketProvider } from './context/SocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <SocketProvider>

    <RoomProvider>
      <App />
    </RoomProvider>
    </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
)
