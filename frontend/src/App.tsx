/*
 * APPLICATION ROUTING
 * Defines the routes used by the Checkpoint React frontend. 
 * Each route maps a URL to the page component responsible for displaying it.
 */
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { SessionDetailPage } from "./pages/SessionDetailPage";
import { AllFeedbackPage } from "./pages/AllFeedbackPage";

/*
 * APP
 * Provides the application's route structure.
 * The shared Layout wraps all pages so navigation and common UI remain consistent.
 */
export default function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<DashboardPage />} />
				<Route path="/projects" element={<ProjectsPage />} />
				<Route
					path="/projects/:projectId"
					element={<ProjectDetailPage />} 
				/>
				<Route 
					path="/projects/:projectId/sessions/:sessionId"
					element={<SessionDetailPage />}
				/>
				<Route path="/feedback" element={<AllFeedbackPage />} />
			</Route>
		</Routes>
	);
}