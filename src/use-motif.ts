import { assignInlineVars } from '@vanilla-extract/dynamic'
import clsx from 'clsx'
import { useMemo, type CSSProperties } from 'react'
import type { CSSProps, MotifCss, MotifStyle } from './types.ts'
import { categorizeProps, resolveValue } from './utils.ts'

export type UseMotifProps<
  P extends CSSProps = never,
  SH extends string = never,
> = {
  className?: string
  style?: CSSProperties
} & MotifCss<P, SH>


type ExtractMotifKeys<T> = T extends MotifStyle<infer P, infer SH>
  ? P | (SH extends never ? never : SH)
  : never

export function useMotif<
  TProps extends Record<string, any>,
  TConfig extends MotifStyle<any, any>
>(
  props: TProps,
  config: TConfig,
): Omit<TProps, ExtractMotifKeys<TConfig> | 'className' | 'style'> & {
  className?: string
  style?: CSSProperties
} {
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
      const className = config.classNames[key as keyof typeof config.classNames]
      if (cssVar && className) {
        vars[cssVar] = resolveValue(key, value)
        styleClassNames.push(className)
      }
    }

    // Process shorthands
    for (const [shorthand, value] of Object.entries(shorthands)) {
      if (value === null || value === undefined) {
        continue
      }

      const properties = config.shorthands?.[shorthand] || []

      for (const prop of properties) {
        if (prop in config.refs) {
          const cssVar = config.refs[prop as keyof typeof config.refs]
          const className = config.classNames[prop as keyof typeof config.classNames]
          if (cssVar && className) {
            vars[cssVar] = resolveValue(prop as string, value)
            styleClassNames.push(className)
          }
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
      ...rest,
      ...processed,
    } as any
  }, [props, config])
}
