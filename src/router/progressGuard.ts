import { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function createProgressGuard(router: Router) {
  NProgress.inc(0.1)
  NProgress.configure({ easing: 'ease-in-out', speed: 200, showSpinner: false })

  router.beforeEach(async () => {
    NProgress.start()
    return true
  })
  router.afterEach(async () => {
    NProgress.done()
    return true
  })
}
