/*
 * ALL FEEDBACK PAGE
 * Displays feedback items across all projects and sessions.
 * Feedback can be filtered by status, priorty, and category.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { feedbackApi } from "../api/checkpointApi";
import {
	FEEDBACK_CATEGORIES, FEEDBACK_PRIORITIES, FEEDBACK_STATUSES,
	type Feedback, type FeedbackCategory, type FeedbackPriority, type FeedbackStatus,
} from "../types";

/*
 * FEEDBACK FILTERS
 * Stores the currently selected filters used when searching feedback.
 * Empty strings indicate that no filter has been applied.
 */
interface FeedbackFilters {
	status: FeedbackStatus | "";
	priority: FeedbackPriority | "";
	category: FeedbackCategory | "";
}

/*
 * ALL FEEDBACK PAGE
 * Loads feedback from the backend and updates the results whenever filters are changed.
 */
export function AllFeedbackPage() {
	const [items, setItems] = useState<Feedback[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<FeedbackFilters>({
		status: "",
		priority: "",
		category: "",
	});

	/*
	 * LOAD FEEDBACK
	 * Retrieves feedback using the currently selected filters.
	 */
	function load() {
		 setLoading(true);

		 const params = {
			 status: filters.status || undefined,
			 priority: filters.priority || undefined,
			 category: filters.category || undefined,
		 };

		 feedbackApi
			.search(params)
			.then((data) => setItems(data))
			.catch(() => setItems([]))
			.finally(() => setLoading(false));
	}

	/*
	 * FILTER CHANGES
	 * Reloads the feedback list whenever a filter value changes.
	 */
	useEffect(() => {
		load();
	}, [filters.status, filters.priority, filters.category]);

	return (
		<div>
			<h1>All Feedback</h1>

			<div className="filter-bar">
				<label>
					Status
					<select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as FeedbackStatus | "" })}>
						<option value="">All</option>
						{FEEDBACK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
					</select>
				</label>
				<label>
					Priority
					<select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value as FeedbackPriority | "" })}>
						<option value="">All</option>
						{FEEDBACK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
					</select>
				</label>
				<label>
					Category
					<select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value as FeedbackCategory | "" })}>
						<option value="">All</option>
						{FEEDBACK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
					</select>
				</label>
			</div>

			{/*
			 * FEEDBACK RESULTS
			 * Displays a loading message, empty state, or the filtered feedback results.
			 */}
			{loading ? (
				<p>Loading...</p>
			) : items.length === 0 ? (
				<p className="empty-state">No feedback matches those filters.</p>
			) : (
				<table className="data-table">
					<thead>
						<tr><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Session</th></tr>
					</thead>
					<tbody>
						{items.map((f) => (
							<tr key={f.id}>
								<td><Link to={`/projects/${f.projectId}/sessions/${f.playtestSessionId}`}>{f.title}</Link></td>
								<td><span className={`badge badge-category-${f.category.toLowerCase()}`}>{f.category}</span></td>
								<td>{f.priority}</td>
								<td><span className={`badge badge-${f.status.toLowerCase()}`}>{f.status}</span></td>
								<td>{f.sessionName}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}