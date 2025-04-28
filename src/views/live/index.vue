<script setup lang="ts">
import { onMounted } from 'vue'
import {reqDeleteTvLive, reqGetTvLiveList, reqUpdateTvLive} from '@/api/live'
import type { TvLive } from '@/api/live/types'

defineOptions({
  name: 'LiveView',
})

const tvLiveList = ref<TvLive[]>([])
const tvLiveForm = ref<TvLive>({
  name: '',
  url: '',
})
const showEditDialog = ref(false)

onMounted(() => {
  getTvLiveList()
})

const getTvLiveList = async () => {
  const result = await reqGetTvLiveList()
  tvLiveList.value = result.data
}

const onStatusChange = async (status: boolean | string | number, row: TvLive) => {
  row.status = status ? 1 : 0
  await reqUpdateTvLive(row)
  await getTvLiveList()
  ElMessage.success('修改成功')
}

const onWeightChange = async (row: TvLive) => {
  await reqUpdateTvLive(row)
  await getTvLiveList()
  ElMessage.success('修改成功')
}

const edit = async (row: TvLive) => {
  Object.assign(tvLiveForm.value, row)
  showEditDialog.value = true
}

const saveTvLive = async () => {
  await reqUpdateTvLive(tvLiveForm.value)
  ElMessage.success('修改成功')
  await getTvLiveList()
  showEditDialog.value = false
}

const addTvLive = () => {
  tvLiveForm.value = {
    name: '',
    url: '',
  }
  showEditDialog.value = true
}

const deleteTvLive = async (id: number) => {
  await reqDeleteTvLive(id)
  ElMessage.success('删除成功')
  await getTvLiveList()
}
</script>

<template>
  <div style="padding: 10px">

    <el-card>
      <el-button @click="addTvLive" type="primary">新增</el-button>
      <el-button type="danger">删除所选</el-button>
      <el-button @click="getTvLiveList" type="info">刷新</el-button>
    </el-card>

    <el-card style="margin-top: 10px">
      <el-table :data="tvLiveList">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" label="ID" prop="id" :width="50"></el-table-column>
        <el-table-column align="center" label="直播名称" prop="name" :width="200"></el-table-column>
        <el-table-column align="center" label="直播地址">
          <template #default="scope">
            <el-link :href="scope.row.url" target="_blank" type="primary"
              >{{ scope.row.url }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="status" :width="150">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '开启' : '关闭' }}
            </el-tag>
            <el-switch
              style="margin-left: 10px"
              :model-value="scope.row.status === 1"
              @change="onStatusChange($event, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="weight" label="权重" :width="100">
          <template #default="{ row }">
            <el-input
              type="number"
              v-model="row.weight"
              placeholder="请输入权重"
              @blur="onWeightChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" :width="200">
          <template #default="scope">
            <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="是否删除" @confirm="deleteTvLive(scope.row.id)">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showEditDialog">
      <el-form>
        <el-form-item label="直播名称">
          <el-input v-model="tvLiveForm.name" placeholder="请输入直播名称" />
        </el-form-item>
        <el-form-item label="直播地址">
          <el-input v-model="tvLiveForm.url" placeholder="请输入直播地址" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="saveTvLive">提交</el-button>
        <el-button @click="showEditDialog = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
