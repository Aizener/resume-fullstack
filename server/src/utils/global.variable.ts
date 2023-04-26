export const Fields = {
  USER: 'user',
  USERNAME: 'username',
  ROLE: 'role',
  PERMISSION: 'permission',
  MENU: 'menu',
  PARENT_MENU: 'parent_menu',
  RESUME: 'resume',
  TEMPLATE: 'template',
  TEMPLATE_TYPE: 'templateType',
};

export const getFieldLabel = (field: string) => {
  const dict = new Map([
    [Fields.USER, '用户'],
    [Fields.USERNAME, '用户名'],
    [Fields.ROLE, '角色名'],
    [Fields.PERMISSION, '权限'],
    [Fields.MENU, '菜单'],
    [Fields.PARENT_MENU, '父级菜单'],
    [Fields.RESUME, '简历'],
    [Fields.TEMPLATE, '模板'],
    [Fields.TEMPLATE_TYPE, '模板类型'],
  ]);
  return dict.get(field);
};
