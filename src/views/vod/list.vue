<script setup lang="ts">
import { onMounted } from 'vue'
import type {Vod, VodProvider, VodVideo} from '@/api/vod/types.d.ts'
import { reqGetVodList } from '@/api/vod/list.ts'
import { reqGetVodConfig } from '@/api/vod/config.ts'
import { reqGetVodProviders } from '@/api/vod/provider.ts'
import {reqGetVodVideoList} from "@/api/vod/video.ts";

defineOptions({
  name: 'VodList',
})

const vodList = ref<Vod[]>([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const keyword = ref('')
const vodProviders = ref<VodProvider[]>([])
const currentVodProvider = ref<string>('')
const loading = ref(false)
const showVideoModal = ref(false)
const videoList = ref<VodVideo[]>([])

onMounted( () => {
  getData()
})

const getData = async () => {
    await getVodConfig()
    await getVodProviders()
    await getVodList()
}

const reset = () => {
  page.value = 1
  pageSize.value = 20
  keyword.value = ''
  getData()
}

const getVodList = async () => {
  loading.value = true
  try {
    const result = await reqGetVodList({
      page: page.value,
      pageSize: pageSize.value,
      flag: currentVodProvider.value,
      keyword: keyword.value,
    })

    vodList.value = result.data.data
    page.value = result.data.currentPage
    pageSize.value = result.data.pageSize
    total.value = result.data.total
  } finally {
    loading.value = false
  }
}

const getVodConfig = async () => {
  const result = await reqGetVodConfig()
  currentVodProvider.value = result.data
}

const getVodProviders = async () => {
  const result = await reqGetVodProviders()
  vodProviders.value = result.data
}

const openVideoModal = async (vid: number, flag: string) => {
  showVideoModal.value = true

  const result = await reqGetVodVideoList(vid, flag)
  videoList.value = result.data
}
</script>

<template>
  <div class="vod-container" style="padding: 10px">
    <el-card>
      <el-form inline>
        <el-form-item label="影片名称">
          <el-input placeholder="请输入影片名称" v-model="keyword" style="width: 250px" clearable />
        </el-form-item>
        <el-form-item label="采集来源">
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
          <el-button type="primary" @click="getVodList">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="card-container" style="margin-top: 10px; flex: 1">
      <el-table :data="vodList" highlight-current-row show-overflow-tooltip v-loading="loading">
        <el-table-column fixed align="center" label="#" type="index"></el-table-column>
        <el-table-column align="center" label="id" prop="id" :width="100"></el-table-column>
        <el-table-column align="center" label="影片id" prop="vid" :width="100"></el-table-column>
        <el-table-column align="center" label="封面" prop="pic" :width="100">
          <template #default="{ row }">
            <img :src="row.pic" style="width: 50px; height: 80px"  alt="封面"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" prop="name"></el-table-column>
        <el-table-column align="center" label="备注" prop="note" :width="100"></el-table-column>
        <el-table-column align="center" label="采集源" prop="flag" :width="100"></el-table-column>
        <el-table-column align="center" label="更新时间" prop="updateTime"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template #default="{row}">
            <el-button type="primary" size="small" @click="openVideoModal(row.vid, row.flag)">视频</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40, 60, 80, 100, 200, 400, 800, 1000]"
        background
        layout="->, total, sizes, prev, pager, next, jumper"
        :total
        @current-change="getVodList"
        @size-change="getVodList"
      />
    </el-card>

    <el-dialog v-model="showVideoModal" title="视频列表">
      <el-table :data="videoList">
        <el-table-column align="center" label="id" prop="id" :width="80"></el-table-column>
        <el-table-column align="center" label="影片id" prop="vid" :width="80"></el-table-column>
        <el-table-column align="center" label="名称" prop="name" :width="100"></el-table-column>
        <el-table-column align="center" label="采集源" prop="flag" :width="100"></el-table-column>
        <el-table-column align="center" label="播放地址" prop="url"></el-table-column>
      </el-table>

      <template #footer>
        <el-button type="info" @click="showVideoModal = false">关闭</el-button>
      </template>

    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.vod-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  ::v-deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 0;
  }
}
</style>
