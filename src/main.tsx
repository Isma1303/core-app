import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import config from 'devextreme/core/config'
import { licenseKey } from './devextreme-license.ts'

config({ licenseKey })

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)
