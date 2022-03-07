/**
 * 登录
 */
function login() {
  const from = encodeURIComponent(location.href)
  const authServerUrl = `https://account.zhenguanyu.com/login?service=${from}`
  location.replace(authServerUrl)
}

/**
 * 登出
 */
function logout() {
  const from = encodeURIComponent(location.href)
  const outUrl = `https://account.zhenguanyu.com/logout?from=${from}`
  location.replace(outUrl)
}

export { login, logout }
