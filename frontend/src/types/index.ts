/*
 * API TYPES
 * Defines the TypeScript types used by the React frontend to represent data received from and sent to the Checkpoint ASP.NET Core API.
 * These types match the public API DTOs and enum values used by the backend.
 */

/*
 * FEEDBACK ENUM TYPES
 * Defines the allowed category, priority, and status values used by feedback.
 */
export type FeedbackCategory =
	| "Defect"
	| "Usability"
	| "Gameplay"
	| "Balance"
	| "Accessibility"
	| "FeatureRequest";

export type FeedbackPriority =
	| "Low"
	| "Medium"
	| "High"
	| "Critical";

export type FeedbackStatus =
	| "New"
	| "InProgress"
	| "Resolved"
	| "Rejected";
	
export type SessionStatus =
	| "Planned"
	| "InProgress"
	| "Completed";

/*
 * FEEDBACK AND SESSION OPTIONS
 * Provides reusable lists of allowed enum values for dropdowns and other form controls in React.
 */
export const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
	"Defect",
	"Usability",
	"Gameplay",
	"Balance",
	"Accessibility",
	"FeatureRequest",
];

export const FEEDBACK_PRIORITIES: FeedbackPriority[] = [
	"Low",
	"Medium",
	"High",
	"Critical",
];

export const FEEDBACK_STATUSES: FeedbackStatus[] = [
	"New",
	"InProgress",
	"Resolved",
	"Rejected",
];

export const SESSION_STATUSES: SessionStatus[] = [
	"Planned",
	"InProgress",
	"Completed",
];

/*
 * PROJECT
 * Represents a project returned by the API.
 */
export interface Project {
	 id: number;
	 name: string;
	 description: string;
	 createdAt: string;
	 updatedAt: string;
	 sessionCount: number;
 }

/*
 * PROJECT INPUT
 * Represents the data required when creating or updating a project.
 */
export interface ProjectInput {
	 name: string;
	 description: string;
 }

/*
 * PLAYTEST SESSION
 * Represents a playtest session returned by the API.
 */
export interface PlaytestSession {
	 id: number;
	 projectId: number;
	 name: string;
	 sessionDate: string;
	 gameVersion: string;
	 notes: string;
	 status: SessionStatus;
	 createdAt: string;
	 updatedAt: string;
	 feedbackCount: number;
 }

/*
 * PLAYTEST SESSION CREATE INPUT
 * Represents the data required when creating a new playtest session.
 */
export interface PlaytestSessionCreateInput {
	 name: string;
	 sessionDate: string;
	 gameVersion: string;
	 notes: string;
 }

/*
 * PLAYTEST SESSION UPDATE INPUT
 * Represents the editable data required when updating a playtest session.
 */
export interface PlaytestSessionUpdateInput extends PlaytestSessionCreateInput {
	 status: SessionStatus;
 }

/* 
 * FEEDBACK
 * Represents a feedback item returned by the API.
 */
export interface Feedback {
	id: number;
	playtestSessionId: number;
	sessionName: string;
	projectId: number;
	title: string;
	description: string;
	submittedBy: string;
	category: FeedbackCategory;
	priority: FeedbackPriority;
	status: FeedbackStatus;
	expectedBehaviour?: string | null;
	actualBehaviour?: string | null;
	reproductionSteps?: string | null;
	environment?: string | null;
	createdAt: string;
	updatedAt: string;
}

/*
 * FEEDBACK CREATE INPUT
 * Represents the data required to create a feedback item.
 */
export interface FeedbackCreateInput
{
	title: string;
	description: string;
	submittedBy: string;
	category: FeedbackCategory;
	priority: FeedbackPriority;
	expectedBehaviour?: string;
	actualBehaviour?: string;
	reproductionSteps?: string;
	environment?: string;
}

/*
 * FEEDBACK UPDATE INPUT
 * Represents the editable data required to update a feedback item.
 */
export interface FeedbackUpdateInput
{
	category: FeedbackCategory;
	priority: FeedbackPriority;
	status: FeedbackStatus;
	expectedBehaviour?: string;
	actualBehaviour?: string;
	reproductionSteps?: string;
	environment?: string;
}

/* 
 * DASHBOARD SUMMARY
 * Represents the information returned by the dashboard API.
 */
export interface DashboardSummary {
	totalProjects: number;
	totalPlaytestSessions: number;
	totalFeedbackItems: number;
	feedbackByCategory: Record<string, number>;
	feedbackByStatus: Record<string, number>;
	feedbackByPriority: Record<string, number>;
	openCriticalOrHighCount: number;

	recentPlaytestSessions: {
		id: number;
		projectId: number;
		projectName: string;
		name: string;
		sessionDate: string;
		status: SessionStatus;
		feedbackCount: number;
	}[];
}

/*
 * API VALIDATION ERROR
 * Represents the validation response when a request fails model validation.
 */
export interface ApiValidationError {
	title?: string;
	status?: number;
	errors?: Record<string, string[]>;
	message?: string;
}