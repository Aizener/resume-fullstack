import { get, post, patch, del } from './../index';

export const getUserInfo = async(id: number) => {
  return get<AxiosResponseType<ApiUser>>(`/users/${id}`);
}

export const getUserList = async (searchConditions: SearchConditions) => {
  return get<AxiosResponseType<ApiUserList>>(`/users`, searchConditions);
}

export const createUser = async (user: Partial<ApiUser>) => {
  return post<AxiosResponseType<ApiUser>>(`/users`, user);
}

export const patchUserById = async (id: number, user: Partial<ApiUser>) => {
  return patch<AxiosResponseType<ApiUser>>(`/users/${id}`, user);
}

export const deleteUserById = async (id: number) => {
  return del<AxiosResponseType<ApiUser>>(`/users/${id}`);
}

export const login = async (username: string, password: string) => {
  return post<AxiosResponseType<{ id: number, accessToken: string }>>(`/auth/login`, { username, password });
}

export const getAbility = async (id: number) => {
  return get<AxiosResponseType<{ menus: ApiMenuList, permissions: ApiPermissionList}>>(`/users/ability/${id}`);
}