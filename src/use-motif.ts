import type { CSSProperties } from '@vanilla-extract/css'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import clsx from 'clsx'
import { useMemo } from 'react'
import type { CSSProps, MotifCss, MotifStyle } from './types.ts'
import { categorizeProps, resolveValue } from './utils.ts'

export type UseMotifProps<
	P extends CSSProps = never,
	SH extends string = never,
	Props extends Record<string, any> = {},
> = Props & {
	className?: string
	style?: CSSProperties
} & MotifCss<P, SH>

type UseMotifReturn<
	P extends CSSProps,
	SH extends string = string,
	Props extends Record<string, any> = {},
> = Omit<Props, P | SH> & {
	className?: string
	style?: CSSProperties
}

export function useMotif<
	P extends CSSProps,
	SH extends string = string,
	Props extends Record<string, any> = {},
>(
	props: UseMotifProps<P, SH, Props>,
	config: MotifStyle<P, SH>,
): UseMotifReturn<P, SH, Props> {
	return useMemo(() => {
		const { className, style, ...allProps } = props

		const { primitive, shorthands, rest } = categorizeProps(allProps, config)

		const vars: Record<string, string> = {}
		const styleClassNames: string[] = []

		// Process primitive CSS properties
		for (const [key, value] of Object.entries(primitive)) {
			if (value === null || value === undefined) {
				continue
			}

			const cssVar = config.refs[key as keyof typeof config.refs]
			vars[cssVar] = resolveValue(key, value)
			styleClassNames.push(
				config.classNames[key as keyof typeof config.classNames],
			)
		}

		// Process shorthands
		for (const [shorthand, value] of Object.entries(shorthands)) {
			if (value === null || value === undefined) {
				continue
			}

			const properties = config.shorthands?.[shorthand as SH] || []

			for (const prop of properties) {
				if (prop in config.refs) {
					const cssVar = config.refs[prop as keyof typeof config.refs]
					vars[cssVar] = resolveValue(prop as string, value)
					styleClassNames.push(
						config.classNames[prop as keyof typeof config.classNames],
					)
				}
			}
		}

		const processedClassName = clsx(
			config.baseClassName,
			styleClassNames,
			className,
		)

		const processed: { className?: string; style?: CSSProperties } = {
			style: {
				...style,
				...assignInlineVars(vars),
			},
		}
		if (processedClassName) {
			processed.className = processedClassName
		}

		return {
			...processed,
			...rest,
		} as UseMotifReturn<P, SH, Props>
	}, [props, config])
}
