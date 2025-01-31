import request from "@/utils/request.ts";
import type {BaseResponse} from "@/api/common";
import type {JobClass, SchedulerJob} from "@/api/job/types";

export const reqGetJobTree = () => request.get<never, BaseResponse<SchedulerJob[]>>('/admin/jobs')

export const reqAddOrUpdateJob = (data: SchedulerJob) => request.post<never, BaseResponse<null>>('/admin/jobs', data)

export const reqResumeJob = (data: SchedulerJob) => request.put<never, BaseResponse<null>>('/admin/jobs/resume', data)

export const reqPauseJob = (data: SchedulerJob) => request.put<never, BaseResponse<null>>('/admin/jobs/pause', data)

export const reqDeleteJob = (data: SchedulerJob[]) => request.delete<never, BaseResponse<null>>('/admin/jobs', {data})

export const reqGetJobClassList = () => request.get<never, BaseResponse<JobClass[]>>("/admin/jobs/class")
