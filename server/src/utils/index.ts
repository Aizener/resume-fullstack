import * as bcrypt from 'bcrypt';
type NestArray = {
  id: number;
  pid: number;
  children?: unknown[];
}[];

/**
 * 根据有父子关系的数组生成树形结构， 适用于：[{ id: 1, name: 'a' }, { id: 2, name: 'b', pid: 1 }] => { id: 1, name: 'a', children: [{ id: 2, name: 'b', pid: 1 }] }
 * @param arr 传入一维数组
 * @returns 返回带有树形结构的数组
 */
export const generateNestArrayToTree = (arr: NestArray, _parents?: any) => {
  const parents: any = _parents ? _parents : arr.filter((item) => !item.pid);
  const childs: any = arr.filter((item) => item.pid);
  parents.forEach((parent) => (parent.children = []));

  const generateTree = (parents, childs) => {
    for (const parent of parents) {
      for (const child of childs) {
        if (parent.id === child.pid) {
          child._has_parent = true;
          parent.children.push(
            ...generateTree(
              [child],
              childs.filter((item) => !item._has_parent),
            ),
          );
        }
      }
    }

    return [...parents];
  };

  const result = generateTree(parents, childs);
  return [...result, ...childs.filter((item) => !item._has_parent)];
};

/**
 * 将数组按字段分类成对象，适用于：[{ name: 'user', method: 'get' }, { name: 'user', method: 'post' }] => { user: { get: value, post: value }}
 * @param arr 传入的数组
 * @param field1 分组字段
 * @param field2 每组key值
 * @param value 每组对应的值
 * @returns 返回生成的新对象
 */
export const groupArrayToObjectBy = (
  arr: unknown[],
  field1: string,
  field2: string,
  value: unknown,
) => {
  const result = arr.reduce((res, item) => {
    const name = item[field1],
      key = item[field2];
    if (!res[name]) {
      res[name] = {};
    }
    if (!res[name][key]) {
      res[name][key] = {};
    }
    res[name][key] = value instanceof Function ? value(item) : value;
    return res;
  }, {});

  return result;
};

export const genHash = async (password: string) => {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
};

export const compareHash = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export * from './check-type';
export * from './generate-resume';
