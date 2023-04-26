import { Component } from 'vue'

export const routeDict: Record<string, () => Component> = {
  RoleList: () => import('@/pages/role/Index.vue'),
  UserList: () => import('@/pages/home/Index.vue')
}