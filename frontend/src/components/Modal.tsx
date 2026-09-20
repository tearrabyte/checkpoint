/*
 * MODAL
 * The shared dialog used for forms and confirmations across Checkpoint.
 */

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

 /*
  * MODAL PROPS
  * Defines the values and callback functions required by the modal.
  */
interface ModalProps {
    open: boolean;
    title: string;
    description?: string;
    size?: "default" | "large";
    children: ReactNode;
    footer?: ReactNode;
    onClose: () => void;
}

/* 
 * KEYBOARD FOCUSABLE ELEMENTS
*/
const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, title, description, size = "default", children, footer, onClose }: ModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        /* Remember last focused item */
        const previouslyFocused = document.activeElement as HTMLElement | null;

        /* Lock background */
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        /* Focus on the dialog */
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
        focusables?.[0]?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            /* Tab cycles between dialog options */
            if (event.key !== "Tab") return;

            const items = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
            if (!items || items.length === 0) return;

            const first = items[0];
            const last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus();
        };
    }, [open, onClose]);

    if (!open) return null;

	return (
		<div
			className="modal-backdrop"
			onMouseDown = {(e) => {
				/* Only close when background is clicked.*/
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				ref={dialogRef}
				className={`modal ${size === "large" ? "modal-lg" : ""}`}
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
			>
				<div className="modal-header">
					<div>
						<h2 id="=modal-title">{title}</h2>
						{description && <p>{description}</p>}
					</div>
					<button type="button" className="modal-close" onClick={onClose} aria-label="Close Dialog">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
							<path d="M18 6 6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div className="modal-body">{children}</div>

				{footer && <div className="modal-footer">{footer}</div>}
			</div>
		</div>
	);
}