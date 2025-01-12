import { message } from './plugins/naive-ui'

// 从环境变量获取服务器地址
const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

/**
 * 通用API请求函数
 * @param method 请求方法
 * @param endpoint API端点
 * @param data 请求数据
 * @param headers 自定义请求头
 * @returns Promise<any>
 */
export async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: object,
  headers?: Record<string, string>,
  showSuccessMessage: boolean = false,
): Promise<T> {
  let url = `${serverUrl}${endpoint}`

  // 如果是 GET 请求且有查询参数，构建查询字符串
  if (method === 'GET' && data && 'params' in data) {
    const queryParams = new URLSearchParams(data.params as Record<string, string>).toString()
    url += `?${queryParams}`
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  try {
    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      // 非 GET 请求才需要 body
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = (await response.json()) as {
      success: boolean
      message: string
      message_zh_CN: string
      data: T
    }

    if (!result.success) {
      // message.error(result.message_zh_CN)
      console.error(result.message)
      throw new Error(result.message)
    }

    if (showSuccessMessage && result.success) {
      message.success(result.message_zh_CN)
    }

    return result.data
  } catch (error) {
    // message.error('请求失败，未知错误！')
    console.error('API请求错误:', error)
    throw error
  }
}
