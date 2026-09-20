/*
 * CONFIRMATION DIALOG
 * Provides a reusable confirmation dialog for actions such as deleting projects, sessions or feedback.
 */

import { Modal } from "./Modal";

 /*
  * CONFIRM DIALOG PROPS
  * Defines the values and callback functions required by the confirmation dialog.
  */
interface ConfirmDialogProps {
	open: boolean;
	title: string;
	message: string;
	confirmLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

/*
 * CONFIRM DIALOG
 * Displays a confirmation message before an action is completed.
 */
export function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }: ConfirmDialogProps) {
	if (!open) return null;

	return (
		<Modal
			open={open}
			title={title}
			onClose={onCancel}
			footer={
				<>
					<button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
					<button type="button" className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
				</>
			}
		>
			<p>{message}</p>
		</Modal>
	);
}