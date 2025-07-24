# Motif

- A CSS-in-JS styling system for React built on top of [vanilla-extract](https://vanilla-extract.style/).
- A CLI to compile `@vanilla-extract` styles defined in `.css.ts` files to CSS without the need for a bundler integration.

## Installation

```bash
pnpm add @diskette/motif
```

## Usage

### 1. Define Your Styles

Create a `.css.ts` file to define your component's styles using `motifStyle`:

```typescript
// Button.css.ts
import { motifStyle, Infer } from '@diskette/motif'

export const styles = motifStyle([
	'width',
	'height',
	'padding',
	'margin',
	'backgroundColor',
	'color',
])

// Export type for component props
export type MotifStyleProps = Infer.Style<typeof styles>
```

### 2. Use in Components

Apply the styles in your React components:

```tsx
// Button.tsx
import { styles, type MotifStyleProps } from './Button.css.ts'
import { useMotif } from '@diskette/motif'

interface ButtonProps extends MotifStyleProps {
	children: React.ReactNode
	onClick?: () => void
}

export function Button(props: ButtonProps) {
	const buttonProps = useMotif(props, styles)

	return <button {...buttonProps}>{children}</button>
}

// Usage
;<Button
	width="200px"
	height="40px"
	padding="8px 16px"
	backgroundColor="blue"
	color="white"
>
	Click me
</Button>
```

## CLI Usage

The `motif` CLI compiles your `.css.ts` to JS and generate their corresponding CSS files. By default, the `tsconfig.json` in your project root is used to find `.css.ts` files.

### Basic Usage

```bash
# Run the CLI (using npx)
npx @diskette/motif

# Or add to package.json scripts
{
  "scripts": {
    "build:css": "motif"
  }
}
```

### CLI Options

#### `--ident, -i` (Identifier Format)

Controls how CSS class names are generated:

- `short` (default) - Produces minified class names for production (e.g., `_1a2b3c`)
- `debug` - Generates human-readable class names for development (e.g., `Button_styles_backgroundColor`)

```bash
# Production build with short identifiers
npx @diskette/motif --ident short

# Development build with readable class names
npx @diskette/motif --ident debug
```

#### `--css-ext` (CSS File Extension)

Customize the extension for generated CSS files. By default, files are named `[name].ts.vanilla.css` as per `@vanilla-extract` convention.

```bash
# Generate files as [name].styles.css
npx @diskette/motif --css-ext .styles.css

# Generate files as [name].motif.css
npx @diskette/motif --css-ext .motif.css
```

#### `--imports` (Import Statements)

Controls whether the generated JS files include imports for their corresponding CSS files. (default: true).

```bash
# Disable CSS imports (useful for certain bundler configurations)
npx @diskette/motif --imports false
```

```bash
# Can also be negated with:
npx @diskette/motif --no-imports
```

#### `--tsconfig` (TypeScript Configuration)

Specify a custom TypeScript configuration file.

```bash
# Use a specific TypeScript config
npx @diskette/motif --tsconfig tsconfig.build.json
```

### Build Integration

The CLI should be run before your main build process:

```json
{
	"scripts": {
		"build:css": "motif",
		"build:js": "tsc",
		"build": "npm run build:css && npm run build:js",
		"dev": "npm run build:css && vite"
	}
}
```

### Generated File Structure

For a component file `Button.css.ts`:

```
src/
  Button.css.ts         # vanilla-extract styles
  Button.tsx           # Your React component
dist/
  Button.css.js        # Compiled JavaScript
  Button.css.ts.vanilla.css  # Generated CSS file
```

## Advanced Usage

### With Shorthands

Define shorthand properties for common style combinations:

```typescript
export const styles = motifStyle(
	['margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
	{
		shorthands: {
			mx: ['marginLeft', 'marginRight'],
			my: ['marginTop', 'marginBottom'],
			m: ['margin'],
		},
	},
)
```

### With Base Styles

Apply base styles to all elements:

```typescript
export const styles = motifStyle(['width', 'height'], {
	base: {
		boxSizing: 'border-box',
		display: 'flex',
	},
})
```

## Type Safety

Motif provides full TypeScript support with type inference for:

- CSS property names
- Property values based on CSS specifications

```typescript
// TypeScript will enforce valid CSS values
<Button
  width="100px"        // ✓ Valid
  width="invalid"      // ✗ Type error
  backgroundColor="red" // ✓ Valid
  unknownProp="value"  // ✗ Type error
/>
```
