import type { ArcShape, LineShape, Anchor, LetterShape } from './types'

export interface ArcElement {
	kind: 'arc'
	cx: number
	cy: number
	r: number
	startDeg: number
	endDeg: number
	stroke: string
	strokeWidth: number
	linecap: 'butt' | 'round' | 'square'
	mask?: 'inner' | 'ring'
	index: number
}

export interface LineElement {
	kind: 'line'
	x1: number
	y1: number
	x2: number
	y2: number
	stroke: string
	strokeWidth: number
	strokeLinecap: 'butt' | 'square'
	mask?: 'inner' | 'ring'
	index: number
}

export type ResolvedElement = ArcElement | LineElement

function polar(cx: number, cy: number, r: number, degrees: number): [number, number] {
	const rad = ((degrees - 90) * Math.PI) / 180
	return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function resolveAnchor(
	anchor: Anchor,
	cx: number,
	cy: number,
	size: number,
	arcRadius: number,
	strokeWidth: number,
): [number, number] {
	if (Array.isArray(anchor)) {
		const hw = strokeWidth / 2
		let x = anchor[0] * size
		let y = anchor[1] * size
		if (anchor[0] === 0) x += hw
		else if (anchor[0] === 1) x -= hw
		if (anchor[1] === 0) y += hw
		else if (anchor[1] === 1) y -= hw
		return [x, y]
	}
	const reach = anchor.reach ?? 1
	return polar(cx, cy, arcRadius * reach, anchor.angle)
}

function buildArc(
	comp: ArcShape,
	cx: number,
	cy: number,
	arcRadius: number,
	stroke: string,
	strokeWidth: number,
	index: number,
): ArcElement {
	const [ox, oy] = comp.offset ?? [0, 0]
	return {
		kind: 'arc',
		cx: cx + ox * arcRadius,
		cy: cy + oy * arcRadius,
		r: arcRadius,
		startDeg: comp.start ?? 0,
		endDeg: comp.end ?? 360,
		stroke,
		strokeWidth,
		linecap: comp.linecap ?? 'square',
		mask: comp.mask ?? 'inner',
		index,
	}
}

function buildLine(
	comp: LineShape,
	cx: number,
	cy: number,
	size: number,
	arcRadius: number,
	stroke: string,
	strokeWidth: number,
	index: number,
): LineElement {
	let [x1, y1] = resolveAnchor(comp.from, cx, cy, size, arcRadius, strokeWidth)
	let [x2, y2] = resolveAnchor(comp.to, cx, cy, size, arcRadius, strokeWidth)

	const inset = comp.inset ?? 0
	if (inset !== 0) {
		const dx = x2 - x1,
			dy = y2 - y1
		const len = Math.sqrt(dx * dx + dy * dy)
		const ux = len > 0 ? dx / len : 0
		const uy = len > 0 ? dy / len : 0
		x1 += ux * inset
		y1 += uy * inset
		x2 -= ux * inset
		y2 -= uy * inset
	}

	const span = comp.span ?? 1
	if (span !== 1) {
		const mx = (x1 + x2) / 2,
			my = (y1 + y2) / 2
		x1 = mx + (x1 - mx) * span
		y1 = my + (y1 - my) * span
		x2 = mx + (x2 - mx) * span
		y2 = my + (y2 - my) * span
	}

	return {
		kind: 'line',
		x1,
		y1,
		x2,
		y2,
		stroke,
		strokeWidth,
		strokeLinecap: comp.mask ? 'square' : 'butt',
		mask: comp.mask,
		index,
	}
}

export interface ResolveOpts {
	cx: number
	cy: number
	size: number
	arcRadius: number
	strokeWidth: number
	accentColor: string
	primaryColor: string
}

export function resolveElements(shape: LetterShape, opts: ResolveOpts): ResolvedElement[] {
	const { cx, cy, size, arcRadius, strokeWidth, accentColor, primaryColor } = opts
	const elements: ResolvedElement[] = []

	for (let i = 0; i < shape.parts.length; i++) {
		const part = shape.parts[i]!
		if (part.type === 'arc') {
			elements.push(buildArc(part, cx, cy, arcRadius, accentColor, strokeWidth, i))
		} else {
			elements.push(buildLine(part, cx, cy, size, arcRadius, primaryColor, strokeWidth, i))
		}
	}

	return elements
}
