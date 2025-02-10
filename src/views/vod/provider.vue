<script setup lang="ts">
import {reqGetVodProviders} from "@/api/vod/provider.ts";
import type {VodProvider} from "@/api/vod/type";

defineOptions({
  name: 'VodProvider'
})

const vodProviders = ref<VodProvider[]>([])

onMounted(() => {
  getVodProviders()
})

const getVodProviders = async () => {
  const result = await reqGetVodProviders()
  if (result.code === 200) {
    vodProviders.value = result.data
  }
}
</script>

<template>
  <div style="padding: 10px">
    <el-card>
      <el-button type="primary">添加</el-button>
    </el-card>
    <el-card style="margin-top: 10px">
      <el-table :data="vodProviders">
        <el-table-column label="id" prop="id" width="50" />
        <el-table-column label="名称" prop="name" width="120" />
        <el-table-column label="采集接口" prop="url" show-overflow-tooltip />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作" width="200">
          <el-button type="primary">编辑</el-button>
          <el-button type="danger">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss">

</style>
