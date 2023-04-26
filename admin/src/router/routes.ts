import { getSessionStorage } from "@/utils/business";
import { RouteRecordRaw } from "vue-router";
import { routeDict } from "./route-dict";

export const generateMenuRoutes = (menus: ApiMenuList) => {
  const routes = menus.map(menu => {
    const { name, path, children } = menu;
    const route: Record<string, any> = {
      name,
      path,
    };
    if (children && children.length) {
      route.redirect = children[0].path;
      route.children = generateMenuRoutes(children);
    } else {
      const compFunc = routeDict[name];
      route.component = compFunc;
    }

    return route;
  });

  return routes;
}

export const layoutRoute: RouteRecordRaw = {
  name: 'Layout',
  path: '/',
  component: () => import('@/pages/layout/Index.vue'),
  children: []
}

const routes: RouteRecordRaw[] = [
  layoutRoute,
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/pages/login/Index.vue')
  }
];

export default routes;