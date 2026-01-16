import './index.css'
import './utils/i18n.ts'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import EventPage from './components/Page/EventPage'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EventPage />
  </StrictMode>
)
