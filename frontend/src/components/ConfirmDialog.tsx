/*
 * CONFIRMATION DIALOG
 * Provides a reusable confirmation dialog for actions such as deleting projects, sessions or feedback.
 */

 /*
  * CONFIRM DIALOG PROPS
  * Defines the values and callback functions required by the confirmation dialog.
  */
interface ConfirmDialogProps {
	open: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

/*
 * CONFIRM DIALOG
 * Displays a confirmation message before an action is completed.
 */
export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
	if (!open) return null;

	return (
		<div className="modal-backdrop" role="dialog" aria-modal="true">
			<div className="modal">
				<h3>{title}</h3>
				<p>{message}</p>
				<div className="modal-actions">
					<button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
					<button className="btn btn-danger" onClick={onConfirm}>Delete</button>
				</div>
			</div>
		</div>
	);
}