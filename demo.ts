const transpiler = new Bun.Transpiler({ loader: 'ts' })

async function resolveFile(pathname: string): Promise<string | null> {
	const candidates = [pathname]
	const ext = pathname.slice(pathname.lastIndexOf('/') + 1).includes('.')
	if (!ext) candidates.push(`${pathname}.ts`)

	for (const p of candidates) {
		const f = Bun.file(`.${p}`)
		if (await f.exists()) return p
	}
	return null
}

const port = process.env.PORT || 4321

Bun.serve({
	port,
	routes: {
		'/': new Response(Bun.file('./demo.html')),
	},
	async fetch(req) {
		const url = new URL(req.url)
		const resolved = await resolveFile(url.pathname)
		if (!resolved) return new Response('Not Found', { status: 404 })

		const file = Bun.file(`.${resolved}`)
		if (resolved.endsWith('.ts')) {
			const code = await transpiler.transform(await file.text())
			return new Response(code, {
				headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
			})
		}

		return new Response(file)
	},
})

console.log(`running on port ${port}`)
