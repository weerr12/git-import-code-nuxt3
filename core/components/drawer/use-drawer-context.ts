import { createInjectionState } from '@vueuse/core'

export interface DrawerContextState {
  closeDrawer: () => void
}

const [useDrawerProvider, useDrawerInject] = createInjectionState(
  (state: DrawerContextState) => state
)

export { useDrawerProvider, useDrawerInject }
