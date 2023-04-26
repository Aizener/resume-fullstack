import { Router, RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import routes, { generateMenuRoutes, layoutRoute } from './routes';
import { getSessionStorage } from '@/utils/business';

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes
});
const originRoutes = JSON.parse(JSON.stringify(routes));

export const initRouter = () => {
  const menus = getSessionStorage('menus') as unknown as ApiMenuList;
  const layoutRoutes = generateMenuRoutes(menus);
  router.removeRoute('Layout');
  layoutRoute.children = layoutRoutes as RouteRecordRaw[]
  router.addRoute(layoutRoute);
  router.replace(router.currentRoute.value.fullPath);
  return router;
}

router.beforeEach(async (to, from, next) => {
  const accessToken = getSessionStorage('accessToken');
  if (accessToken) {
    if (to.path === '/login') {
      next('/');
    } else {
      next();
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next('/login');
    }
  }
});

export default router;
