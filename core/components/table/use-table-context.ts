import { createInjectionState } from '@vueuse/core'

export type TableVariant = 'default' | 'headless'

export interface TableContextState {
  variant: TableVariant
}

const [useTableProvider, useTableInject] = createInjectionState((state: TableContextState) => state)

export { useTableProvider, useTableInject }
