import type { ResolvedElement } from './shapes'

export interface MaskDef {
	id: string
	type: 'inner' | 'ring'
	cx: number
	cy: number
	arcRadius: number
	maskRadius: number
	strokeWidth: number
	size: number
}

export function buildMasks(
	elements: ResolvedElement[],
	cx: number,
	cy: number,
	size: number,
	arcRadius: number,
	strokeWidth: number,
	innerRadius: number,
): MaskDef[] {
	const maskRadius = innerRadius + innerRadius / 2 + 2
	const needed = new Set<string>()

	for (const el of elements) {
		if (el.mask) needed.add(el.mask)
	}

	const masks: MaskDef[] = []
	if (needed.has('inner')) {
		masks.push({
			id: `cfi-${Math.random().toString(36).slice(2, 8)}`,
			type: 'inner',
			cx,
			cy,
			arcRadius,
			maskRadius,
			strokeWidth,
			size,
		})
	}
	if (needed.has('ring')) {
		masks.push({
			id: `cfr-${Math.random().toString(36).slice(2, 8)}`,
			type: 'ring',
			cx,
			cy,
			arcRadius,
			maskRadius,
			strokeWidth,
			size,
		})
	}

	return masks
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
	const rad = (deg: number) => ((deg - 90) * Math.PI) / 180
	const [x1, y1] = [cx + r * Math.cos(rad(startDeg)), cy + r * Math.sin(rad(startDeg))]
	const [x2, y2] = [cx + r * Math.cos(rad(endDeg)), cy + r * Math.sin(rad(endDeg))]
	let delta = endDeg - startDeg
	while (delta < 0) delta += 360
	while (delta >= 360) delta -= 360
	const large = delta > 180 ? 1 : 0
	return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

export function serializeToSVG(
	elements: ResolvedElement[],
	masks: MaskDef[],
	cx: number,
	cy: number,
	size: number,
	innerRadius: number,
	primaryColor: string,
): string {
	const defs: string[] = []
	const maskMap = new Map<string, string>()

	for (const m of masks) {
		maskMap.set(m.type, m.id)
		if (m.type === 'inner') {
			defs.push(
				`<mask id="${m.id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}">` +
					`<circle cx="${m.cx}" cy="${m.cy}" r="${m.cx * 2}" fill="white"/>` +
					`<circle cx="${m.cx}" cy="${m.cy}" r="${m.maskRadius}" fill="black"/>` +
					`</mask>`,
			)
		} else {
			defs.push(
				`<mask id="${m.id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}">` +
					`<rect width="${size}" height="${size}" fill="black"/>` +
					`<circle cx="${m.cx}" cy="${m.cy}" r="${m.arcRadius + m.strokeWidth / 2}" fill="white"/>` +
					`<circle cx="${m.cx}" cy="${m.cy}" r="${m.maskRadius}" fill="black"/>` +
					`</mask>`,
			)
		}
	}

	const parts: string[] = []

	for (const el of elements) {
		const maskId = el.mask ? maskMap.get(el.mask) : undefined
		const maskAttr = maskId ? ` mask="url(#${maskId})"` : ''

		if (el.kind === 'arc') {
			let delta = el.endDeg - el.startDeg
			if (Math.abs(delta) >= 360) {
				parts.push(
					`<circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" stroke="${el.stroke}" fill="none" stroke-width="${el.strokeWidth}"${maskAttr} data-cf-index="${el.index}"/>`,
				)
			} else {
				while (delta < 0) delta += 360
				if (delta > 0.001) {
					const d = describeArc(el.cx, el.cy, el.r, el.startDeg, el.endDeg)
					parts.push(
						`<path d="${d}" stroke="${el.stroke}" stroke-linecap="${el.linecap}" fill="none" stroke-width="${el.strokeWidth}"${maskAttr} data-cf-index="${el.index}"/>`,
					)
				}
			}
		} else {
			parts.push(
				`<line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" stroke="${el.stroke}" stroke-linecap="${el.strokeLinecap}" stroke-width="${el.strokeWidth}"${maskAttr} data-cf-index="${el.index}"/>`,
			)
		}
	}

	const inner = `<circle cx="${cx}" cy="${cy}" r="${innerRadius}" fill="${primaryColor}"/>`

	return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;width:100%;height:100%"><defs>${defs.join('')}</defs>${inner}${parts.join('')}</svg>`
}

export function renderToCanvas(
	elements: ResolvedElement[],
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	size: number,
	arcRadius: number,
	strokeWidth: number,
	innerRadius: number,
	primaryColor: string,
): void {
	const maskRadius = innerRadius + innerRadius / 2 + 2

	ctx.clearRect(0, 0, size, size)

	// Inner circle
	ctx.beginPath()
	ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2)
	ctx.fillStyle = primaryColor
	ctx.fill()

	for (const el of elements) {
		ctx.save()

		if (el.mask === 'inner') {
			ctx.beginPath()
			ctx.rect(0, 0, size, size)
			ctx.arc(cx, cy, maskRadius, 0, Math.PI * 2, true)
			ctx.clip()
		} else if (el.mask === 'ring') {
			ctx.beginPath()
			ctx.arc(cx, cy, arcRadius + strokeWidth / 2, 0, Math.PI * 2)
			ctx.arc(cx, cy, maskRadius, 0, Math.PI * 2, true)
			ctx.clip()
		}

		ctx.strokeStyle = el.stroke
		ctx.lineWidth = el.strokeWidth
		ctx.lineCap = el.kind === 'line' ? el.strokeLinecap : el.linecap

		if (el.kind === 'arc') {
			ctx.beginPath()
			const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180
			ctx.arc(el.cx, el.cy, el.r, toRad(el.startDeg), toRad(el.endDeg))
			ctx.stroke()
		} else {
			ctx.beginPath()
			ctx.moveTo(el.x1, el.y1)
			ctx.lineTo(el.x2, el.y2)
			ctx.stroke()
		}

		ctx.restore()
	}
}
