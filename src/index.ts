import {
  defineComponent,
  inject,
  InjectionKey,
  ModelRef,
  PropType,
  provide,
  Ref,
  renderSlot,
  ToRef,
  toRef,
  useModel,
} from 'vue'

interface ContextProviderProps<Context> {
  value: Context
}

interface SyncContextProviderProps<Context> {
  modelValue: Context
}

// use props, context is ToRef (readOnly)
export function createContext<Context = any>(defaultValue: Context extends Ref ? never : Context) {
  const symbol: InjectionKey<ToRef<Context>> = Symbol()
  const Provider = defineComponent({
    props: {
      value: {
        type: null as unknown as PropType<Context>,
        required: true,
      },
    },
    setup(props, { slots }) {
      const context = toRef(props as ContextProviderProps<Context>, 'value')
      provide(symbol, context)
      return () => renderSlot(slots, 'default')
    },
  })

  const use = () => inject(symbol, toRef(defaultValue) as ToRef<Context>)

  return {
    Provider,
    use,
  }
}

// use model, context is ModelRef (writable)
export function createSyncContext<Context = any>(
  defaultValue: Context extends Ref ? never : Context,
) {
  const symbol: InjectionKey<ModelRef<Context>> = Symbol()
  const Provider = defineComponent({
    props: {
      modelValue: {
        type: null as unknown as PropType<Context>,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    setup(props, { slots }) {
      const context = useModel(props as SyncContextProviderProps<Context>, 'modelValue')
      provide(symbol, context)
      return () => renderSlot(slots, 'default')
    },
  })

  const use = () => inject(symbol, toRef(defaultValue) as ModelRef<Context>)

  return {
    Provider,
    use,
  }
}
