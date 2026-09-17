// Anchors

/** A point in the unit square: [0,0] = top-left, [1,1] = bottom-right, [0.5,0.5] = center. */
export type GridAnchor = [number, number]

/** A point on or relative to the circular ring. 0° = right, 90° = down, clockwise. */
export interface PolarAnchor {
	angle: number
	/** Fraction of arcRadius from center (default 1 = on the ring). */
	reach?: number
}

export type Anchor = GridAnchor | PolarAnchor

// Shapes

export interface ArcShape {
	type: 'arc'
	start?: number
	end?: number
	/** Offset the arc center as multiples of arcRadius. Default [0,0]. */
	offset?: [number, number]
	linecap?: 'butt' | 'round' | 'square'
	/** Which mask to apply. Default 'inner' for arcs. */
	mask?: 'inner' | 'ring'
}

export interface LineShape {
	type: 'line'
	from: Anchor
	to: Anchor
	/** Fraction of the full from→to segment to draw, centered at the midpoint. Default 1. */
	span?: number
	/** Pixel inset from each endpoint. Default 0. */
	inset?: number
	/** Which mask to apply. Default undefined (no mask). */
	mask?: 'inner' | 'ring'
}

export type Shape = ArcShape | LineShape

export interface LetterShape {
	parts: Shape[]
}

// Animation

export interface KeyframeDef {
	offset?: number | null
	easing?: string
	composite?: 'replace' | 'add' | 'accumulate' | 'auto'
	[key: string]: string | number | null | undefined
}

export interface AnimationStep {
	preset?: 'draw' | 'fade' | 'scale' | 'wipe'
	keyframes?: KeyframeDef[]
	duration?: number
	delay?: number
	easing?: string
	reverse?: boolean
}

/** Animation instructions for one part, keyed by index into LetterShape.parts. */
export interface ShapeAnim {
	index: number
	/** Phase grouping: parts with the same order animate simultaneously. Defaults to index. */
	order?: number
	steps: AnimationStep[]
}

export interface AnimationChoreography {
	parts: ShapeAnim[]
	/** Gap in ms between phases. Can be overridden at animate() call time. */
	phaseGap?: number
}

export interface FontDef {
	arcRadius?: number // default 112
	innerRadius?: number // default 20
	letters?: Record<string, LetterShape>
	animations?: Record<string, AnimationChoreography>
}

export interface RenderOpts {
	strokeWidth?: number // default 32
	accentColor?: string // default '#666666' (arcs)
	primaryColor?: string // default accentColor
	size?: number // default 256
}

export interface AnimateOpts {
	/** Gap in ms between phases. Overrides AnimationChoreography.phaseGap. */
	phaseGap?: number
}

export interface AnimationController {
	readonly progress: number
	readonly direction: 'forward' | 'backward'
	readonly playing: boolean
	readonly completed: Promise<void>

	play(): void
	pause(): void
	reverse(): void
	seek(t: number): void
	cancel(): void

	onComplete: (() => void) | null
	onStep: ((order: number) => void) | null
}
