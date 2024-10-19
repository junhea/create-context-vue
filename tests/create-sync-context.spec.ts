import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { createSyncContext } from '../src'
import { defineComponent, h } from 'vue'

describe('create-sync-context', () => {
  describe('primitive type', () => {
    const context = createSyncContext(-1)
    const ButtonConsumer = defineComponent({
      setup() {
        const injectedContext = context.use()
        return () => h('button', { onClick: () => injectedContext.value++ }, injectedContext.value)
      },
    })
    const wrapper = mount(context.Provider, {
      props: { modelValue: 0, 'onUpdate:modelValue': (v) => wrapper.setProps({ modelValue: v }) },
      slots: { default: ButtonConsumer },
    })

    const consumer = wrapper.getComponent(ButtonConsumer)

    beforeEach(async () => {
      await wrapper.setProps({ modelValue: 0 })
    })

    it('primitive context is injected', () => {
      expect(consumer.text()).toBe('0')
    })

    it('injected primitive context is in sync with prop value', async () => {
      await wrapper.setProps({ modelValue: 10 })
      expect(consumer.text()).toBe('10')
      expect(wrapper.props('modelValue')).toBe(10)
    })

    it('primitive context is writable from consumer', async () => {
      await consumer.trigger('click')
      expect(consumer.text()).toBe('1')
      expect(wrapper.props('modelValue')).toBe(1)
    })
  })

  describe('object type', async () => {
    const context = createSyncContext({ count: -1 })
    const ButtonConsumer = defineComponent({
      setup() {
        const injectedContext = context.use()
        return () =>
          h('button', { onClick: () => injectedContext.value.count++ }, injectedContext.value.count)
      },
    })
    const wrapper = mount(context.Provider, {
      props: {
        modelValue: { count: 0 },
        'onUpdate:modelValue': (v) => wrapper.setProps({ modelValue: v }),
      },
      slots: { default: ButtonConsumer },
    })

    const consumer = wrapper.getComponent(ButtonConsumer)

    beforeEach(async () => {
      await wrapper.setProps({ modelValue: { count: 0 } })
    })

    it('object context is injected', () => {
      expect(consumer.text()).toBe('0')
    })

    it('injected object context is in sync with prop value', async () => {
      await wrapper.setProps({ modelValue: { count: 10 } })
      expect(consumer.text()).toBe('10')
      expect(wrapper.props('modelValue').count).toBe(10)
    })

    it('object context is writable from consumer', async () => {
      await consumer.trigger('click')
      expect(consumer.text()).toBe('1')
      expect(wrapper.props('modelValue').count).toBe(1)
    })
  })

  it('consumer outside of provider scope gets default value', () => {
    const context = createSyncContext(-1)
    const Consumer = defineComponent({
      setup() {
        const injectedContext = context.use()
        return () => h('p', injectedContext.value)
      },
    })
    const wrapper = mount(Consumer)
    expect(wrapper.text()).toBe('-1')
  })
})
