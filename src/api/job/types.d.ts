/**
 * 调度工作
 */
export type SchedulerJob = {
  id?: number
  status?: number
  statusStr?: string
  key?: string
  name: string
  group: string
  cron: string
  jobClass: string
  desc: string
  url: string
  children?: SchedulerJob[]
}

/**
 * 工作类
 */
export type JobClass = {
  id?: number
  name: string
  remark: string
}
