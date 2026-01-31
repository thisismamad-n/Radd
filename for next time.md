add material icon theme as a default icon theme.
add one dark pro as a default color theme.
work on radd home page.(The "Executive Dashboard" (Radd Home)
Instead of opening to an empty code editor or a technical "Get Started" guide, the app should open to a personalized Business Dashboard.

The Change: Create a new React-based "Home" view that replaces the default editor area on startup.
Left Column: "Recall" – Recent documents, active research threads, and pinned workspaces.
Center: "Daily Briefing" – AI-generated summary of what was worked on yesterday or pending tasks from the Memory Bank.
Right (RTL friendly): Quick Actions (e.g., "Analyze New PDF", "Draft Report").
Why: Business users think in "Projects" and "Tasks", not "Files" and "Repos".
Files to Modify:
void/src/vs/workbench/contrib/void/browser/react/src/void-onboarding/ (Extend this to be a persistent Dashboard, not just onboarding).
kilocode/webview-ui/src/components/Welcome/ (Adapt components for the dashboard).
add radd assistant as a default page