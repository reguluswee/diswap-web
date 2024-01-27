import { MD5SHA512 } from '../utils/md5'

interface RequestOptions {
    method: string;
    headers?: { [key: string]: string };
    params?: { [key: string]: any };
}

const getApiBaseUrl = () => {
    // 检查当前环境变量，根据需要返回不同的API_BASE_URL
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3001'; // 开发环境的API_BASE_URL
    } else {
        return 'https://eli-api.fenus.xyz'; // 生产环境的API_BASE_URL
    }
};

const generateHeaders = (params: { [key: string]: any }): { [key: string]: string } => {
    const timestamp = new Date().getTime().toString();
    const unsortedData: any = {
        'ts': timestamp,
        ...params,
    };
    
    const sign = MD5SHA512(unsortedData);
    return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'ts': timestamp,
        'sign': sign,
    };
};

export const request = async (url: string, options: RequestOptions) => {
    const apiUrl = getApiBaseUrl() + url;

    // 将查询参数拼接到URL
    // const queryString = options.params
    //     ? `?${Object.entries(options.params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`
    //     : '';

    const fullUrl = apiUrl;
    const { method, headers } = options;

    const requestOptions: RequestInit = {
        method,
        headers: {
            ...(headers || {}),
            ...generateHeaders(options.params || {}),
        },
    };

    // 如果是POST请求，需要设置请求体
    if (method === 'POST' && options.params) {
        // 判断Content-Type是否为application/x-www-form-urlencoded
        if (headers && headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            requestOptions.body = new URLSearchParams(options.params).toString();
        } else {
            requestOptions.body = JSON.stringify(options.params);
        }
    }

    const response = await fetch(fullUrl, requestOptions);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
};

export const getExampleData = async (params: { [key: string]: any }) => {
    const url = '/example-endpoint'; // 替换为实际的API端点
    const options: RequestOptions = {
      method: 'GET',
      params,
    };
  
    return request(url, options);
};

export const getMakerProof = async (params: { [key: string]: any }) => {
    const url = '/api/v1/dis/get_maker_proof'; // 替换为实际的API端点
    const options: RequestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
    };

    return request(url, options);
};

export const checkWhite = async (params: { [key: string]: any }) => {
    const url = '/api/v1/dis/check_white'; // 替换为实际的API端点
    const options: RequestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
    };

    return request(url, options);
};
