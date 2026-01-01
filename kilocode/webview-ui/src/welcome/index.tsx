import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../index.css"
import "../codicon-custom.css"
import WelcomeDashboard from "./WelcomeDashboard"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WelcomeDashboard />
    </StrictMode>,
)
