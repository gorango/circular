import { it } from 'vitest'
import { CircularFont, createCircularFont } from './index'
import { DEFAULT_LETTERS } from './letters'

const font = createCircularFont({ letters: DEFAULT_LETTERS })

it('renders default letters without throwing', ({ expect }) => {
	for (const letter of Object.keys(DEFAULT_LETTERS)) {
		const svg = font.svg(letter)
		expect(svg).toContain('<svg')
		expect(svg).toContain('</svg>')
	}
})

it('renders data-uri', ({ expect }) => {
	const uri = font.dataUri('A')
	expect(uri).toMatch(/^data:image\/svg\+xml;base64,/)
})

it('throws on unknown letter', ({ expect }) => {
	expect(() => font.svg('@')).toThrow('Unknown letter: "@"')
})

it('accepts render options', ({ expect }) => {
	const svg = font.svg('S', {
		strokeWidth: 10,
		primaryColor: '#ff0000',
		secondaryColor: '#00ff00',
		size: 512,
	})
	expect(svg).toContain('viewBox="0 0 512 512"')
	expect(svg).toContain('#ff0000')
	expect(svg).toContain('#00ff00')
	expect(svg).toContain('stroke-width="10"')
})

it('custom font config works', ({ expect }) => {
	const custom = new CircularFont({
		arcRadius: 100,
		innerRadius: 40,
		letters: {
			X: {
				components: [
					{ type: 'arc', start: 45, end: 225 },
					{ type: 'arc', start: 225, end: 405 },
				],
			},
		},
	})
	const svg = custom.svg('X')
	expect(svg).toContain('A 100 100')
})

it('lines are present for E F G', ({ expect }) => {
	expect(font.svg('E')).toContain('<line')
	expect(font.svg('F')).toContain('<line')
	expect(font.svg('G')).toContain('<line')
})

it('no mask when letter has no lines', ({ expect }) => {
	const svg = font.svg('C')
	expect(svg).not.toContain('<mask')
})
