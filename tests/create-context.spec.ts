import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { createContext } from '../src'
import { defineComponent, h, inject } from 'vue'

describe('create-context', () => {
  describe('primitive type', () => {
    const context = createContext(-1)
    const Consumer = defineComponent({
      setup() {
        const injectedContext = context.use()
        return () => h('p', injectedContext.value)
      },
    })
    const wrapper = mount(context.Provider, {
      props: { value: 0 },
      slots: { default: Consumer },
    })

    const consumer = wrapper.getComponent(Consumer)

    beforeEach(async () => {
      await wrapper.setProps({ value: 0 })
    })

    it('primitive context is injected', () => {
      expect(consumer.text()).toBe('0')
    })

    it('injected primitive context is in sync with prop value', async () => {
      await wrapper.setProps({ value: 10 })
      expect(consumer.text()).toBe('10')
    })
  })

  describe('object type', async () => {
    const context = createContext({ count: -1 })
    const Consumer = defineComponent({
      setup() {
        const injectedContext = context.use()
        return () => h('p', injectedContext.value.count)
      },
    })
    const wrapper = mount(context.Provider, {
      props: {
        value: { count: 0 },
      },
      slots: { default: Consumer },
    })

    const consumer = wrapper.getComponent(Consumer)

    beforeEach(async () => {
      await wrapper.setProps({ value: { count: 0 } })
    })

    it('object context is injected', () => {
      expect(consumer.text()).toBe('0')
    })

    it('injected object context is in sync with prop value', async () => {
      await wrapper.setProps({ value: { count: 10 } })
      expect(consumer.text()).toBe('10')
    })
  })

  it('consumer outside of provider scope gets default value', () => {
    const context = createContext(-1)
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
