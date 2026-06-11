// ── Types ───────────────────────────────────────────────────────────────────────

/** A raw CSS keyframe (property → value map). */
export interface KeyframeDef {
	offset?: number | null
	easing?: string
	composite?: 'replace' | 'add' | 'accumulate' | 'auto'
	[key: string]: string | number | null | undefined
}

/**
 * A single step in a component's animation sequence.
 * Either uses a named preset or raw CSS keyframes.
 */
export interface AnimationStep {
	/** Named animation preset. 'draw' = stroke-dashoffset wipe-in. */
	preset?: 'draw'
	/** Raw CSS keyframes. Overrides preset if both given. */
	keyframes?: KeyframeDef[]
	/** Duration in milliseconds. Default 400. */
	duration?: number
	/** Delay in milliseconds before this step starts. Default 0. */
	delay?: number
	/** CSS easing function. Default 'ease'. */
	easing?: string
	/** If true, the stroke draws from end to start instead of start to end. */
	reverse?: boolean
}

export interface ArcDef {
	type: 'arc'
	/** Start degrees (0 = right, 90 = down, clockwise). Default 0. */
	start?: number
	/** End degrees. Default 360. */
	end?: number
	/** Offset the arc center as [dx, dy] relative to the viewBox center. */
	offset?: [number, number]
	/** Clip this arc to the ring area between inner circle and arc radius. */
	mask?: boolean
	/**
	 * Animation order. Components with the same order animate simultaneously.
	 * Default = array index (sequential).
	 */
	order?: number
	/** Animation sequence for this component. */
	animate?: AnimationStep[]
}

export interface LineDef {
	type: 'line'
	/** Degrees where the line sits on the circle (0 = right, 90 = down, clockwise). */
	angle: number
	/**
	 * How far the line extends.
	 * From ring inward: 0 = stays at outer edge, 1 = reaches center, &gt;1 = extends beyond outer ring.
	 * From center outward: 0 = stays at center, 1 = reaches outer edge, &gt;1 = extends beyond outer ring.
	 * Default 1.
	 */
	reach?: number
	/** If true, emanates from center outward instead of from ring inward. Default false. */
	fromCenter?: boolean
	/** Animation order. Default = array index. */
	order?: number
	/** Animation sequence for this component. */
	animate?: AnimationStep[]
}

export interface EdgeDef {
	type: 'edge'
	/** Which edge(s): t(op), r(ight), b(ottom), l(eft); 1 or 2 chars for corners. */
	position: string
	/** Orientation: h(orizontal) or v(ertical). */
	orientation: 'h' | 'v'
	/** Length as fraction of viewBox size (0-1). Default 1 for edges, 0.5 for corners. */
	span?: number
	/** How far from the viewBox edge the line extends. 0 = at edge, 1 = full span. Default 1. */
	reach?: number
	/** Inset from the viewBox edge in pixels. Default 0. */
	inset?: number
	/** If true, emanates from center outward instead of from edge inward. Default false. */
	fromCenter?: boolean
	/** Animation order. Default = array index. */
	order?: number
	/** Animation sequence for this component. */
	animate?: AnimationStep[]
}

export interface DiagonalDef {
	type: 'diagonal'
	/**
	 * Quadrant identifier.
	 * tr/rt = top-right, br/rb = bottom-right,
	 * bl/lb = bottom-left, tl/lt = top-left.
	 */
	position: string
	/** Length as fraction of the full diagonal (0-1). Default 1. */
	span?: number
	/** Inset from the edge centers in pixels. Default 0. */
	inset?: number
	/** Animation order. Default = array index. */
	order?: number
	/** Animation sequence for this component. */
	animate?: AnimationStep[]
}

export type ComponentDef = ArcDef | LineDef | EdgeDef | DiagonalDef

export interface LetterDef {
	/** The visual parts that compose this letter. */
	components: ComponentDef[]
}

export interface FontDef {
	/** Radius of the arc circles. Default 116. */
	arcRadius?: number
	/** Radius of the inner ring. Default 36. */
	innerRadius?: number
	/** Letter configurations keyed by uppercase letter. */
	letters: Record<string, LetterDef>
}

export interface RenderOpts {
	/** Stroke width for arcs and inner circle. Default 32. */
	strokeWidth?: number
	/** Color of the inner ring. Default '#000000'. */
	primaryColor?: string
	/** Color of arcs. Default '#666666'. */
	secondaryColor?: string
	/** Color of lines (defaults to secondaryColor). */
	lineColor?: string
	/** Stroke width for lines. Default 32 (matches strokeWidth). */
	lineStrokeWidth?: number
	/** Size of the viewBox (square). Default 256. */
	size?: number
}

// ── Animation ────────────────────────────────────────────────────────────────────

/** Options for the animate() method. */
export interface AnimateOpts {
	/** Gap in milliseconds between animation phases. Default 0. */
	phaseGap?: number
}

/** Controller returned by font.animate(). Drives the animation forward or backward. */
export interface AnimationController {
	/** Normalized progress 0..1. 0 = nothing drawn, 1 = fully drawn. */
	readonly progress: number
	/** Current playback direction. */
	readonly direction: 'forward' | 'backward'
	/** Whether animation is currently playing. */
	readonly playing: boolean
	/** Promise that resolves when the animation completes (reaches end in current direction). */
	readonly completed: Promise<void>

	/** Start or resume playback in the current direction. */
	play(): void
	/** Pause playback without resetting. */
	pause(): void
	/** Toggle direction. If playing, immediately reverses. */
	reverse(): void
	/** Jump to a normalized progress (0..1). Pauses if playing. */
	seek(t: number): void
	/** Cancel the animation and reset all effects. */
	cancel(): void

	/** Called when animation completes (reaches end in current direction). */
	onComplete: (() => void) | null
	/** Called when a new phase order begins. */
	onStep: ((order: number) => void) | null
}
