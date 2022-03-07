import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore } from 'vuex'
import type { Store, Dispatch, Payload, DispatchOptions, ActionContext, Commit, CommitOptions } from 'vuex'

/* 通过yapi生成的Request、Response接口结合高级类型生成我们需求的类型，好处：避免重复定义并且会动态更新 */
type UserInfo = any
interface State {
  ldap?: string
  name?: string
  userInfo: UserInfo
}
interface MyCommit extends Commit {
  (type: keyof typeof mutations, payload?: any, options?: CommitOptions): void;
  <P extends Payload>(payloadWithType: P, options?: CommitOptions): void;
}
interface MyDispatch extends Dispatch {
  (type: keyof typeof actions, payload?: any, options?: DispatchOptions): Promise<any>;
  <P extends Payload>(payloadWithType: P, options?: DispatchOptions): Promise<any>;
}
interface MyStore<S> extends Store<S> {
  dispatch: MyDispatch
  commit: MyCommit
}
interface MyActionContext<S, R> extends ActionContext<S, R> {
  dispatch: MyDispatch;
  commit: MyCommit;
}

// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol('vuex-store')

const state: State = {
  ldap: '-',
  name: '-',
  userInfo: {}
}

const mutations = {
  setUserInfo(state: State, userInfo: UserInfo) {
    state.ldap = userInfo.ldap
    state.name = userInfo.name
    state.userInfo = userInfo
  }
}

const actions = {
  async getUserInfo(context: MyActionContext<State, State>) {
    // const { data: userInfo } = await queryUserInfo()
    const userInfo = {

    }
    typeof userInfo === 'object' && context.commit('setUserInfo', userInfo)
  }
}

export const store = createStore<State>({
  state,
  mutations,
  actions,
  modules: {}
}) as MyStore<State>

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  const s = baseUseStore(key)
  return s as MyStore<State>
}
