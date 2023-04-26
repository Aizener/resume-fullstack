declare module 'element-plus/dist/locale/zh-cn.mjs';
type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;

type ExpandObject<T> = T extends infer P ? { [K in keyof P]: P[K] } : never;

type AxiosResponseType<T> = {
  code: number,
  msg: string,
  data: ExpandObject<T>,
  total?: number,
  err: string | null
}

type TabRoute = {
  name: string,
  path: string
}
type RouterStore = {
  routes: TabRoute[],
  currentRoute: RouteRecordNormalized
}

type DayType = {
  month: number,
  day: number,
  title: string
}

type MainState = {
  version: string,
  collapse: boolean,
  locale: string,
  showDrawer: boolean,
  theme: string,
  viewType: 'default' | 'dark',
  user: null | Record<string, unknown>,
  permission: { menus: Array },
  layoutRoutes: Array<RouteRecordRaw>,
  isMobile: boolean
}

type MenuItem = {
  index: string,
  title: string,
  path: string,
  isLink: boolean,
  icon?: Component,
  children?: Menu
}
type RouteItem = {
  name: string,
  path: string,
  icon?: Component,
  component?: string,
  meta: Record<string, unknown>,
  children?: RouteItem[]
}

type Menu = Array<ExpandObject<MenuItem>>;

type SearchConditions = {
  page?: number,
  size?: number,
  [prop: string]: any
}