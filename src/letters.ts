import type { LetterShape, AnimationChoreography } from './types'

export const DEFAULT_SHAPES: Record<string, LetterShape> = {
	A: {
		parts: [
			{ type: 'arc', start: -150, end: 150 },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 90 }, mask: 'inner' },
			{ type: 'line', from: { angle: 270 }, to: [0.5, 0.5], mask: 'inner' },
		],
	},
	B: {
		parts: [
			{ type: 'arc', start: -90, end: 45 },
			{ type: 'arc', start: 135, end: -90 },
			{ type: 'arc', start: 90, end: 180, offset: [0, -1], mask: 'ring' },
			{ type: 'arc', start: 0, end: 90, offset: [0, 1], mask: 'ring' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: -90 }, mask: 'inner' },
		],
	},
	C: {
		parts: [{ type: 'arc', start: 135, end: 45 }],
	},
	D: {
		parts: [{ type: 'arc', start: -30, end: 210 }],
	},
	E: {
		parts: [
			{ type: 'arc', start: 150, end: 30 },
			{ type: 'line', from: { angle: -90 }, to: [0.5, 0.5], mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 90, reach: 0.6 }, mask: 'inner' },
		],
	},
	F: {
		parts: [
			{ type: 'arc', start: 210, end: 25 },
			{ type: 'line', from: { angle: -90 }, to: [0.5, 0.5], mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 90, reach: 0.6 }, mask: 'inner' },
		],
	},
	G: {
		parts: [
			{ type: 'arc', start: 90, end: 0 },
			{ type: 'line', from: { angle: 90 }, to: [0.5, 0.5], mask: 'inner' },
		],
	},
	H: {
		parts: [
			{ type: 'arc', start: 30, end: 150 },
			{ type: 'arc', start: 210, end: 330 },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 270 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 90 }, mask: 'inner' },
		],
	},
	I: {
		parts: [
			{ type: 'arc', start: 0, end: 20 },
			{ type: 'arc', start: -20, end: 0 },
			{ type: 'arc', start: 180, end: 200 },
			{ type: 'arc', start: 160, end: 180 },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 0 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 180 }, mask: 'inner' },
		],
	},
	J: {
		parts: [{ type: 'arc', start: 0, end: 270 }],
	},
	K: {
		parts: [
			{ type: 'arc', start: -140, end: -40 },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 40, reach: 1.1 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 140, reach: 1.2 }, mask: 'inner' },
			{ type: 'line', from: { angle: -140 }, to: [0.5, 0.5], mask: 'inner' },
		],
	},
	L: {
		parts: [
			{ type: 'arc', start: 180, end: -45 },
			{ type: 'line', from: [0.5, 1], to: [0.75, 1] },
		],
	},
	M: {
		parts: [
			{ type: 'arc', start: 35, end: 150 },
			{ type: 'arc', start: -150, end: -35 },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 35 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: -35 }, mask: 'inner' },
		],
	},
	N: {
		parts: [
			{ type: 'arc', start: 30, end: 150 },
			{ type: 'arc', start: 210, end: 330 },
			{ type: 'line', from: [0.5, 0.5], to: { angle: -30 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 150 }, mask: 'inner' },
		],
	},
	O: {
		parts: [{ type: 'arc', start: 0, end: 360 }],
	},
	P: {
		parts: [
			{ type: 'arc', start: -150, end: 90 },
			{ type: 'line', from: { angle: 90 }, to: [0.5, 0.5], mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: -90 }, mask: 'inner' },
		],
	},
	Q: {
		parts: [
			{ type: 'arc', start: 0, end: 360 },
			{ type: 'line', from: [0.5, 0.5], to: { angle: -135, reach: 1.4 }, mask: 'inner' },
		],
	},
	R: {
		parts: [
			{ type: 'arc', start: -150, end: 90 },
			{ type: 'line', from: { angle: 90 }, to: [0.5, 0.5], mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: -90 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 135, reach: 1.4 }, mask: 'inner' },
		],
	},
	S: {
		parts: [
			{ type: 'arc', start: -50, end: 50 },
			{ type: 'arc', start: 130, end: 230 },
			{ type: 'line', from: { angle: -50 }, to: [0.5, 0.5], mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: -230 }, mask: 'inner' },
		],
	},
	T: {
		parts: [
			{ type: 'arc', start: -70, end: 70 },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 0 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 180 }, mask: 'inner' },
		],
	},
	U: {
		parts: [{ type: 'arc', start: 45, end: -45 }],
	},
	V: {
		parts: [
			{ type: 'arc', start: 45, end: 90, linecap: 'butt' },
			{ type: 'arc', start: -90, end: -45, linecap: 'butt' },
			{ type: 'line', from: [1, 0.5], to: [0.5, 1], mask: 'ring' },
			{ type: 'line', from: [0.5, 1], to: [0, 0.5], mask: 'ring' },
		],
	},
	W: {
		parts: [
			{ type: 'arc', start: 30, end: 150 },
			{ type: 'arc', start: 210, end: 330 },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 210 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: -210 }, mask: 'inner' },
		],
	},
	X: {
		parts: [
			{ type: 'line', from: [0.5, 0.5], to: { angle: 35, reach: 1.1 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 145, reach: 1.1 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: -35, reach: 1.1 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: -145, reach: 1.1 }, mask: 'inner' },
		],
	},
	Y: {
		parts: [
			{ type: 'arc', start: 100, end: 180, offset: [0, -1], mask: 'inner' },
			{ type: 'arc', start: 180, end: -100, offset: [0, -1], mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 180 }, mask: 'inner' },
		],
	},
	Z: {
		parts: [
			{ type: 'arc', start: -50, end: 50 },
			{ type: 'arc', start: 130, end: 230 },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 50 }, mask: 'inner' },
			{ type: 'line', from: [0.5, 0.5], to: { angle: 230 }, mask: 'inner' },
		],
	},
}

