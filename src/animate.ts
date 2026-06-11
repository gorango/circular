import type {
	AnimationController,
	AnimateOpts,
	AnimationStep,
	ComponentDef,
	LetterDef,
} from './types'

// ── Internal types ───────────────────────────────────────────────────────────────

interface ComponentAnim {
	element: SVGElement
	steps: ResolvedStep[]
}

interface ResolvedStep {
	keyframes: Keyframe[]
	duration: number
	delay: number
	easing: string
}

interface PhaseData {
	order: number
	duration: number
	components: ComponentAnim[]
}

// ── Entry point ──────────────────────────────────────────────────────────────────

export function animateLetter(
	ldef: LetterDef,
	svg: SVGSVGElement,
	opts?: AnimateOpts,
): AnimationController {
	const gap = opts?.phaseGap ?? 0

	const phases = buildPhases(ldef, svg)
	const anims: Animation[] = []

	let globalTime = 0
	for (const phase of phases) {
		for (const comp of phase.components) {
			for (const step of comp.steps) {
				const anim = (comp.element as Element).animate(step.keyframes, {
					duration: step.duration,
					delay: globalTime + step.delay,
					fill: 'both',
					easing: step.easing,
				})
				anim.pause()
				anims.push(anim)
			}
		}
		globalTime += phase.duration + gap
	}

	const totalDuration = globalTime - (phases.length > 0 ? gap : 0)

	return new ControllerImpl(anims, totalDuration)
}

// ── Phase builder ────────────────────────────────────────────────────────────────

function buildPhases(ldef: LetterDef, svg: SVGSVGElement): PhaseData[] {
	const groups = new Map<number, { comp: ComponentDef; el: SVGElement; idx: number }[]>()

	for (let i = 0; i < ldef.components.length; i++) {
		const comp = ldef.components[i]!
		const el = svg.querySelector(`[data-cf-index="${i}"]`)
		if (!el) continue
		const order = comp.order ?? i
		let group = groups.get(order)
		if (!group) {
			group = []
			groups.set(order, group)
		}
		group.push({ comp, el: el as SVGElement, idx: i })
	}

	const sorted = [...groups.entries()].sort(([a], [b]) => a - b)

	return sorted.map(([, items]) => {
		const components: ComponentAnim[] = []
		let maxDuration = 0

		for (const { comp, el } of items) {
			const steps = resolveSteps(comp, el)
			if (steps.length === 0) {
				steps.push({
					keyframes: [{ opacity: 0 }, { opacity: 1 }],
					duration: 1,
					delay: 0,
					easing: 'step-end',
				})
			}
			components.push({ element: el, steps })
			const total = steps.reduce((s, st) => s + st.duration, 0)
			if (total > maxDuration) maxDuration = total
		}

		return { order: items[0]!.comp.order ?? items[0]!.idx, duration: maxDuration, components }
	})
}

// ── Step resolution ─────────────────────────────────────────────────────────────

function resolveSteps(comp: ComponentDef, el: SVGElement): ResolvedStep[] {
	const steps = comp.animate
	if (!steps || steps.length === 0) return []
	return steps.map((s) => resolveStep(el, s))
}

function resolveStep(el: SVGElement, step: AnimationStep): ResolvedStep {
	const duration = step.duration ?? 400
	const delay = step.delay ?? 0
	const easing = step.easing ?? 'ease'

	if (step.keyframes && step.keyframes.length > 0) {
		return { keyframes: step.keyframes as unknown as Keyframe[], duration, delay, easing }
	}

	if (step.preset === 'draw') {
		return { keyframes: drawKeyframes(el, step.reverse), duration, delay, easing }
	}

	return { keyframes: [{ opacity: 0 }, { opacity: 1 }], duration: 1, delay, easing: 'step-end' }
}

// ── Draw preset ─────────────────────────────────────────────────────────────────

