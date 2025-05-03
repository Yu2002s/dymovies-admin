<script setup lang="ts">
import type { Feedback } from '@/api/content/types'
import { reqGetFeedbacks, reqUpdateFeedback } from '@/api/content/feedback.ts'

defineOptions({
  name: 'FeedBack',
})

const feedbacks = ref<Feedback[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

onMounted(() => {
  getFeedbackList()
})

const getFeedbackList = async () => {
  const result = await reqGetFeedbacks({
    page: page.value,
    pageSize: pageSize.value,
  })
  total.value = result.data.total
  feedbacks.value = result.data.data
}

const onReadChanged = async (row: Feedback) => {
  row.isRead = row.isRead ? 0 : 1
  await reqUpdateFeedback(row)
  ElMessage.success('操作成功')
}
</script>

<template>
  <div style="padding: 10px">
    <el-card>
      <el-button type="primary" @click="getFeedbackList">刷新</el-button>
    </el-card>

    <el-card style="margin-top: 10px">
      <el-table :data="feedbacks">
        <el-table-column align="center" label="ID" prop="id" :width="60"></el-table-column>
        <el-table-column align="center" label="内容" prop="content"></el-table-column>
        <el-table-column
          align="center"
          label="联系方式"
          prop="contact"
          :width="180"
        ></el-table-column>
        <el-table-column align="center" label="是否已读" prop="isRead" :width="200">
          <template #default="{ row }">
            <el-tag :type="row.isRead ? 'success' : 'danger'"
              >{{ row.isRead ? '已读' : '未读' }}
            </el-tag>
            <el-switch
              style="margin-left: 10px"
              :model-value="row.isRead === 1"
              @change="onReadChanged(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createAt"
          :width="180"
        ></el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 20px"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        background
        layout="->, total, sizes, prev, pager, next, jumper"
        :total
        @current-change="getFeedbackList"
        @size-change="getFeedbackList"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss"></style>
