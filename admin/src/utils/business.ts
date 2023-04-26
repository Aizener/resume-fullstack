export const transferSex = (sex: number) => ['女', '男'][sex] || '未知';
export const transferDateString = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const _padStart = (value: number) => {
    return value.toString().padStart(2, '0');
  }
  return `${year}-${_padStart(month)}-${_padStart(day)} ${_padStart(hour)}:${_padStart(minute)}:${_padStart(second)}`;
}

export const parseTableConditionSeoForm = (seoForm: any[]) => {
  return seoForm.reduce((obj, item) => {
    if (item.value) {
      obj[item.prop] = item.value;
    }
    return obj;
  }, {});
}

export const filterEmptyValueForObject = (_obj: Record<string, any>) => {
  let obj: Record<string, any> = {};
  for (const key in _obj) {
    const value = _obj[key];
    if (value !== '' && value !== undefined && value !== null) {
      obj[key] = value;
    }
  }
  return obj;
}

export const getPermissionTree = (permissions: ApiPermissionList) => {
  const obj: Record<string, any> = {};
  const setPermission = (permissions: ApiPermissionList) => {
    permissions.forEach(p => {
      if (!obj[p.name]) {
        obj[p.name] = {};
      }
      obj[p.name][p.method] = true;
      if (p.children) {
        setPermission(p.children);
      }
    }); 
  }
  setPermission(permissions);
  return obj;
}

export const saveSessionStorage = (key: string, value: any) => {
  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(key, value);
}

export const getSessionStorage = (key: string) => {
  let value = sessionStorage.getItem(key);
  if (value) {
    try {
      value = JSON.parse(value);
    } catch(err) {
      return value;
    }
  }
  return value;
}

