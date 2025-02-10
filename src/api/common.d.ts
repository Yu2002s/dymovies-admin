/**
 * 基础返回类型
 */
export type BaseResponse<T> = {
  code: number,
  msg: string,
  data: T
}

/**
 * Page Response
 */
export type Page<T> = {
  currentPage: number,
  total: number,
  lastPage: number,
  pageSize: number,
  data: T[]
}
