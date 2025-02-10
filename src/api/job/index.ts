import request from "@/utils/request.ts";
import type {BaseResponse} from "@/api/common";
import type {JobClass, SchedulerJob} from "@/api/job/types";

/**
 * 获取 Job 树
 */
export const reqGetJobTree = () => request.get<never, BaseResponse<SchedulerJob[]>>('/admin/jobs')

/**
 * 添加或修改 Job
 * @param data 调度信息
 */
export const reqAddOrUpdateJob = (data: SchedulerJob) =>
  request.post<never, BaseResponse<null>>('/admin/jobs', data)

/**
 * 恢复 Job
 * @param data 调度明细
 */
export const reqResumeJob = (data: SchedulerJob) =>
  request.put<never, BaseResponse<null>>('/admin/jobs/resume', data)

/**
 * 暂停 Job
 * @param data 暂停 Job
 */
export const reqPauseJob = (data: SchedulerJob) =>
  request.put<never, BaseResponse<null>>('/admin/jobs/pause', data)

/**
 * 删除 Job
 * @param data 删除 Job
 */
export const reqDeleteJob = (data: SchedulerJob[]) =>
  request.delete<never, BaseResponse<null>>('/admin/jobs', {data})

/**
 * 获取 Job Class 列表
 */
export const reqGetJobClassList = () =>
  request.get<never, BaseResponse<JobClass[]>>("/admin/jobs/class")

/**
 * 添加 JobClass
 * @param data 具体数据
 */
export const reqAddJobClass = (data: JobClass) =>
  request.post<never, BaseResponse<null>>("/admin/jobs/class", data)

/**
 * 删除 JobClass
 * @param id JobClass ID
 */
export const reqDeleteJobClass = (id: number) =>
  request.delete<never, BaseResponse<null>>(`/admin/jobs/class/${id}`)
