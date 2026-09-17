import type {
	FontDef,
	LetterShape,
	AnimationChoreography,
	RenderOpts,
	AnimateOpts,
	AnimationController,
	Anchor,
	ArcShape,
	LineShape,
} from './types'
import { resolveElements } from './shapes'
import { buildMasks, serializeToSVG, renderToCanvas } from './render'
import { animateLetter } from './animate'

const DEFAULTS = {
	arcRadius: 112,
	innerRadius: 20,
	strokeWidth: 32,
	accentColor: '#666666',
	size: 256,
} as const

class LetterBuilder {
	private _parts: (ArcShape | LineShape)[] = []

	arc(start: number, end: number, opts?: Partial<Omit<ArcShape, 'type' | 'start' | 'end'>>): this {
		this._parts.push({ type: 'arc', start, end, ...opts })
		return this
	}

	line(from: Anchor, to: Anchor, opts?: Partial<Omit<LineShape, 'type' | 'from' | 'to'>>): this {
		this._parts.push({ type: 'line', from, to, ...opts })
		return this
	}

	build(): LetterShape {
		return { parts: [...this._parts] }
	}
}

function createNoopController(): AnimationController {
	return {
		progress: 0,
		direction: 'forward',
		playing: false,
		completed: Promise.resolve(),
		play() {},
		pause() {},
		reverse() {},
		seek() {},
		cancel() {},
		onComplete: null,
		onStep: null,
	}
}

export class CircularFont {
	readonly arcRadius: number
	readonly innerRadius: number
	readonly letters: Map<string, LetterShape>
	readonly animations: Map<string, AnimationChoreography>

	constructor(def: FontDef = {}) {
		this.arcRadius = def.arcRadius ?? DEFAULTS.arcRadius
		this.innerRadius = def.innerRadius ?? DEFAULTS.innerRadius
		this.letters = new Map(Object.entries(def.letters ?? {}))
		this.animations = new Map(Object.entries(def.animations ?? {}))
	}

	// Registration

	define(letter: string, fn: (b: LetterBuilder) => void): this {
		const b = new LetterBuilder()
		fn(b)
		this.letters.set(letter.toUpperCase(), b.build())
		return this
	}

	addLetter(letter: string, shape: LetterShape, animation?: AnimationChoreography): this {
		const key = letter.toUpperCase()
		this.letters.set(key, shape)
		if (animation) this.animations.set(key, animation)
		return this
	}

	removeLetter(letter: string): this {
		const key = letter.toUpperCase()
		this.letters.delete(key)
		this.animations.delete(key)
		return this
	}

	// Rendering

	svg(letter: string, opts?: RenderOpts): string {
		const shape = this.letters.get(letter.toUpperCase())
		if (!shape) throw new Error(`Unknown letter: "${letter}"`)

		const sw = opts?.strokeWidth ?? DEFAULTS.strokeWidth
		const accentColor = opts?.accentColor ?? DEFAULTS.accentColor
		const primaryColor = opts?.primaryColor ?? accentColor
		const size = opts?.size ?? DEFAULTS.size
		const cx = size / 2
		const cy = size / 2

		const elements = resolveElements(shape, {
			cx,
			cy,
			size,
			arcRadius: this.arcRadius,
			strokeWidth: sw,
			accentColor,
			primaryColor,
		})

		const masks = buildMasks(elements, cx, cy, size, this.arcRadius, sw, this.innerRadius)

		return serializeToSVG(elements, masks, cx, cy, size, this.innerRadius, primaryColor)
	}

	dataUri(letter: string, opts?: RenderOpts): string {
		return `data:image/svg+xml;base64,${btoa(this.svg(letter, opts))}`
	}

	canvas(letter: string, ctx: CanvasRenderingContext2D, opts?: RenderOpts): void {
		const shape = this.letters.get(letter.toUpperCase())
		if (!shape) throw new Error(`Unknown letter: "${letter}"`)

		const sw = opts?.strokeWidth ?? DEFAULTS.strokeWidth
		const accentColor = opts?.accentColor ?? DEFAULTS.accentColor
		const primaryColor = opts?.primaryColor ?? accentColor
		const size = opts?.size ?? DEFAULTS.size
		const cx = size / 2
		const cy = size / 2

		const elements = resolveElements(shape, {
			cx,
			cy,
			size,
			arcRadius: this.arcRadius,
			strokeWidth: sw,
			accentColor,
			primaryColor,
		})

		renderToCanvas(elements, ctx, cx, cy, size, this.arcRadius, sw, this.innerRadius, primaryColor)
	}

	// Animation

	animate(letter: string, svgEl: SVGSVGElement, opts?: AnimateOpts): AnimationController {
		const key = letter.toUpperCase()
		const choreography = this.animations.get(key)
		if (!choreography) return createNoopController()

		return animateLetter(choreography, svgEl, opts)
	}
}

/** Convenience factory. */
export function createCircularFont(def?: FontDef): CircularFont {
	return new CircularFont(def)
}
