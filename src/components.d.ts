// components.d.ts

// declare module '@vue/runtime-core' works for vue 3
// declare module 'vue' works for vue2 + vue 3
declare module 'vue' {
  type AntDesignVueComponents = typeof import('ant-design-vue/lib/components')
  type Antdv = {
    [P in keyof AntDesignVueComponents as `A${P}`]: AntDesignVueComponents[P]
  }
  export interface GlobalComponents extends Antdv {
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
  }

  interface HTMLAttributes {
    slot?: unknown
  }
}

export {}
