import { ElMessage } from 'element-plus';
import Axios from 'axios';
import router from '@/router';

const axios = Axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axios.interceptors.request.use(config => {
  const accessToken = sessionStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

axios.interceptors.response.use(
  result => {
    return result.data;
  },
  error => {
    let msg = '', rPath = '';
    const { response: { data, status } } = error;
    switch(status) {
      case 401:
        msg = '您的登录令牌token已过期，请重新登录';
        rPath = '/login';
        break;
      case 403:
        msg = '您没有对应的操作权限';
        rPath = '/';
        break;
      default:
        msg = data.msg;
        rPath = '/';
    }
    ElMessage.warning(msg);
    router.replace(rPath);
    return Promise.reject(error);
  }
);

export const get = async <T = unknown>(url: string, params = {}) => {
  const result = await axios.get<string, ExpandObject<T>>(url, { params });
  return result;
};

export const post = async <T = unknown>(url: string, data = {}) => {
  const result = await axios.post<string, ExpandObject<T>>(url, data);
  return result;
};

export const put = async <T = unknown>(url: string, data = {}) => {
  const result = await axios.put<string, ExpandObject<T>>(url, data);
  return result;
};

export const patch = async <T = unknown>(url: string, data = {}) => {
  const result = await axios.patch<string, ExpandObject<T>>(url, data);
  return result;
};


export const del = async <T = unknown>(url: string, data = {}) => {
  const result = await axios.delete<string, ExpandObject<T>>(url, data);
  return result;
};