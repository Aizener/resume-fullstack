type ResponseType = {
  code: number;
  data: any;
  err: null | string;
  msg: null | string;
  total?: number;
};

const useCommonFetch = async (
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  data: any,
  options?: {
    responseType: 'json' | 'arrayBuffer' | 'blob' | 'text' | 'stream'
  }
): Promise<ResponseType> => {
  const _data: Record<string, any> = method === 'GET' ? { query: data } : { body: data };
  console.log(options?.responseType)
  const res = await useFetch(path, {
    method,
    ..._data,
    responseType: options?.responseType || 'json',
    onRequest({ request, options }: any) {
      options.headers = options.headers || {};
      const token = localStorage.getItem('accessToken');
      if (token) {
        options.headers.authorization = `Bearer ${token}`;
      }
    },
  });
  if (res.error.value) {
    const { data }: any = res.error.value;
    ElMessage.warning(data.msg || data.message);
    return Promise.reject(data);
  }
  return res.data.value as ResponseType;
};

const useGetFetch = async (path: string, data?: any, options?: any): Promise<ResponseType> =>
  useCommonFetch('GET', path, data, options);
const usePostFetch = async (path: string, data?: any, options?: any): Promise<ResponseType> =>
  useCommonFetch('POST', path, data, options);
const usePatchFetch = async (path: string, data?: any, options?: any): Promise<ResponseType> =>
  useCommonFetch('PATCH', path, data, options);
const useDeleteFetch = async (path: string, data?: any, options?: any): Promise<ResponseType> =>
  useCommonFetch('DELETE', path, data, options);

export const registerUser = async (username: string, password: string) => {
  return usePostFetch('/api/auth/register', { username, password });
};

export const login = async (username: string, password: string) => {
  return usePostFetch('/api/auth/login', { username, password });
};

export const generateResume = async (id: number) => {
  return usePostFetch(`/api/resume/generate/${id}`);
};

export const createResume = async (data: Record<string, any>) => {
  return usePostFetch('/api/resume', data);
};

export const updateResume = async (id: number, data: Record<string, any>) => {
  return usePatchFetch(`/api/resume/${id}`, data);
};

export const getResumeById = async (id: number) => {
  return useGetFetch(`/api/resume/${id}`);
};

export const getTemplateTypes = async () => {
  return useGetFetch(`/api/template-type/`);
};

export const getTemplates = async (data: Record<string, any>) => {
  return useGetFetch(`/api/template/`, data);
};

export const getDefaultTemplate = async () => {
  return useGetFetch('/api/template/default');
}

export const getMyTemplates = async () => {
  return useGetFetch('/api/resume/personal');
};

export const downloadTemplate = async (id: number) => {
  return usePostFetch(`/api/template/download/${id}`);
};

export const getToken = async () => {
  return useGetFetch('/api/qiniu/token/');
};

export const uploadFile = async (formData: FormData) => {
  return usePostFetch('/api/qiniu/upload/', formData);
};

export const generatePDF = async (id: number) => {
  return usePostFetch(`/api/resume/generate/pdf/${id}`, null, { responseType: 'blob' });
}