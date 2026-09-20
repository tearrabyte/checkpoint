/*
 * BADGE
 * Used to display a category, priority or status value as a colour-coded badge.
 */

import type { FeedbackCategory, FeedbackPriority, FeedbackStatus, SessionStatus } from "../types";

interface BadgeProps {
    kind: "category" | "priority" | "status";
    value: FeedbackCategory | FeedbackPriority | FeedbackStatus | SessionStatus;
}

 /*
  * DISPLAY LABELS
  * Maps API enum values to more readable labels.
  */
const LABELS: Record<string, string> = {
    InProgress: "In Progress",
    FeatureRequest: "Feature Request",
};

export function Badge({ kind, value }: BadgeProps) {
    /* Category possesses a unique class prefix to avoid clashing with shared status values. */
    const className =
        kind === "category"
            ? `badge badge-category-${value.toLowerCase()}`
            : `badge badge-${value.toLowerCase()}`;
    
    return <span className= {className}>{LABELS[value] ?? value}</span>;
}