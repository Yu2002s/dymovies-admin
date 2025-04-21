<script setup lang="ts">
import {reqAddJobClass, reqDeleteJobClass, reqGetJobClassList} from "../../api/collect";
import type {JobClass} from "@/api/collect/types";
import {ElMessage, type FormInstance} from "element-plus";

const classForm = ref<JobClass>({
  name: '',
  remark: ''
})
const isShowModal = ref(false)
const form = ref<FormInstance | null>(null)
const loading = ref(false)

defineOptions({
  name: 'JobClassView'
})

const jobClassList = ref<JobClass[]>([])

onMounted(() => {
  getJobClassList()
})

const getJobClassList = async () => {
  const result = await reqGetJobClassList()
  if (result.code === 200) {
    jobClassList.value = result.data
  }
}

const saveJobClass = async () => {
  loading.value = true
  try {
    const result = await reqAddJobClass(classForm.value)
    if (result.code === 200) {
      ElMessage.success({message: '添加成功'})
      isShowModal.value = false
      await getJobClassList()
    } else {
      ElMessage.error({message: result.msg})
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  classForm.value.id = undefined
  form.value?.resetFields()
}

const handleAddJob = () => {
  resetForm()
  isShowModal.value = true
}

const editJobClass = (jobClass: JobClass) => {
  classForm.value = JSON.parse(JSON.stringify(jobClass))
  isShowModal.value = true
}

const deleteJobClass = async (id: number) => {
  const result = await reqDeleteJobClass(id)
  if (result.code === 200) {
    ElMessage.success({message: '删除成功'})
    await getJobClassList()
  } else {
    ElMessage.error({message: result.msg})
  }
}
</script>

<template>
  <div style="padding: 10px">
    <el-card>
      <el-button type="primary" @click="handleAddJob">添加</el-button>
    </el-card>
    <el-card style="margin-top: 10px">
      <el-table :data="jobClassList" v-loading="loading">
        <el-table-column label="id" prop="id" width="40"/>
        <el-table-column label="名称" prop="name"/>
        <el-table-column label="备注" prop="remark"/>
        <el-table-column label="操作" width="200">
          <template #default="{row}">
            <el-button type="primary" @click="editJobClass(row)">编辑</el-button>
            <el-button type="danger" @click="deleteJobClass(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="isShowModal" :title="classForm.id ? '编辑' : '新增'">
      <el-form ref="form" :model="classForm">
        <el-form-item label="类名" prop="name">
          <el-input v-model="classForm.name" placeholder="请输入全类名路径" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="classForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="saveJobClass">保存</el-button>
        <el-button @click="isShowModal = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
