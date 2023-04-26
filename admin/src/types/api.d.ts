type ApiUser = {
  id: number;
  username: string;
  password: string;
  email: string,
  nickname: string,
  phone: string,
  role: number | string,
  roleInfo:  Record<string, any>,
  age: number | string,
  sex: number | string,
  createdTime: string,
  updatedTime: string
};

type ApiUserList = ExpandObject<ApiUser>[];

type ApiRole = {
  id: number;
  name: string;
  menus?: number[],
  permissions?: number[],
  menusInfo: ApiMenu[],
  permissionsInfo: ApiPermission[]
}
type ApiRoleList = ExpandObject<ApiRole>[];

type ApiMenu = {
  id: number,
  name: string,
  path: string,
  title: string,
  children?: ApiMenu[]
}
type ApiMenuList = ExpandObject<ApiMenu>[];

type ApiPermission = {
  id: number,
  name: string,
  method: string,
  title: string,
  children?: ApiPermission[]
}

type ApiPermissionList = ExpandObject<ApiPermission>[];