/*
 * ALL FEEDBACK PAGE
 * Displays feedback items across all projects and sessions.
 * Feedback can be filtered by status, priority, category and title search.
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { feedbackApi } from "../api/checkpointApi";
import { Badge } from "../components/Badge";
import { EmptyState, SearchField, SkeletonBlock } from "../components/UI";
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

const NO_FILTERS: FeedbackFilters = { status: "", priority: "", category: ""};

const READABLE: Record<string, string> = {
	InProgress: "In Progress",
	FeatureRequest: "Feature Request",
};

/*
 * ALL FEEDBACK PAGE
 * Loads feedback from the backend and updates the results whenever filters are changed.
 */
export function AllFeedbackPage() {
	const [items, setItems] = useState<Feedback[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<FeedbackFilters>(NO_FILTERS);
	const [search, setSearch] = useState("");

	/*
	 * LOAD FEEDBACK
	 * Retrieves feedback using the currently selected filters.
	 */
	useEffect(() => {
		 setLoading(true);

		 feedbackApi
			.search({
				status: filters.status || undefined,
				priority: filters.priority || undefined,
				category: filters.category || undefined,
			})
			.then(setItems)
			.catch(() => setItems([]))
			.finally(() => setLoading(false));
	}, [filters.status, filters.priority, filters.category]);

	/*
	 * FILTER CHANGES
	 * Reloads the feedback list whenever a filter value changes.
	 */
	const visible = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return items;
		return items.filter((f) => f.title.toLowerCase().includes(term));
	}, [items, search]);

	const activeChips = [
		search.trim() && { key: "search", label: `Search "${search.trim()}"`, clear: () => setSearch("") },
		filters.status && {
			key: "status",
			label: `Status: ${READABLE[filters.status] ?? filters.status}`,
			clear: () => setFilters((f) => ({ ...f, status: "" })),
		},
		filters.priority && {
			key: "priority",
			label: `Priority: ${filters.priority}`,
			clear: () => setFilters((f) => ({ ...f, priority: "" })),
		},
		filters.category && {
			key: "category",
			label: `Category: ${READABLE[filters.category] ?? filters.category}`,
			clear: () => setFilters((f) => ({ ...f, category: "" })),
		},
	].filter(Boolean) as { key: string; label: string; clear: () => void }[];

	function clearAll() {
		setFilters(NO_FILTERS);
		setSearch("");
	}

	return (
		<div>
			<div className="page-head">
				<h1>All Feedback</h1>
				<p>Everything reported across every project and playtest session.</p>
			</div>

			<div className="toolbar">
				<SearchField
					value={search}
					onChange={setSearch}
					placeholder="Search feedback by title"
					label="Search feedback by title"
				/>

				<div className="filter-bar">
					<label>
						Status
						<select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as FeedbackStatus | "" })}>
							<option value="">All</option>
							{FEEDBACK_STATUSES.map((s) => <option key={s} value={s}>{READABLE[s] ?? s}</option>)}
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
							{FEEDBACK_CATEGORIES.map((c) => <option key={c} value={c}>{READABLE[c] ?? c}</option>)}
						</select>
					</label>
				</div>
			</div>

			{/*
			  * ACTIVE CHIPS
			  * Displays the active filter chips individually for quick view and removal.
			  */}
			{(activeChips.length > 0 || !loading) && (
				<div className="chip-row">
					{activeChips.map((chip) => (
						<span className="chip" key={chip.key}>
							{chip.label}
							<button type="button" onClick={chip.clear} aria-label={`Remove filter: ${chip.label}`}>
								x
							</button>
						</span>
					))}
					{activeChips.length > 0 && (
						<button type="button" className="btn btn-ghost btn-small" onClick={clearAll}>
							Clear All
						</button>
					)}
					{!loading && (
						<span className="result-count" role="status">
							{visible.length === items.length
								? `${visible.length} ${visible.length === 1 ? "item" : "items"}`
								: `${visible.length} of ${items.length} items`}
						</span>
					)}
				</div>
			)}

			{/*
			 * FEEDBACK RESULTS
			 * Displays a loading message, empty state, or the filtered feedback results.
			 */}
			{loading ? (
				<SkeletonBlock rows={5} />
			) : visible.length === 0 ? (
				<EmptyState title="No feedback matches these filters.">
					{activeChips.length > 0
						? "Clear a filter to widen the search."
						: "Feedback reports will appear here once received."}
				</EmptyState>
			) : (
				<div className="table-scroll">
					<table className="data-table">
						<thead>
							<tr><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Session</th></tr>
						</thead>
						<tbody>
							{visible.map((f) => (
								<tr key={f.id}>
									<td><Link to={`/projects/${f.projectId}/sessions/${f.playtestSessionId}`}>{f.title}</Link></td>
									<td><Badge kind="category" value={f.category} /></td>
									<td><Badge kind="priority" value={f.priority} /></td>
									<td><Badge kind="status" value={f.status} /></td>
									<td className="muted">{f.sessionName}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}