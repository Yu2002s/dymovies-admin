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

export type JobClass = {
  id: number
  name: string
  remark: string
}
