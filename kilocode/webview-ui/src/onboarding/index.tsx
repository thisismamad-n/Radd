import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../index.css"
import "../codicon-custom.css"
import OnboardingWizard from "./OnboardingWizard"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <OnboardingWizard />
    </StrictMode>,
)
