import { createVar, style } from '@vanilla-extract/css'
import type { CSSProps } from './types.ts'

export interface MotifStyle<
  P extends CSSProps = CSSProps,
  SH extends string = never,
> {
  baseClassName?: string
  refs: Record<P, string>
  classNames: Record<P, string>
  shorthands?: Record<SH, readonly P[]>
}

export function motifStyle<
  P extends readonly CSSProps[],
  SH extends string = never,
>(
  properties: P,
  options: {
    prefix?: string
    base?: Parameters<typeof style>[0]
    shorthands?: Record<SH, readonly P[number][]>
  } = {},
): MotifStyle<P[number], SH> {
  const { prefix = 'motif', base, shorthands } = options

  const refs: Record<string, string> = {}
  const classNames: Record<string, string> = {}

  for (const key of properties) {
    const cssVar = createVar(`${prefix}-${key}`)
    refs[key] = cssVar

    // Class that applies the CSS variable
    classNames[key] = style({ vars: { [key]: cssVar } })
  }

  const result = { classNames, refs, shorthands }

  if (base) {
    return { ...result, baseClassName: style(base, `${prefix}-base`) }
  }

  return result
}
