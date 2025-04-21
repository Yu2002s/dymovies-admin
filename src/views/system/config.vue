<script setup lang="ts">
import type { VodProvider } from '@/api/vod/types.d.ts'
import { reqGetVodProviders } from '@/api/vod/provider.ts'
import {reqGetVodConfig, reqUpdateVodConfig} from "@/api/vod/config.ts";

defineOptions({
  name: 'SystemConfig',
})

const vodProviders = ref<VodProvider[]>([])
const currentVodProvider = ref<string>('')

onMounted(async () => {
  await getVodProviders()
  await getVodConfig()
})

const getVodConfig = async () => {
  const result = await reqGetVodConfig()
  currentVodProvider.value = result.data
}

const getVodProviders = async () => {
  const result = await reqGetVodProviders()
  vodProviders.value = result.data
}

const onVodProviderChange = async (flag: string) => {
  await reqUpdateVodConfig(flag)
  ElMessage.success("更新配置成功")
  await getVodConfig()
}
</script>

<template>
  <div style="padding: 10px">
    <el-card>
      <h3 style="margin-bottom: 30px">系统配置</h3>
      <el-form :label-width="80" inline>
        <el-form-item label="影片源">
          <el-select @change="onVodProviderChange" v-model="currentVodProvider" placeholder="请选择影片源" style="width: 250px">
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
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss"></style>
