export type BaseResponse<T> = {
  code: number,
  msg: string,
  data: T
}

export type Page<T> = {
  currentPage: number,
  total: number,
  lastPage: number,
  pageSize: number,
  data: T[]
}
