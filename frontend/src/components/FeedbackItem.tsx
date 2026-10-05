/*
 * FEEDBACK ITEM
 * A single feedback record in a playtest session's list.
 * Collapsed view displays category, title, priority and status. 
 * Expanded shows full description, and reproduction information if applicable.
 */

import { Badge } from "./Badge";
import {
    FEEDBACK_PRIORITIES, FEEDBACK_STATUSES,
    type Feedback, type FeedbackPriority, type FeedbackStatus,
} from  "../types";

/* 
 * READABLE STRINGS 
 */
const READABLE: Record<string, string> = { InProgress: "In Progress"};

 /*
  * FEEDBACK ITEM PROPS
  * Defines the values and callback functions required by a feedback item.
  */
interface FeedbackItemProps {
    item: Feedback;
    expanded: boolean;
    onToggle: () => void;
    onTriageChange: (patch: Partial<Feedback>) => void;
    onDelete: () => void;
}

/*
 * FEEDBACK ITEM
 */
export function FeedbackItem({ item, expanded, onToggle, onTriageChange, onDelete }: FeedbackItemProps) {
    const detailId = `feedback-detail-${item.id}`;

    return (
        <article className="card feedback-item">
            <button
                type="button"
                className="feedback-summary"
                onClick={onToggle}
                aria-expanded={expanded}
                aria-controls={detailId}
            >
                <span className="feedback-head" style={{ flex: "1 1 auto", minWidth: 0 }}>
                    <Badge kind="category" value={item.category} />
                    <span className="feedback-title truncate" style={{ minWidth: 0 }} title={item.title}>
						{item.title}
					</span>
                </span>
                <span className="feedback-head" style={{ flex: "0 0 auto" }}>
                    <Badge kind="priority" value={item.priority} />
                    <Badge kind="status" value={item.status} />
                </span>
            </button>

            {expanded && (
                <div className="feedback-detail" id={detailId}>
					<p>{item.description}</p>
					<p className="muted" style={{ fontSize: "0.82rem" }}>Submitted by {item.submittedBy}</p>

					{item.category === "Defect" && (
						<dl className="defect-readout">
							<div>
								<dt>Expected</dt>
								<dd>{item.expectedBehaviour}</dd>
							</div>
							<div>
								<dt>Actual</dt>
								<dd>{item.actualBehaviour}</dd>
							</div>
							<div>
								<dt>Steps To Reproduce</dt>
								<dd><pre>{item.reproductionSteps}</pre></dd>
							</div>
							<div>
								<dt>Environment</dt>
								<dd>{item.environment}</dd>
							</div>
						</dl>
					)}

					<div className="feedback-controls" style={{ marginTop: "1rem" }}>
						<label className="visually-hidden" htmlFor={`priority-${item.id}`}>Priority</label>
						<select
							id={`priority-${item.id}`}
							value={item.priority}
							onChange={(e) => onTriageChange({ priority: e.target.value as FeedbackPriority })}
						>
							{FEEDBACK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
						</select>

						<label className="visually-hidden" htmlFor={`status-${item.id}`}>Status</label>
						<select
							id={`status-${item.id}`}
							value={item.status}
							onChange={(e) => onTriageChange({ status: e.target.value as FeedbackStatus })}
						>
							{FEEDBACK_STATUSES.map((s) => (
								<option key={s} value={s}>{READABLE[s] ?? s}</option>
							))}
						</select>

						<button type="button" className="btn btn-danger btn-small" onClick={onDelete}>
							Delete
						</button>
					</div>
				</div>
			)}
		</article>
    )
}