/*
 * CHARTS
 * SVG chart components used on the dashboard.
 */
export interface ChartSlice {
    label: string;
    value: number;
    color: string;
}

/*
 * DESCRIBE DATA
 * Provides text alternatives for screem readers.
 */
function describe(data: ChartSlice[]) {
    return data.map((d) => `${d.label}: ${d.value}`).join(", ");
}

/*
 * DONUT CHART
 */
export function DonutChart({ data, total }: {data: ChartSlice[]; total: number }) {
    const radius = 15.9155;
    let offset = 25; /* Start first segment at the top */

	return (
		<div className="chart-wrap">
			<svg className="chart-svg" width="132" height="132" viewBox="0 0 42 42" role="img" aria-label={describe(data)}>
				<circle cx="21" cy="21" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="5" />
				{data.map((slice) => {
					const percent = total > 0 ? (slice.value / total) * 100 : 0;
					const circle = (
						<circle
							key={slice.label}
							cx="21"
							cy="21"
							r={radius}
							fill="none"
							stroke={slice.color}
							strokeWidth="5"
							strokeDasharray={`${percent} ${100 - percent}`}
							strokeDashoffset={offset}
						/>
					);
					offset -= percent;
					return circle;
				})}
				<text x="21" y="20.4" textAnchor="middle" fill="#E9EDFA" fontSize="7" fontFamily="Archivo" fontWeight="700">
					{total}
				</text>
				<text x="21" y="25.2" textAnchor="middle" fill="#7C89A8" fontSize="3.2" fontFamily="Inter">
					items
				</text>
			</svg>

			<div className="legend">
				{data.map((slice) => (
					<span className="legend-item" key={slice.label}>
						<i className="legend-dot" style={{ background: slice.color }} aria-hidden="true" />
						{slice.label}
						<b className="legend-num">{slice.value}</b>
					</span>
				))}
			</div>
		</div>
	);
}

/*
 * BAR CHART
 */
export function BarChart({ data }: { data: ChartSlice[] }) {
    const width = 260;
    const chartHeight = 108;
    const baseline = 120;
    const max = Math.max(...data.map((d) => d.value), 1);
    const slot = width / Math.max(data.length, 1);
    const barWidth = Math.min(38, slot * 0.55);

    return (
		<svg
			className="chart-svg"
			width="100%"
			height="150"
			viewBox={`0 0 ${width} 150`}
			role="img"
			aria-label={describe(data)}
		>
			<line x1="0" y1={baseline} x2={width} y2={baseline} stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
			{data.map((item, index) => {
				const height = (item.value / max) * chartHeight;
				const centre = slot * index + slot / 2;
				return (
					<g key={item.label}>
						<rect
							x={centre - barWidth / 2}
							y={baseline - height}
							width={barWidth}
							height={Math.max(height, 2)}
							rx="6"
							fill={item.color}
							opacity="0.9"
						/>
						<text x={centre} y={baseline - height - 6} textAnchor="middle" fontFamily="Archivo" fontSize="12" fontWeight="700" fill="#E9EDFA">
							{item.value}
						</text>
						<text x={centre} y="138" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#7C89A8">
							{item.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
}

/*
 * LINE CHART
*/
export function LineChart({ data, color = "#22D3EE" }: { data: { label: string, value: number }[]; color?: string }) {
    const width = 640;
    const top = 22;
    const baseline = 130;
    const left = 60;
    const right = 610;

    const max = Math.max(...data.map((d) => d.value), 1);
    const step = data.length > 1 ? (right - left) / (data.length - 1) : 0;

    const points = data.map((point, index) => ({
        x: left + step * index,
        y: baseline - (point.value / max) * (baseline - top),
        label: point.label,
        value: point.value,
    }));

    const line = points.map((p) => `${p.x} ${p.y}`).join(" L ");
    const area = `M ${line} L ${points[points.length - 1]?.x ?? left} ${baseline} L ${points[0]?.x ?? left} ${baseline} Z`;
	
    return (
		<svg
			className="chart-svg"
			width="100%"
			height="170"
			viewBox={`0 0 ${width} 170`}
			role="img"
			aria-label={data.map((d) => `${d.label}: ${d.value}`).join(", ")}
		>
			<defs>
				<linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={color} stopOpacity="0.35" />
					<stop offset="100%" stopColor={color} stopOpacity="0" />
				</linearGradient>
			</defs>

			{/* Horizontal guides */}
			{[top, 60, 100, baseline].map((y) => (
				<line key={y} x1={left} y1={y} x2={right} y2={y} stroke="rgba(255,255,255,.07)" strokeWidth="1" />
			))}

			<path d={area} fill="url(#trendFill)" />
			<path d={`M ${line}`} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

			{points.map((p) => (
				<circle key={p.label} cx={p.x} cy={p.y} r="4" fill="#0B1020" stroke={color} strokeWidth="2.5" />
			))}

			{points.map((p) => (
				<text key={`${p.label}-label`} x={p.x} y="152" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#7C89A8">
					{p.label.split(" ")[0]}
				</text>
			))}
		</svg>
	);
}