/*
 * SHARED UI COMPONENTS
 * Small components used across pages including loading skeletons, empty states, and search fields.
 */

import type { ReactNode } from "react";

/*
 * SKELETON
 * Placeholder shown when data is loading, roughly sized to match the content to avoid jumping.
 */
export function Skeleton({ width = "100%", height = 14 }: { width?: string; height?: number }) {
    return <div className="skeleton skeleton-row" style={{ width, height }} aria-hidden="true" />;
}

/*
 * SKELETON BLOCK
 * Grouped skeleton rows inside a card to represent page-level loading states.
 */
export function SkeletonBlock({ rows = 4}: {rows?: number}) {
    const widths = ["45%", "85%", "70%", "60%", "78%", "52%"];

    return (
        <div className="card" role="status" aria-live="polite">
            <span className="visually-hidden">Loading</span>
            {Array.from({ length: rows }).map((_, index) => (
                <Skeleton key={index} width={widths[index % widths.length]} />
            ))}
        </div>
    );
}

/* 
 * EMPTY STATE
 * Shown when there is nothing to display, including instructional messaging.
 */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
    return (
        <div className="empty-state">
            <strong>{title}</strong>
            {children}
        </div>
    );
}

/* 
 * SEARCH FIELD
 * Text input used to filter items by name or title.
 */
interface SearchFieldProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label: string;
}

export function SearchField({ value, onChange, placeholder, label }: SearchFieldProps) {
    return (
		<div className="search-field">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
				<circle cx="11" cy="11" r="7" />
				<path d="m20 20-3.5-3.5" />
			</svg>
			<input
				className="search-input"
				type="search"
				value={value}
				placeholder={placeholder}
				aria-label={label}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
    );
}