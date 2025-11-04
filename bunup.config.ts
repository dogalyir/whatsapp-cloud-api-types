import { defineConfig } from 'bunup'

export default defineConfig({
	// Externalize Zod to avoid bundling it (it's a dependency)
	packages: 'external',

	// Disable code splitting to avoid CommonJS helpers that break in Workers
	splitting: false,

	// Enable minification for production builds
	minify: true,

	// Generate linked source maps for debugging
	sourcemap: 'linked',

	// TypeScript declaration options
	dts: {
		// Enable type inference to handle isolatedDeclarations
		inferTypes: true,

		// Disable declaration splitting to avoid module resolution issues
		splitting: false,

		// Minify declaration files to reduce size
		minify: true,
	},

	// Build report configuration
	report: {
		// Enable gzip size calculation (default: true)
		gzip: true,

		// Enable brotli size calculation for better compression metrics
		brotli: true,

		// Warn if any bundle exceeds 500KB (reasonable for a types library)
		maxBundleSize: 500 * 1024,
	},

	// Automatically generate and sync package.json exports
	exports: true,
})
