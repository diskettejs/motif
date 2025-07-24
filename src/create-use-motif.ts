import type { CSSProps, MotifStyle } from './types.ts'
import { useMotif, type UseMotifProps } from './use-motif.ts'

export function createUseMotif<P extends CSSProps, SH extends string = string>(
	config: MotifStyle<P, SH>,
) {
	return function useMotifHook<Props extends Record<string, any> = {}>(
		props: UseMotifProps<P, SH, Props>,
	) {
		return useMotif(props, config)
	}
}
