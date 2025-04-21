<script setup lang="ts">
import {
  reqAddVodProvider,
  reqDeleteVodProvider,
  reqGetVodProviders,
  reqUpdateVodProvider
} from "@/api/vod/provider.ts";
import type {VodProvider} from "@/api/vod/types.d.ts";
import type {FormInstance} from "element-plus";

defineOptions({
  name: 'VodProvider'
})

const vodProviders = ref<VodProvider[]>([])
const showModal = ref(false)
const isAddProvider = ref(false)
const vodProvider = ref<VodProvider>({
  name: '',
  url: '',
})
const vodProviderForm = ref<FormInstance>()
const vodProviderFormRules = ref({
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],
  url: [
    {required: true, message: '请输入采集接口', trigger: 'blur'},
  ],
})

onMounted(() => {
  getVodProviders()
})

const openModal = () => {
  vodProvider.value = {
    name: '',
    url: '',
  }
  showModal.value = true
}

const getVodProviders = async () => {
  const result = await reqGetVodProviders()
  vodProviders.value = result.data
}

const editProvider = (row: VodProvider) => {
  Object.assign(vodProvider.value, row)
  isAddProvider.value = false
  showModal.value = true
}

const saveProvider = async () => {
  await vodProviderForm.value?.validate()

  if (isAddProvider.value) {
    await reqAddVodProvider(vodProvider.value)
  } else {
    await reqUpdateVodProvider(vodProvider.value)
  }
  ElMessage.success('操作成功')
  showModal.value = false
  await getVodProviders()
}

const deleteProvider = async (id: number) => {
  await reqDeleteVodProvider(id)
  ElMessage.success('删除成功')
  await getVodProviders()
}

const onWeightChange = async (row: VodProvider) => {
  await reqUpdateVodProvider(row)
  ElMessage.success('操作成功')
  await getVodProviders()
}
</script>

<template>
  <div style="padding: 10px">
    <el-card>
      <el-button type="primary" @click="openModal">添加</el-button>
      <el-button @click="getVodProviders">刷新</el-button>
    </el-card>
    <el-card style="margin-top: 10px">
      <el-table :data="vodProviders">
        <el-table-column label="id" prop="id" width="50"/>
        <el-table-column label="名称" prop="name" width="120"/>
        <el-table-column label="采集接口" prop="url" show-overflow-tooltip/>
<!--        <el-table-column align="center" prop="status" label="状态">
          <template #default="{ row }">
            <el-switch :model-value="row.status === 1" @change="onStatusChange($event, row)" />
          </template>
        </el-table-column>-->
        <el-table-column align="center" prop="weight" :width="100" label="权重">
          <template #default="{ row }">
            <el-input
              type="number"
              v-model="row.weight"
              placeholder="请输入权重"
              @blur="onWeightChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column :width="200" label="备注" prop="remark"/>
        <el-table-column label="操作" width="200">
          <template #default="{row}">
            <el-button type="primary" @click="editProvider(row)">编辑</el-button>
            <el-popconfirm title="确认删除?" @confirm="deleteProvider(row.id)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog width="600" v-model="showModal" :title="isAddProvider ? '新增' : '编辑'">
      <el-form ref="vodProviderForm" label-width="80" label-position="right" :model="vodProvider"
               :rules="vodProviderFormRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="vodProvider.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="接口地址" prop="url">
          <el-input v-model="vodProvider.url" placeholder="请输入采集接口"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="vodProvider.remark" placeholder="请输入备注" type="textarea"/>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showModal = false">关闭</el-button>
        <el-button type="primary" @click="saveProvider">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
