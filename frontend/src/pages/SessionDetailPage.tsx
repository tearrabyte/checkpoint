/*
 * SESSION DETAIL PAGE
 * Displays a playtest session, allowing testers to submit feedback,  and allows feedback to be triaged or deleted.
 */

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { feedbackApi, sessionsApi } from "../api/checkpointApi";
import { ApiError } from "../api/client";
import { Badge } from "../components/Badge";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FeedbackFormModal } from "../components/FeedbackFormModal";
import { FeedbackItem } from "../components/FeedbackItem";
import { EmptyState, SkeletonBlock } from "../components/UI";
import type { Feedback, PlaytestSession } from "../types";

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
	const [loading, setLoading] = useState(true);

	const [formOpen, setFormOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Feedback | null>(null);
	const [expandedId, setExpandedId] = useState<number | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);

	/*
	 * LOAD SESSION AND FEEDBACK
	 * Retrieves the chosen session and associated feedback.
	 */
	function loadAll() {
		setLoading(true);

		Promise.all([sessionsApi.getById(pId, sId), feedbackApi.getForSession(pId, sId)])
			.then(([loadedSession, loadedFeedback]) => {
				setSession(loadedSession);
				setItems(loadedFeedback);
			})
			.finally(() => setLoading(false));
	}

	useEffect(loadAll, [pId, sId]);

	/*
	 * UPDATE FEEDBACK TRIAGE
	 * Updates the category, priority, or status of an existing feedback item.
	 * Defect details are also included because the backend validates them when category is changed/set to defect.
	 */
	async function handleTriageChange(item: Feedback, patch: Partial<Feedback>) {
		const updated = { ...item, ...patch };
		setActionError(null);

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
				const detail = err.fieldErrors
					? Object.values(err.fieldErrors).flat().join(" ")
					: err.message;
				setActionError(`Could not update "${item.title}". ${detail}`);
			}
		}
	}

	/*
	 * DELETE FEEDBACK
	 * Removes the selected feedback item after confirmation.
	 */
	async function handleDeleteFeedback() {
		if (!deleteTarget) return;

		setActionError(null);

		try {
			await feedbackApi.remove(pId, sId, deleteTarget.id);
			setDeleteTarget(null);
			loadAll();
		} catch (err) {
			if (err instanceof ApiError) {
				setActionError(`Could not delete "${deleteTarget.title}". ${err.message}`);
			}
		}
	}

	if (loading) return <SkeletonBlock rows={5} />;
	if (!session) return <p className="error-text">This playtest session could not be found.</p>;

	return (
		<div>
			<Link to={`/projects/${pId}`} className="back-link">&larr; Back to project</Link>

			<div className="card-panel">
				<div className="detail-header">
					<div>
						<h1>{session.name}</h1>
						<div className="meta-line">
							<span>{new Date(session.sessionDate).toLocaleDateString()}</span>
							<span className="mono">{session.gameVersion}</span>
							<Badge kind="status" value={session.status} />
						</div>
						{session.notes && <p className="muted" style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>{session.notes}</p>}
					</div>
					<button type="button" className="btn btn-primary" onClick={() => setFormOpen(true)}>
						Submit Feedback
					</button>
				</div>
			</div>

			{actionError && <p className="error-text" role="alert" style={{ marginBottom: "1rem" }}>{actionError}</p>}

			<h2>
				Feedback for this Session <span className="muted" style={{ fontWeight: 400 }}>({items.length})</span>
			</h2>

			{items.length === 0 ? (
				<EmptyState title="No feedback submitted yet.">
					Use the submit feedback button above to record the first report from this session.
				</EmptyState>
			) : (
				<div className="feedback-list">
					{items.map((item) => (
						<FeedbackItem
							key={item.id}
							item={item}
							expanded={expandedId === item.id}
							onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
							onTriageChange={(patch) => handleTriageChange(item, patch)}
							onDelete={() => { setActionError(null); setDeleteTarget(item); }}
						/>
					))}
				</div>
			)}
		
		<FeedbackFormModal
			open={formOpen}
			projectId={pId}
			sessionId={sId}
			onClose={() => setFormOpen(false)}
			onSubmitted={loadAll}
		/>

		<ConfirmDialog
			open={deleteTarget !== null}
			title="Delete feedback?"
			message={`"${deleteTarget?.title}" will be permanently deleted. This action cannot be undone.`}
			onConfirm={handleDeleteFeedback}
			onCancel={() => setDeleteTarget(null)}
		/>
	</div>
	);
}