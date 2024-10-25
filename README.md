# create-context-vue

Vue implementation of react's context API

## Installation

```bash
npm install create-context-vue
```

## Usage

Create a context

```ts
const CountContext = createContext(0)
```

Wrap consumer with provider

```vue
<template>
  <CountContext.provider :value="count">
    <Consumer />
  </CountContext.provider>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
```

Inject context

```vue
<template>
  {{ injectedCount }}
</template>

<script setup>
const injectedCount = CountContext.use()
</script>
```

Or use `create-sync-context` to create context with two-way binding

```js
const SyncCountContext = createSyncContext(0)
```

```vue
<template>
  <SyncCountContext.provider v-model="count">
    <Consumer />
  </SyncCountContext.provider>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
```
