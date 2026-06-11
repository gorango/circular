import type {
	AnimationController,
	AnimateOpts,
	ComponentDef,
	FontDef,
	LetterDef,
	RenderOpts,
} from './types'
export { DEFAULT_LETTERS } from './letters'
export type { AnimationController, AnimateOpts, AnimationStep, KeyframeDef } from './types'
import { animateLetter } from './animate'

function polar(cx: number, cy: number, r: number, degrees: number): [number, number] {
	const rad = ((degrees - 90) * Math.PI) / 180
	return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
	const [x1, y1] = polar(cx, cy, r, startDeg)
	const [x2, y2] = polar(cx, cy, r, endDeg)
	let delta = endDeg - startDeg
	while (delta < 0) delta += 360
	while (delta >= 360) delta -= 360
	const large = delta > 180 ? 1 : 0
	return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

// ── Defaults ────────────────────────────────────────────────────────────────────

const DEFAULTS = {
	arcRadius: 112,
	innerRadius: 20,
	strokeWidth: 32,
	primaryColor: '#000000',
	secondaryColor: '#666666',
	size: 256,
} as const

// ── CircularFont ────────────────────────────────────────────────────────────────

export class CircularFont {
	readonly arcRadius: number
	readonly innerRadius: number
	readonly letters: Record<string, LetterDef>

	constructor(def: FontDef) {
		this.arcRadius = def.arcRadius ?? DEFAULTS.arcRadius
		this.innerRadius = def.innerRadius ?? DEFAULTS.innerRadius
		this.letters = def.letters
	}

	private get maskRadius(): number {
		return this.innerRadius + DEFAULTS.innerRadius / 2 + 2
	}

	/**
	 * Render a single letter to an SVG string.
	 * Throws if the letter is not found in the font config.
	 */
	svg(letter: string, opts?: RenderOpts): string {
		const sw = opts?.strokeWidth ?? DEFAULTS.strokeWidth
		const secondary = opts?.secondaryColor ?? DEFAULTS.secondaryColor
		const lineColor = opts?.lineColor ?? secondary
		const size = opts?.size ?? DEFAULTS.size
		const cx = size / 2
		const cy = size / 2

		const ldef = this.letters[letter.toUpperCase()]
		if (!ldef) {
			throw new Error(`Unknown letter: "${letter}"`)
		}

		const parts: string[] = []
		const defs: string[] = []

		const needsInnerMask = ldef.components.some(
			(c: ComponentDef) => c.type === 'line' || (c.type === 'arc' && !c.mask),
		)
		const needsRingMask = ldef.components.some(
			(c: ComponentDef) => c.type === 'diagonal' || (c.type === 'arc' && c.mask),
		)
		let innerMaskId = ''
		let ringMaskId = ''
		if (needsInnerMask) {
			innerMaskId = `cfi-${Math.random().toString(36).slice(2, 8)}`
			defs.push(
				`<mask id="${innerMaskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}">
					<circle cx="${cx}" cy="${cy}" r="${cx * 2}" fill="white"/>
					<circle cx="${cx}" cy="${cy}" r="${this.maskRadius}" fill="black"/>
				</mask>`,
			)
		}
		if (needsRingMask) {
			ringMaskId = `cfr-${Math.random().toString(36).slice(2, 8)}`
			defs.push(
				`<mask id="${ringMaskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}">
					<rect width="${size}" height="${size}" fill="black"/>
					<circle cx="${cx}" cy="${cy}" r="${this.arcRadius + sw / 2}" fill="white"/>
					<circle cx="${cx}" cy="${cy}" r="${this.maskRadius}" fill="black"/>
				</mask>`,
			)
		}

		for (let i = 0; i < ldef.components.length; i++) {
			const comp = ldef.components[i]!
			if (comp.type === 'arc') {
				const startDeg = comp.start ?? 0
				const endDeg = comp.end ?? 360
				const acx = cx + (comp.offset?.[0] ?? 0)
				const acy = cy + (comp.offset?.[1] ?? 0)
				const arcMask = comp.mask
					? ` mask="url(#${ringMaskId})"`
					: innerMaskId
						? ` mask="url(#${innerMaskId})"`
						: ''
				let delta = endDeg - startDeg
				if (Math.abs(delta) >= 360) {
					parts.push(
						`<circle cx="${acx}" cy="${acy}" r="${this.arcRadius}" stroke="${secondary}" fill="none" stroke-width="${sw}"${arcMask} data-cf-index="${i}"/>`,
					)
				} else {
					while (delta < 0) delta += 360
					if (delta > 0.001) {
						const d = describeArc(acx, acy, this.arcRadius, startDeg, endDeg)
						parts.push(
							`<path d="${d}" stroke="${secondary}" stroke-linecap="square" fill="none" stroke-width="${sw}"${arcMask} data-cf-index="${i}"/>`,
						)
					}
				}
			} else if (comp.type === 'line') {
				const angle = comp.angle
				const reach = comp.reach ?? 1
				if (comp.fromCenter) {
					const [x2, y2] = polar(cx, cy, this.arcRadius * reach, angle)
					parts.push(
						`<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${lineColor}" stroke-linecap="butt" stroke-width="${sw}" mask="url(#${innerMaskId})" data-cf-index="${i}"/>`,
					)
				} else {
					const [x1, y1] = polar(cx, cy, this.arcRadius * Math.max(1, reach), angle)
					const [x2, y2] = polar(cx, cy, this.arcRadius * (1 - reach), angle)
					parts.push(
						`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lineColor}" stroke-linecap="butt" stroke-width="${sw}" mask="url(#${innerMaskId})" data-cf-index="${i}"/>`,
					)
				}
			} else if (comp.type === 'diagonal') {
				const dpos = comp.position.toLowerCase()
				const dspan = comp.span ?? 1
				const dinset = comp.inset ?? 0
				let ex1: number, ey1: number, ex2: number, ey2: number

				if (dpos === 'tr' || dpos === 'rt') {
					ex1 = cx
					ey1 = 0
					ex2 = size
					ey2 = cy
				} else if (dpos === 'br' || dpos === 'rb') {
					ex1 = size
					ey1 = cy
					ex2 = cx
					ey2 = size
				} else if (dpos === 'bl' || dpos === 'lb') {
					ex1 = cx
					ey1 = size
					ex2 = 0
					ey2 = cy
				} else {
					ex1 = 0
					ey1 = cy
					ex2 = cx
					ey2 = 0
				}

				const dx = ex2 - ex1,
					dy = ey2 - ey1
				const len = Math.sqrt(dx * dx + dy * dy)
				const ux = len > 0 ? dx / len : 0
				const uy = len > 0 ? dy / len : 0

				let x1 = ex1 + ux * dinset
				let y1 = ey1 + uy * dinset
				let x2 = ex2 - ux * dinset
				let y2 = ey2 - uy * dinset

				if (dspan !== 1) {
					const mx = (x1 + x2) / 2,
						my = (y1 + y2) / 2
					x1 = mx + (x1 - mx) * dspan
					y1 = my + (y1 - my) * dspan
					x2 = mx + (x2 - mx) * dspan
					y2 = my + (y2 - my) * dspan
				}

				parts.push(
					`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lineColor}" stroke-linecap="square" stroke-width="${sw}" mask="url(#${ringMaskId})" data-cf-index="${i}"/>`,
				)
			} else if (comp.type === 'edge') {
				const pos = comp.position
				const ori = comp.orientation
				const inset = comp.inset ?? 0
				const isCorner = pos.length === 2
				const span = (comp.span ?? (isCorner ? 0.5 : 1)) * size * (comp.reach ?? 1)
				const hw = sw / 2
				let x1 = 0,
					y1 = 0,
					x2 = 0,
					y2 = 0

				if (comp.fromCenter) {
					const ef = (comp.span ?? 1) * size * (comp.reach ?? 1)
					if (isCorner) {
						const xBase = pos.includes('l') ? 0 : size
						const yBase = pos.includes('t') ? 0 : size
						if (ori === 'h') {
							x1 = xBase
							y1 = y2 = yBase
							x2 = pos.includes('l') ? xBase + ef : xBase - ef
						} else {
							x1 = x2 = xBase
							y1 = yBase
							y2 = pos.includes('t') ? yBase + ef : yBase - ef
						}
					} else {
						const half = ef / 2
						if (pos === 't') {
							y1 = y2 = 0
							if (ori === 'h') {
								x1 = cx - half
								x2 = cx + half
							} else {
								x1 = x2 = cx
								y2 = ef
							}
						} else if (pos === 'b') {
							y1 = y2 = size
							if (ori === 'h') {
								x1 = cx - half
								x2 = cx + half
							} else {
								x1 = x2 = cx
								y2 = size - ef
							}
						} else if (pos === 'l') {
							x1 = x2 = 0
							if (ori === 'v') {
								y1 = cy - half
								y2 = cy + half
							} else {
								y1 = y2 = cy
								x2 = ef
							}
						} else {
							x1 = x2 = size
							if (ori === 'v') {
								y1 = cy - half
								y2 = cy + half
							} else {
								y1 = y2 = cy
								x2 = size - ef
							}
						}
					}
				} else if (isCorner) {
					const xBase = pos.includes('l') ? hw + inset : size - hw - inset
					const yBase = pos.includes('t') ? hw + inset : size - hw - inset
					if (ori === 'h') {
						x1 = xBase
						y1 = y2 = yBase
						x2 = pos.includes('l') ? xBase + span : xBase - span
					} else {
						x1 = x2 = xBase
						y1 = yBase
						y2 = pos.includes('t') ? yBase + span : yBase - span
					}
				} else {
					const half = span / 2
					if (pos === 't') {
						y1 = y2 = hw + inset
						if (ori === 'h') {
							x1 = cx - half
							x2 = cx + half
						} else {
							x1 = x2 = cx
							y2 = hw + inset + span
						}
					} else if (pos === 'b') {
						y1 = y2 = size - hw - inset
						if (ori === 'h') {
							x1 = cx - half
							x2 = cx + half
						} else {
							x1 = x2 = cx
							y2 = size - hw - inset - span
						}
					} else if (pos === 'l') {
						x1 = x2 = hw + inset
						if (ori === 'v') {
							y1 = cy - half
							y2 = cy + half
						} else {
							y1 = y2 = cy
							x2 = hw + inset + span
						}
					} else if (pos === 'r') {
						x1 = x2 = size - hw - inset
						if (ori === 'v') {
							y1 = cy - half
							y2 = cy + half
						} else {
							y1 = y2 = cy
							x2 = size - hw - inset - span
						}
					}
				}

				parts.push(
					`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lineColor}" stroke-linecap="butt" stroke-width="${sw}" data-cf-index="${i}"/>`,
				)
			}
		}

		const inner = `<circle cx="${cx}" cy="${cy}" r="${this.innerRadius}" fill="${lineColor}"/>`

		return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;width:100%;height:100%"><defs>${defs.join('')}</defs>${inner}${parts.join('')}</svg>`
	}

	/** Return a base64 data-uri for a letter. */
	dataUri(letter: string, opts?: RenderOpts): string {
		return `data:image/svg+xml;base64,${btoa(this.svg(letter, opts))}`
	}

	/**
	 * Create an animation controller for a letter rendered into the given SVG element.
	 * The SVG must have been generated by this font's svg() method (needs data-cf-index attributes).
	 */
	animate(letter: string, svgEl: SVGSVGElement, opts?: AnimateOpts): AnimationController {
		const ldef = this.letters[letter.toUpperCase()]
		if (!ldef) {
			throw new Error(`Unknown letter: "${letter}"`)
		}
		return animateLetter(ldef, svgEl, opts)
	}
}

/** Convenience factory. */
export function createCircularFont(def: FontDef): CircularFont {
	return new CircularFont(def)
}