function drawKeyframes(el: SVGElement, reverse?: boolean): Keyframe[] {
	let len = 0

	if (el instanceof SVGLineElement) {
		const x1 = el.x1.baseVal.value
		const y1 = el.y1.baseVal.value
		const x2 = el.x2.baseVal.value
		const y2 = el.y2.baseVal.value
		len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
	} else if (el instanceof SVGCircleElement) {
		len = 2 * Math.PI * el.r.baseVal.value
	} else if (el instanceof SVGPathElement) {
		len = el.getTotalLength()
	}

	if (len <= 0) return [{ strokeDashoffset: 0 }]

	if (reverse) {
		return [
			{ strokeDashoffset: len, strokeDasharray: len },
			{ strokeDashoffset: 2 * len, strokeDasharray: len },
		]
	}

	return [
		{ strokeDashoffset: len, strokeDasharray: len },
		{ strokeDashoffset: 0, strokeDasharray: len },
	]
}

// ── Controller implementation ───────────────────────────────────────────────────

class ControllerImpl implements AnimationController {
	private _progress = 0
	private _direction: 1 | -1 = 1
	private _animations: Animation[]
	private _totalDuration: number
	private _playing = false
	private _rafId = 0
	private _completeResolve: (() => void) | null = null
	private _completePromise: Promise<void> | null = null

	onComplete: (() => void) | null = null
	onStep: ((order: number) => void) | null = null

	constructor(animations: Animation[], totalDuration: number) {
		this._animations = animations
		this._totalDuration = totalDuration
	}

	get progress(): number {
		return this._progress
	}

	get direction(): 'forward' | 'backward' {
		return this._direction === 1 ? 'forward' : 'backward'
	}

	get playing(): boolean {
		return this._playing
	}

	get completed(): Promise<void> {
		if (!this._completePromise) {
			this._completePromise = new Promise((resolve) => {
				this._completeResolve = resolve
			})
		}
		return this._completePromise
	}

	play(): void {
		this._playing = true
		for (const a of this._animations) {
			a.playbackRate = this._direction
			a.play()
		}
		if (!this._completeResolve) {
			this._completePromise = new Promise((resolve) => {
				this._completeResolve = resolve
			})
		}
		this._watch()
	}

	pause(): void {
		this._playing = false
		for (const a of this._animations) a.pause()
		cancelAnimationFrame(this._rafId)
	}

	reverse(): void {
		this._direction = this._direction === 1 ? -1 : 1
		if (this._playing) {
			for (const a of this._animations) a.playbackRate = this._direction
		}
	}

	seek(t: number): void {
		this._progress = Math.max(0, Math.min(1, t))
		const targetTime = this._progress * this._totalDuration
		for (const a of this._animations) {
			a.currentTime = targetTime
		}
	}

	cancel(): void {
		this._playing = false
		cancelAnimationFrame(this._rafId)
		for (const a of this._animations) a.cancel()
		this._completeResolve?.()
		this._completeResolve = null
		this._completePromise = null
	}

	private _watch(): void {
		const check = () => {
			if (this._animations.length === 0) {
				this._progress = 1
				this._playing = false
				this.onComplete?.()
				this._completeResolve?.()
				this._completeResolve = null
				this._completePromise = null
				return
			}

			let maxTime = 0

			for (const a of this._animations) {
				const ct = (a.currentTime as number) ?? 0
				if (ct > maxTime) maxTime = ct
			}

			this._progress =
				this._totalDuration > 0 ? Math.max(0, Math.min(1, maxTime / this._totalDuration)) : 0

			const reachedEnd = this._direction === 1 ? this._progress >= 1 : this._progress <= 0

			if (reachedEnd) {
				this._progress = this._direction === 1 ? 1 : 0
				this._playing = false
				this.onComplete?.()
				this._completeResolve?.()
				this._completeResolve = null
				this._completePromise = null
				return
			}

			const anyActive = this._animations.some(
				(a) => a.playState !== 'finished' && a.playState !== 'idle',
			)
			if (anyActive) {
				this._rafId = requestAnimationFrame(check)
			} else {
				// All animations finished but we didn't hit progress endpoint —
				// treat as complete
				this._progress = this._direction === 1 ? 1 : 0
				this._playing = false
				this.onComplete?.()
				this._completeResolve?.()
				this._completeResolve = null
				this._completePromise = null
			}
		}

		this._rafId = requestAnimationFrame(check)
	}
}
