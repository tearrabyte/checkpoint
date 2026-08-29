/* 
 * CHECKPOINT API
 * Provides typed API methods for communicating with the Checkpoint backend.
 */
import { api } from "./client";
import type {
	Project,
	ProjectInput,
	PlaytestSession,
	PlaytestSessionCreateInput,
	PlaytestSessionUpdateInput,
	Feedback,
	FeedbackCreateInput,
	FeedbackUpdateInput,
	FeedbackStatus,
	FeedbackPriority,
	FeedbackCategory,
	DashboardSummary,
} from "../types";

/*
 * PROJECT API
 * Provides CRUD operations for projects, matching ProjectsController routes.
 */
export const projectsApi = {
	getAll: () => api.get<Project[]>("/projects"),
	getById: (id: number) => api.get<Project>(`/projects/${id}`),
	create: (data: ProjectInput) => api.post<Project>("/projects", data),
	update: (id: number, data: ProjectInput) => api.put<Project>(`/projects/${id}`, data),
	remove: (id: number) => api.delete<void>(`/projects/${id}`),
};

/* 
 * PLAYTEST SESSION API
 * Provides CRUD operations for playtest sessions, matching PlaytestSessionsController routes.
 */
export const sessionsApi = {
	getAll: (projectId: number) => api.get<PlaytestSession[]>(`/projects/${projectId}/sessions`),
	getById: (projectId: number, id: number) => 
		api.get<PlaytestSession>(`/projects/${projectId}/sessions/${id}`),
	create: (projectId: number, data: PlaytestSessionCreateInput) =>
		api.post<PlaytestSession>(`/projects/${projectId}/sessions`, data),
	update: (projectId: number, id: number, data: PlaytestSessionUpdateInput) =>
		api.put<PlaytestSession>(`/projects/${projectId}/sessions/${id}`, data),
	remove: (projectId: number, id: number) =>
		api.delete<void>(`/projects/${projectId}/sessions/${id}`),
};

/*
 * FEEDBACK API
 * Provides CRUD operations for feedback items, matching FeedbackController routes.
 */
export const feedbackApi = {
	getForSession: (projectId: number, sessionId: number) => 
		api.get<Feedback[]>(`/projects/${projectId}/sessions/${sessionId}/feedback`),
	getById: (projectId: number, sessionId: number, id: number) => 
		api.get<Feedback>(`/projects/${projectId}/sessions/${sessionId}/feedback/${id}`),
	create: (projectId: number, sessionId: number, data: FeedbackCreateInput) =>
		api.post<Feedback>(`/projects/${projectId}/sessions/${sessionId}/feedback`, data),
	update: (projectId: number, sessionId: number, id: number, data: FeedbackUpdateInput) =>
		api.put<Feedback>(`/projects/${projectId}/sessions/${sessionId}/feedback/${id}`, data),
	remove: (projectId: number, sessionId: number, id: number) =>
		api.delete<void>(`/projects/${projectId}/sessions/${sessionId}/feedback/${id}`),
	search: (filters: {
		status?: FeedbackStatus;
		priority?: FeedbackPriority;
		category?: FeedbackCategory;
		sessionId?: number;
		projectId?: number;
	}) => {
		const params = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !==undefined) {
				params.append(key, String(value));
			}
		});

		const queryString = params.toString();

		return api.get<Feedback[]>(`/feedback${queryString ? `?${queryString}` : ""}`);
	},
};

/* 
 * DASHBOARD API
 * Provides the read-only dashboard summary, matching DashboardController.
 */
export const dashboardApi = {
	getSummary: () => api.get<DashboardSummary>("/dashboard"),
};