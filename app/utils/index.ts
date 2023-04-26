export const parseTimeString = (time: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) {
    return '';
  }
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const padStart = (str: string | number) => String(str).padStart(2, '0');

  return format.replace('YYYY', String(year)).replace('MM', padStart(month)).replace('DD', padStart(day)).replace('HH', padStart(hour)).replace('mm', padStart(minute)).replace('ss', padStart(second));
}

export const addQiniuUrl = (path: string) => `https://cdn.yangxiang.cc/${path}`