/*
 * SESSION DETAIL PAGE
 * Displays a playtest session, allowing testers to submit feedback,  and allows feedback to be triaged or deleted.
 */

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { feedbackApi, sessionsApi } from "../api/checkpointApi";
import { ApiError } from "../api/client";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FieldError } from "../components/FieldError";
import {
	FEEDBACK_CATEGORIES, FEEDBACK_PRIORITIES, FEEDBACK_STATUSES,
	type Feedback, type FeedbackCategory, type FeedbackPriority, type FeedbackStatus, type PlaytestSession,
} from "../types";

/*
 * EMPTY FEEDBACK FORM
 * The initial values used when submitting a new feedback item.
 */
const emptyForm = {
	title: "", description: "", submittedBy: "",
	category: "Gameplay" as FeedbackCategory,
	priority: "Medium" as FeedbackPriority,
	expectedBehaviour: "", actualBehaviour: "", reproductionSteps: "", environment: "",
};

/*
 * PLAYTEST SESSION DETAIL PAGE
 * Displays session information and manages associated feedback.
 */
export function SessionDetailPage() {
	const { projectId, sessionId } = useParams();
	const pId = Number(projectId);
	const sId = Number(sessionId);

	const [session, setSession] = useState<PlaytestSession | null>(null);
	const [items, setItems] = useState<Feedback[]>([]);
	const [form, setForm] = useState(emptyForm);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();
	const [submitting, setSubmitting] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Feedback | null>(null);
	const [expandedId, setExpandedId] = useState<number | null>(null);

	/*
	 * LOAD SESSION AND FEEDBACK
	 * Retrieves the chosen session and associated feedback.
	 */
	function loadAll() {
		sessionsApi.getById(pId, sId).then(setSession);
		feedbackApi.getForSession(pId, sId).then(setItems);
	}

	useEffect(loadAll, [pId, sId]);

	/*
	 * SUBMIT FEEDBACK
	 * Sends new feedback items to the backend and reloads the session data.
	 */
	async function handleSubmitFeedback(e : FormEvent) {
		 e.preventDefault();
		 setFieldErrors(undefined);
		 setSubmitting(true);
		 try {
			 await feedbackApi.create(pId, sId, form);
			 setForm(emptyForm);
			 loadAll();
		 } catch (err) {
			 if (err instanceof ApiError) setFieldErrors(err.fieldErrors);
		 } finally {
			 setSubmitting(false);
		 }
	}

	/*
	 * UPDATE FEEDBACK TRIAGE
	 * Updates the category, priority, or status for an existing feedback item.
	 * Defect details are also included because the backend validates them when category is changed/set to defect.
	 */
	async function handleTriageChange(item: Feedback, patch: Partial<Feedback>) {
		const updated = { ...item, ...patch };
		try {
			await feedbackApi.update(pId, sId, item.id, {
				category: updated.category,
				priority: updated.priority,
				status: updated.status,
				expectedBehaviour: updated.expectedBehaviour ?? undefined,
				actualBehaviour: updated.actualBehaviour ?? undefined,
				reproductionSteps: updated.reproductionSteps ?? undefined,
				environment: updated.environment ?? undefined,
			});
			loadAll();
		} catch (err) {
			if (err instanceof ApiError) {
				alert("Could not update: " + (err.fieldErrors ? Object.values(err.fieldErrors).flat().join(" ") : err.message));
			}
		}
	}

	/*
	 * DELETE FEEDBACK
	 * Removes the selected feedback item after confirmation.
	 */
	async function handleDeleteFeedback() {
		if (!deleteTarget) return;
		await feedbackApi.remove(pId, sId, deleteTarget.id);
		setDeleteTarget(null);
		loadAll();
	}

	if (!session) return <p>Loading...</p>;
	const isDefect = form.category === "Defect";

	return (
		<div>
			<Link to={`/projects/${pId}`} className="back-link">&larr; Back to project</Link>

			<h1>{session.name}</h1>
			<p className="muted">
				{new Date(session.sessionDate).toLocaleDateString()} · v{session.gameVersion} ·{" "}
				<span className={`badge badge-${session.status.toLowerCase()}`}>{session.status}</span>
			</p>

			<form className="card form-card" onSubmit={handleSubmitFeedback}>
				<h2>Submit Feedback</h2>
				<label>
					Title
					<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
					<FieldError errors={fieldErrors} field="Title" />
				</label>
				<label>
					Description
					<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
					<FieldError errors={fieldErrors} field="Description" />
				</label>
				<label>
					Your name (optional)
					<input value={form.submittedBy} onChange={(e) => setForm({ ...form, submittedBy: e.target.value })} placeholder="Anonymous" />
				</label>

				<div className="form-row">
					<label>
						Category
						<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as FeedbackCategory })}>
							{FEEDBACK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
						</select>
					</label>
					<label>
						Priority
						<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as FeedbackPriority })}>
							{FEEDBACK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
						</select>
					</label>
				</div>

				{isDefect && (
					<div className="defect-fields">
						<p className="section-hint">Defect details (required for defect reports)</p>
						<label>
							Expected behaviour
							<textarea value={form.expectedBehaviour} onChange={(e) => setForm({ ...form, expectedBehaviour: e.target.value })} />
							<FieldError errors={fieldErrors} field="ExpectedBehaviour" />
						</label>
						<label>
							Actual behaviour
							<textarea value={form.actualBehaviour} onChange={(e) => setForm({ ...form, actualBehaviour: e.target.value })} />
							<FieldError errors={fieldErrors} field="ActualBehaviour" />
						</label>
						<label>
							Reproduction steps
							<textarea value={form.reproductionSteps} onChange={(e) => setForm({ ...form, reproductionSteps: e.target.value })} placeholder={"1. ...\n2. ...\n3. ..."} />
							<FieldError errors={fieldErrors} field="ReproductionSteps" />
						</label>
						<label>
							Environment
							<textarea value={form.environment} onChange={(e) => setForm({ ...form, environment: e.target.value })} placeholder="e.g. Windows 11, RTX 3060, build 0.4.2" />
							<FieldError errors={fieldErrors} field="Environment" />
						</label>
					</div>
				)}

				<button className="btn btn-primary" type="submit" disabled={submitting}>
					{submitting ? "Submitting..." : "Submit Feedback"}
				</button>
			</form>

			<h2>Feedback for this Session ({items.length})</h2>
			{items.length === 0 ? (
				<p className="empty-state">No feedback submitted yet.</p>
			) : (
				<div className="feedback-list">
				{items.map((item) => (
					<div className="card feedback-item" key={item.id}>
						<div className="feedback-summary" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
							<div>
								<span className={`badge badge-category-${item.category.toLowerCase()}`}>{item.category}</span>
								<strong className="feedback-title">{item.title}</strong>
							</div>
							<div className="feedback-controls" onClick={(e) => e.stopPropagation()}>
								<select value={item.priority} onChange={(e) => handleTriageChange(item, { priority: e.target.value as FeedbackPriority })}>
									{FEEDBACK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
								</select>
								<select value={item.status} onChange={(e) => handleTriageChange(item, { status: e.target.value as FeedbackStatus })}>
									{FEEDBACK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
								</select>
								<button className="btn btn-danger btn-small" onClick={() => setDeleteTarget(item)}>Delete</button>
							</div>
						</div>

						{expandedId === item.id && (
							<div className="feedback-detail">
								<p>{item.description}</p>
								<p className="muted">Submitted by {item.submittedBy}</p>
								{item.category === "Defect" && (
									<div className="defect-readout">
										<div><strong>Expected:</strong> {item.expectedBehaviour}</div>
										<div><strong>Actual:</strong> {item.actualBehaviour}</div>
										<div><strong>Steps to reproduce:</strong> {item.reproductionSteps}</div>
										<div><strong>Environment:</strong> {item.environment}</div>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		)}

		<ConfirmDialog
			open={deleteTarget !== null}
			title="Delete feedback?"
			message={`This will permanently delete "${deleteTarget?.title}". This action cannot be undone.`}
			onConfirm={handleDeleteFeedback}
			onCancel={() => setDeleteTarget(null)}
		/>
	</div>
	);
}