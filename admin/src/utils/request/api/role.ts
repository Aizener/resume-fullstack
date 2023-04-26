import { get, patch, post } from "../index";

export const getRoleInfo = async (id: number) => {
  return get<AxiosResponseType<ApiRole>>(`/role/${id}`);
}

export const getAllRole = async () => {
  return get<AxiosResponseType<ApiRoleList>>(`/role`);
}

export const getRoleList = async (searchConditions: SearchConditions) => {
  return get<AxiosResponseType<ApiRoleList>>(`/role/list`, searchConditions);
}

export const saveRole = async (role: Partial<ApiRole>) => {
  return post<AxiosResponseType<ApiRole>>(`/role`, role);
}

export const updateRole = async (id: number, role: Partial<ApiRole>) => {
  return patch<AxiosResponseType<ApiRole>>(`/role/${id}`, role);
}

export const getMenuTree = async () => {
  return get<AxiosResponseType<ApiMenuList>>(`/menu/tree`);
}

export const getPermissionGroup = async () => {
  return get<AxiosResponseType<ApiPermissionList>>(`/permission/group`);
}