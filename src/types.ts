import { type CSSProperties } from 'react'

export type CSSProps = keyof CSSProperties

export interface MotifStyle<
  P extends CSSProps = CSSProps,
  SH extends string = never,
> {
  baseClassName?: string
  refs: Record<P, string>
  classNames: Record<P, string>
  shorthands?: Record<SH, readonly P[]>
}

export type CSSPropertiesSubset<P extends CSSProps> = {
  [K in P]?: K extends keyof CSSProperties ? CSSProperties[K] : never
}
export type Shorthands<SH extends string> = {
  [K in SH]?: string | number | undefined | null
}

export type MotifCss<
  P extends CSSProps,
  SH extends string,
> = CSSPropertiesSubset<P> & Shorthands<SH>

export namespace Infer {
  export type Props<T> = T extends MotifStyle<infer P, any> ? P : never

  export type CSS<T> =
    T extends MotifStyle<infer P, any>
      ? {
          [K in P]: K extends keyof CSSProperties ? CSSProperties[K] : never
        }
      : never

  export type Shorthands<T> = T extends MotifStyle<any, infer SH> ? SH : never

  export type Style<T> =
    T extends MotifStyle<infer P, infer SH>
      ? {
          [K in P]?: K extends keyof CSSProperties ? CSSProperties[K] : never
        } & {
          [K in SH]?: string | number | undefined | null
        }
      : never
}
