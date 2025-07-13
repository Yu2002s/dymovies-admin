<script setup lang="ts">
import type { BaseResponse } from '@/api/common'
import {
  reqAddOrUpdateJob,
  reqDeleteJob,
  reqGetJobClassList,
  reqGetJobTree,
  reqPauseJob,
  reqResumeJob,
} from '@/api/collect'
import type { JobClass, SchedulerJob } from '@/api/collect/types'
import { reqGetVodProviders } from '@/api/vod/provider.ts'
import type { VodProvider } from '@/api/vod/types.d.ts'
import CronEditor from '@/components/CronEditor.vue'

const jobTree = ref<SchedulerJob[]>([])
const isAddJob = ref(true)
const isShowJobDialog = ref(false)
const jobForm = ref<SchedulerJob>({
  name: '',
  group: '',
  cron: '',
  jobClass: '',
  desc: '',
  url: '',
})
const loading = ref(false)
const showCronDialog = ref(false)
const jobClassList = ref<JobClass[]>([])
const vodProviders = ref<VodProvider[]>([])

defineOptions({
  name: 'JobListView',
})

onMounted(() => {
  getJobTree()
  getJobClassList()
  getVodProviders()
})

const getJobTree = async () => {
  loading.value = true
  try {
    const result = await reqGetJobTree()
    if (result.code === 200) {
      jobTree.value = [...result.data]
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const addJob = () => {
  isAddJob.value = true
  Object.assign(jobForm.value, {
    name: '',
    group: '',
    cron: '',
    jobClass: '',
    desc: '',
    url: '',
  })
  isShowJobDialog.value = true
}

const editJob = (row: SchedulerJob) => {
  isAddJob.value = false
  console.log(row)
  Object.assign(jobForm.value, row)
  isShowJobDialog.value = true
}

const saveJob = async () => {
  console.log(jobForm.value)
  const result = await reqAddOrUpdateJob(jobForm.value)
  if (result.code === 200) {
    ElMessage.success(result.msg)
  } else {
    ElMessage.error(result.msg)
  }
  isShowJobDialog.value = false
  await getJobTree()
}

const changeJobStatus = async (row: SchedulerJob) => {
  let result: null | BaseResponse<null>
  if (row.status === 2 || row.status === 4) {
    result = await reqResumeJob(row)
    row.status = 1
  } else {
    result = await reqPauseJob(row)
    row.status = 2
  }
  if (result && result.code === 200) {
    ElMessage.success({
      message: result.msg,
    })
    await getJobTree()
  } else {
    ElMessage.error({
      message: result.msg,
    })
  }
}

const deleteJob = async (rows: SchedulerJob[]) => {
  const result = await reqDeleteJob(rows)
  if (result.code === 200) {
    ElMessage.success({
      message: result.msg,
    })
    await getJobTree()
  }
}

const getJobClassList = async () => {
  const result = await reqGetJobClassList()
  if (result.code === 200) {
    jobClassList.value = result.data
  }
}

const getVodProviders = async () => {
  const result = await reqGetVodProviders()
  if (result.code === 200) {
    vodProviders.value = result.data
  }
}

const onJobGroupChange = (group: string) => {
  const vodProvider = vodProviders.value.find((item) => item.name === group)
  if (vodProvider) {
    jobForm.value.url = vodProvider.url
  }
  console.log(vodProvider)
}

const changeCron = (val: string) => {
  jobForm.value.cron = val
}

const openCronDialog = () => {
  showCronDialog.value = true
}
</script>

<template>
  <div style="padding: 10px">
    <el-card>
      <el-button type="primary" @click="addJob">新增</el-button>
      <!--          <el-button type="primary" @click="deleteJob(jobTree)">批量删除</el-button>-->
      <el-button type="info" @click="getJobTree">刷新</el-button>
    </el-card>
    <el-card style="margin-top: 10px">
      <el-table
        v-loading="loading"
        :data="jobTree"
        style="width: 100%"
        row-key="key"
        border
        default-expand-all
      >
        <!--        <el-table-column prop="key" label="key" width="120"/>-->
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="group" label="组" width="100" />
        <el-table-column prop="cron" label="Cron表达式" width="120" />
        <el-table-column prop="jobClass" label="JobClass" show-overflow-tooltip />
        <el-table-column prop="desc" label="描述" />
        <el-table-column prop="statusStr" label="状态" width="70" />

        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              size="small"
              v-if="!row.children"
              type="warning"
              @click="changeJobStatus(row)"
              >{{ row.status === 1 ? '暂停' : '启动' }}
            </el-button>
            <el-button size="small" v-if="!row.children" type="primary" @click="editJob(row)"
              >编辑
            </el-button>
            <el-popconfirm title="确认删除?" v-if="!row.children" @confirm="deleteJob([row])">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog width="600" v-model="isShowJobDialog" :title="isAddJob ? '新增' : '编辑'">
      <el-form label-width="80" label-position="right">
        <el-form-item label="名称">
          <el-input v-model="jobForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="组">
          <!--          <el-input v-model="jobForm.group" placeholder="请输入组"/>-->
          <el-select v-model="jobForm.group" placeholder="请选择" @change="onJobGroupChange">
            <el-option
              v-for="item in vodProviders"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
              <span style="float: left">{{ item.remark }}</span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                {{ item.name }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Cron">
          <el-input v-model="jobForm.cron" placeholder="请输入Cron表达式">
            <template #append>
              <el-button @click="openCronDialog">生成</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="JobClass">
          <el-select v-model="jobForm.jobClass" placeholder="请选择">
            <el-option
              v-for="item in jobClassList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
              <span style="float: left">{{ item.remark }}</span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                {{ item.name }}
              </span>
            </el-option>
          </el-select>
          <!--          <el-input v-model="jobForm.jobClass" placeholder="请输入JobClass地址" />-->
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="jobForm.desc" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="采集地址">
          <el-input v-model="jobForm.url" placeholder="请输入采集地址" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="isShowJobDialog = false">关闭</el-button>
        <el-button type="primary" @click="saveJob">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showCronDialog" title="Cron表达式生成器" width="800px">
      <CronEditor :value="jobForm.cron" @change="changeCron" />
      <template #footer>
        <el-button @click="showCronDialog = false">取消</el-button>
        <el-button type="primary" @click="showCronDialog = false">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