export const DEFAULT_ANIMATIONS: Record<string, AnimationChoreography> = {
	A: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 800, easing: 'ease-in-out', reverse: true }] }, // oxfmt-ignore
			{ index: 1, order: 2, steps: [{ preset: 'draw', duration: 200, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 200, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	B: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 2, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 3, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 4, order: 1, steps: [{ preset: 'draw', duration: 350, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	C: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 800, easing: 'ease-in-out' }] }, // oxfmt-ignore
		],
	},
	D: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 800, easing: 'ease-in-out' }] }, // oxfmt-ignore
		],
	},
	E: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 700, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 2, order: 2, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	F: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 700, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 2, order: 2, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	G: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 500, easing: 'ease-out', reverse: true }] }, // oxfmt-ignore
			{ index: 1, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	H: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 3, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	I: {
		parts: [
			{ index: 0, order: 1, steps: [{ preset: 'draw', duration: 500, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 1, steps: [{ preset: 'draw', duration: 500, easing: 'ease-in-out', reverse: true }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 500, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 3, order: 1, steps: [{ preset: 'draw', duration: 500, easing: 'ease-in-out', reverse: true }] }, // oxfmt-ignore
			{ index: 4, order: 0, steps: [{ preset: 'draw', duration: 350, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 5, order: 0, steps: [{ preset: 'draw', duration: 350, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	J: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 800, easing: 'ease-in-out' }] }, // oxfmt-ignore
		],
	},
	K: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 400, easing: 'ease-in-out', reverse: true }] }, // oxfmt-ignore
			{ index: 1, order: 2, steps: [{ preset: 'draw', duration: 200, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 2, order: 3, steps: [{ preset: 'draw', duration: 200, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 3, order: 1, steps: [{ preset: 'draw', duration: 200, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	L: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 400, easing: 'ease-in-out', reverse: true }] }, // oxfmt-ignore
			{ index: 1, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	M: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 3, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	N: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 3, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	O: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 1000, easing: 'ease-in-out' }] }, // oxfmt-ignore
		],
	},
	P: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 700, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 2, order: 2, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	Q: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 800, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 1, steps: [{ preset: 'draw', duration: 500, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	R: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 700, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 2, order: 2, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 3, order: 3, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	S: {
		parts: [
			{ index: 0, order: 4, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 3, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 3, order: 2, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	T: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 700, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	U: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 700, easing: 'ease-in-out' }] }, // oxfmt-ignore
		],
	},
	V: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 700, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 0, steps: [{ preset: 'draw', duration: 700, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 2, order: 2, steps: [{ preset: 'draw', duration: 350, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 3, order: 2, steps: [{ preset: 'draw', duration: 350, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	W: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 3, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	X: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 500, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 1, order: 0, steps: [{ preset: 'draw', duration: 500, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 500, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 3, order: 1, steps: [{ preset: 'draw', duration: 500, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	Y: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out', reverse: true }] }, // oxfmt-ignore
			{ index: 1, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
	Z: {
		parts: [
			{ index: 0, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 1, order: 0, steps: [{ preset: 'draw', duration: 600, easing: 'ease-in-out' }] }, // oxfmt-ignore
			{ index: 2, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
			{ index: 3, order: 1, steps: [{ preset: 'draw', duration: 400, easing: 'ease-out' }] }, // oxfmt-ignore
		],
	},
}
