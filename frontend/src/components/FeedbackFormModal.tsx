/*
 * FEEDBACK FORM MODAL
 * Collects a new feedback submission from within a dialog so that the feedback list stays visible on the session page
 * rather than being pushed below a long form.
 */

import { useState } from "react";
import type { FormEvent } from "react";
import { feedbackApi } from "../api/checkpointApi";
import { ApiError } from "../api/client";
import { FieldError } from "./FieldError";
import { Modal } from "./Modal";
import {
    FEEDBACK_CATEGORIES, FEEDBACK_PRIORITIES,
    type FeedbackCategory, type FeedbackPriority,
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
 * READABLE STRINGS 
 */
const READABLE: Record<string, string> = { FeatureRequest: "Feature Request"};

 /*
  * FEEDBACK MODAL PROPS
  * Defines the values and callback functions required by the feedback modal.
  */
interface FeedbackFormModalProps {
    open: boolean;
    projectId: number;
    sessionId: number;
    onClose: () => void;
    onSubmitted: () => void;
}

/*
 * FEEDBACK FORM MODAL
 */
export function FeedbackFormModal({ open, projectId, sessionId, onClose, onSubmitted }: FeedbackFormModalProps) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();
    const [submitting, setSubmitting] = useState(false);

    const isDefect = form.category === "Defect";
    
    const invalid = (field: string) => (fieldErrors?.[field] ? "input-invalid" : "");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFieldErrors(undefined);
        setSubmitting(true);

        try {
            await feedbackApi.create(projectId, sessionId, form);
            setForm(EMPTY_FORM);
            onSubmitted();
            onClose();
        } catch (err) {
            if (err instanceof ApiError) setFieldErrors(err.fieldErrors);
        } finally {
            setSubmitting(false);
        }
    }

    function handleClose() {
        setForm(EMPTY_FORM);
        setFieldErrors(undefined);
        onClose();
    }

    const defectErrorCount = ["ExpectedBehaviour", "ActualBehaviour", "ReproductionSteps", "Environment"]
        .filter((field) => fieldErrors?.[field]).length;
    
    return (
        <Modal
            open={open}
            title="Submit Feedback"
            description="Describe what you saw during the playtest."
            size="large"
            onClose={handleClose}
            footer={
                <>
					<button type="button" className="btn btn-secondary" onClick={handleClose}>
						Cancel
					</button>
					<button type="submit" form="feedback-form" className="btn btn-primary" disabled={submitting}>
						{submitting ? "Submitting…" : "Submit Feedback"}
					</button>
				</>
            }
        >
            <form id="feedback-form" className="form-card" onSubmit={handleSubmit}>
				{defectErrorCount > 0 && (
					<div className="form-alert" role="alert">
						<span>
							{defectErrorCount} defect {defectErrorCount === 1 ? "detail is" : "details are"} still needed
							before this report can be submitted.
						</span>
					</div>
				)}

                <label>
					Title
					<input
						className={invalid("Title")}
						value={form.title}
						onChange={(e) => setForm({ ...form, title: e.target.value })}
						placeholder="Identify the main issue."
					/>
					<FieldError errors={fieldErrors} field="Title" />
				</label>

				<label>
					Description
					<textarea
						className={invalid("Description")}
						value={form.description}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
						placeholder="Add details about the issue identified. What happened, and when did it happen?"
					/>
					<FieldError errors={fieldErrors} field="Description" />
				</label>

				<label>
					Your Name (optional)
					<input
						value={form.submittedBy}
						onChange={(e) => setForm({ ...form, submittedBy: e.target.value })}
						placeholder="Anonymous"
					/>
				</label>

				<div className="form-row">
					<label>
						Category
						<select
							value={form.category}
							onChange={(e) => setForm({ ...form, category: e.target.value as FeedbackCategory })}
						>
							{FEEDBACK_CATEGORIES.map((c) => (
								<option key={c} value={c}>{READABLE[c] ?? c}</option>
							))}
						</select>
					</label>
					<label>
						Priority
						<select
							value={form.priority}
							onChange={(e) => setForm({ ...form, priority: e.target.value as FeedbackPriority })}
						>
							{FEEDBACK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
						</select>
					</label>
				</div>

				{isDefect && (
					<div className="defect-fields">
						<p className="section-hint">
							Defect reports need these four details so the issue can be reproduced.
						</p>
						<label>
							Expected Behaviour
							<textarea
								className={invalid("ExpectedBehaviour")}
								value={form.expectedBehaviour}
								onChange={(e) => setForm({ ...form, expectedBehaviour: e.target.value })}
								placeholder="What should have happened?"
							/>
							<FieldError errors={fieldErrors} field="ExpectedBehaviour" />
						</label>
						<label>
							Actual Behaviour
							<textarea
								className={invalid("ActualBehaviour")}
								value={form.actualBehaviour}
								onChange={(e) => setForm({ ...form, actualBehaviour: e.target.value })}
								placeholder="What happened instead?"
							/>
							<FieldError errors={fieldErrors} field="ActualBehaviour" />
						</label>
						<label>
							Reproduction Steps
							<textarea
								className={invalid("ReproductionSteps")}
								value={form.reproductionSteps}
								onChange={(e) => setForm({ ...form, reproductionSteps: e.target.value })}
								placeholder={"1. …\n2. …\n3. …"}
							/>
							<FieldError errors={fieldErrors} field="ReproductionSteps" />
						</label>
						<label>
							Environment
							<input
								className={invalid("Environment")}
								value={form.environment}
								onChange={(e) => setForm({ ...form, environment: e.target.value })}
								placeholder="e.g. Windows 11, RTX 3060, build 0.4.2"
							/>
							<FieldError errors={fieldErrors} field="Environment" />
						</label>
					</div>
				)}
			</form>
		</Modal>
    );
}