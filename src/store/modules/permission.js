import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, userRoleList) {
  // console.log('routes', routes)
  const routes_copy = [...routes]
  function getRoute(routes) {
    routes.forEach(item => {
      if (item.children && item.children.length) {
        item.show = true
        getRoute(item.children)

        item.show = item.children.some(subitem => {
          return subitem.show
        })
      } else {
        if (item.meta && item.meta.id) {
          item.show = Boolean(userRoleList.indexOf(String(item.meta.id)) > -1)
        } else {
          item.show = false
        }
      }
    })
  }
  getRoute(routes_copy)

  function filterRoute(list) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item.show) {
        if (item.children && item.children.length) {
          filterRoute(item.children)
        }
      } else {
        list.splice(i, 1)
        i--
      }
    }
  }
  filterRoute(routes_copy)
  routes_copy.push({ path: '*', redirect: '/404', hidden: true })
  // console.log('routes_copy', routes_copy)
  return routes_copy
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes ({ commit }, userRoleList) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, userRoleList)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
