const toString = (type: any) => Object.prototype.toString.call(type);
export const isArray = (type: any) => toString(type).includes('Array');
