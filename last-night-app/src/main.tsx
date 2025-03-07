import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GlobalContextHandler from './GlobalContextHandler.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalContextHandler>
      <App />
    </GlobalContextHandler>
  </StrictMode>,
)
