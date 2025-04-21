<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { reqGetVodParentTypes, reqGetVodTypes, reqUpdateVodType } from '@/api/vod/type.ts'
import type { VodProvider, VodType } from '@/api/vod/types'
import { reqGetVodConfig } from '@/api/vod/config.ts'
import { reqGetVodProviders } from '@/api/vod/provider.ts'

defineOptions({
  name: 'VodType',
})

const vodTypeList = ref<VodType[]>([])
// const allVodTypeList = ref<VodType[]>([])
const vodParentTypeList = ref<VodType[]>([])
const vodProviders = ref<VodProvider[]>([])
const currentVodProvider = ref<string>('')
const currentVodType = ref<VodType>({
  name: '',
  flag: '',
})
const showModal = ref<boolean>(false)

const isAddVodType = computed(() => {
  return !currentVodType.value.id
})

onMounted(() => {
  getData()
})

const getData = async () => {
  await getVodConfig()
  await getVodProviders()
  await getVodTypeList()
}

const getVodConfig = async () => {
  const result = await reqGetVodConfig()
  currentVodProvider.value = result.data
}

const getVodProviders = async () => {
  const result = await reqGetVodProviders()
  vodProviders.value = result.data
}

const getVodTypeList = async () => {
  const result = await reqGetVodTypes(currentVodProvider.value)
  vodTypeList.value = result.data
}

const onStatusChange = (val: boolean | string | number, row: VodType) => {
  row.status = val ? 1 : 0
  updateVodType(row)
}

const onWeightChange = (row: VodType) => {
  updateVodType(row)
}

const updateVodType = async (row: VodType) => {
  const result = await reqUpdateVodType(row)
  ElMessage.success(result.msg)
  await getVodTypeList()
}

const editVodType = async (row: VodType) => {
  Object.assign(currentVodType.value, row)
  await onVodFlagChange()
  showModal.value = true
}

const addVodType = async (row: VodType | null = null) => {
  if (row) {
    Object.assign(currentVodType.value, row)
  } else {
    currentVodType.value = {
      name: '',
      flag: currentVodProvider.value,
    }
  }
  await onVodFlagChange()
  showModal.value = true
}

const onVodFlagChange = async () => {
  const result = await reqGetVodParentTypes(currentVodType.value.flag)
  vodParentTypeList.value = result.data.filter((item) => item.name !== currentVodType.value.name)
}

const saveVodType = () => {
  updateVodType(currentVodType.value)
  showModal.value = false
}
</script>

<template>
  <div style="padding: 10px">
    <el-card>
      <el-form :inline="true" label-width="80px">
        <el-form-item label="采集源">
          <el-select v-model="currentVodProvider" placeholder="请选择影片源" style="width: 250px">
            <el-option
              v-for="item in vodProviders"
              :key="item.id"
              :value="item.name"
              :label="item.remark"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                {{ item.remark }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getVodTypeList">查询</el-button>
          <el-button type="warning" @click="addVodType(null)">新增</el-button>
          <el-button type="info" @click="getData">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 10px">
      <el-table :data="vodTypeList" :row-key="(row) => row.flag + row.id" border>
        <el-table-column align="center" prop="id" label="ID"></el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" prop="flag" label="采集源"></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template #default="{ row }">
            <el-switch :model-value="row.status === 1" @change="onStatusChange($event, row)" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="weight" label="权重">
          <template #default="{ row }">
            <el-input
              type="number"
              v-model="row.weight"
              placeholder="请输入权重"
              @blur="onWeightChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="warning" size="small" v-if="row.pid == null" @click="addVodType(row)">
              新增
            </el-button>
            <el-button type="primary" size="small" @click="editVodType(row)">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showModal" :title="isAddVodType ? '添加类型' : '更新类型'" :width="500">
      <el-form :model="currentVodType" label-width="100">
        <el-form-item label="采集源" prop="flag" required>
          <el-select
            v-model="currentVodType.flag"
            placeholder="请选择采集源"
            @change="onVodFlagChange"
            filterable
            clearable
          >
            <el-option
              v-for="item in vodProviders"
              :key="item.id"
              :label="item.remark || item.name"
              :value="item.name"
            >
              <span style="float: left">{{ item.remark }}</span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                {{ item.name }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父类型" prop="pid">
          <el-select placeholder="请选择父类型" v-model="currentVodType.pid" filterable clearable>
            <el-option label="根类型" value=""></el-option>
            <el-option
              :key="item.id"
              v-for="item in vodParentTypeList"
              :label="item.name"
              :value="item.id!"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                {{ item.flag }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型名称" prop="name" required>
          <el-input v-model="currentVodType.name" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="currentVodType.weight" type="number" placeholder="请输入权重" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showModal = false">取消</el-button>
        <el-button type="primary" @click="saveVodType">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.el-card ::v-deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
