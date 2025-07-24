import type { CSSProps, MotifStyle } from './types.ts'
import { useMotif, type UseMotifProps } from './use-motif.ts'

export function createUseMotif<P extends CSSProps, SH extends string = never>(
  config: MotifStyle<P, SH>,
) {
  return function useMotifHook<Props extends Record<string, any> = {}>(
    props: Props & UseMotifProps<P, SH>,
  ) {
    return useMotif(props, config)
  }
}
