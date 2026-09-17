import { it, expect } from 'bun:test'
import { CircularFont, createCircularFont } from './index'
import { DEFAULT_SHAPES, DEFAULT_ANIMATIONS } from './letters'

const font = createCircularFont({ letters: DEFAULT_SHAPES, animations: DEFAULT_ANIMATIONS })

it('renders default letters without throwing', () => {
	for (const letter of Object.keys(DEFAULT_SHAPES)) {
		const svg = font.svg(letter)
		expect(svg).toContain('<svg')
		expect(svg).toContain('</svg>')
	}
})

it('renders data-uri', () => {
	const uri = font.dataUri('A')
	expect(uri).toMatch(/^data:image\/svg\+xml;base64,/)
})

it('throws on unknown letter', () => {
	expect(() => font.svg('@')).toThrow('Unknown letter: "@"')
})

it('accepts render options', () => {
	const svg = font.svg('S', {
		strokeWidth: 10,
		primaryColor: '#ff0000',
		accentColor: '#00ff00',
		size: 512,
	})
	expect(svg).toContain('viewBox="0 0 512 512"')
	expect(svg).toContain('#ff0000')
	expect(svg).toContain('#00ff00')
	expect(svg).toContain('stroke-width="10"')
})

it('custom font config works', () => {
	const custom = new CircularFont({
		arcRadius: 100,
		innerRadius: 40,
		letters: {
			X: {
				parts: [
					{ type: 'arc', start: 45, end: 225 },
					{ type: 'arc', start: 225, end: 405 },
				],
			},
		},
	})
	const svg = custom.svg('X')
	expect(svg).toContain('A 100 100')
})

it('lines are present for E F G', () => {
	expect(font.svg('E')).toContain('<line')
	expect(font.svg('F')).toContain('<line')
	expect(font.svg('G')).toContain('<line')
})

it('masks are present for arcs that need inner masking', () => {
	expect(font.svg('C')).toContain('<mask')
})

it('define() with builder works', () => {
	const f = new CircularFont()
	f.define('A', (b) =>
		b.arc(-150, 150).line([0.5, 0.5], { angle: 90 }).line({ angle: 270 }, [0.5, 0.5]),
	)
	const svg = f.svg('A')
	expect(svg).toContain('<path') // arc
	expect(svg).toContain('<line') // lines
})

it('addLetter and removeLetter work', () => {
	const f = new CircularFont()
	f.addLetter('Z', {
		parts: [{ type: 'arc', start: 0, end: 360 }],
	})
	expect(f.svg('Z')).toContain('<svg')
	f.removeLetter('Z')
	expect(() => f.svg('Z')).toThrow('Unknown letter')
})

it('canvas renders without throwing', () => {
	const ctx = {
		clearRect() {},
		beginPath() {},
		arc() {},
		fill() {},
		stroke() {},
		moveTo() {},
		lineTo() {},
		rect() {},
		clip() {},
		save() {},
		restore() {},
		fillStyle: '',
		strokeStyle: '',
		lineWidth: 0,
		lineCap: 'butt' as CanvasLineCap,
	} as unknown as CanvasRenderingContext2D

	expect(() => font.canvas('A', ctx)).not.toThrow()
})
