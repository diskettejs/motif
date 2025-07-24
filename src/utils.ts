/**
 * Helper function to categorize props into sprinkled, primitive, and rest
 */
export function categorizeProps<T extends Record<string, any>>(
	props: T,
	config: {
		refs: Record<string, any>
		shorthands?: Record<string, any>
	},
) {
	const primitive: Record<string, any> = {}
	const shorthands: Record<string, any> = {}

	const rest: Record<string, any> = {}
	const shorthandsStyle = config.shorthands ?? {}

	for (const [key, value] of Object.entries(props)) {
		if (key in config.refs) {
			primitive[key] = value
		} else if (key in shorthandsStyle) {
			shorthands[key] = value
		} else {
			rest[key] = value
		}
	}

	return { primitive, shorthands, rest }
}

export const UNITLESS: Record<string, boolean> = {
	animationIterationCount: true,
	borderImage: true,
	borderImageOutset: true,
	borderImageSlice: true,
	borderImageWidth: true,
	boxFlex: true,
	boxFlexGroup: true,
	columnCount: true,
	columns: true,
	flex: true,
	flexGrow: true,
	flexShrink: true,
	fontWeight: true,
	gridArea: true,
	gridColumn: true,
	gridColumnEnd: true,
	gridColumnStart: true,
	gridRow: true,
	gridRowEnd: true,
	gridRowStart: true,
	initialLetter: true,
	lineClamp: true,
	lineHeight: true,
	maxLines: true,
	opacity: true,
	order: true,
	orphans: true,
	scale: true,
	tabSize: true,
	WebkitLineClamp: true,
	widows: true,
	zIndex: true,
	zoom: true,

	// svg properties
	fillOpacity: true,
	floodOpacity: true,
	maskBorder: true,
	maskBorderOutset: true,
	maskBorderSlice: true,
	maskBorderWidth: true,
	shapeImageThreshold: true,
	stopOpacity: true,
	strokeDashoffset: true,
	strokeMiterlimit: true,
	strokeOpacity: true,
	strokeWidth: true,
}

export function resolveValue(key: string, value: unknown) {
	return typeof value === 'number' && value !== 0 && !UNITLESS[key]
		? `${value}px`
		: String(value)
}
