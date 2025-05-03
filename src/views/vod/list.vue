<script setup lang="ts">
import { onMounted } from 'vue'
import type { Vod, VodProvider, VodVideo } from '@/api/vod/types.d.ts'
import { reqGetVodList } from '@/api/vod/list.ts'
import { reqGetVodConfig } from '@/api/vod/config.ts'
import { reqGetVodProviders } from '@/api/vod/provider.ts'
import { reqGetVodVideoByName, reqGetVodVideoList } from '@/api/vod/video.ts'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { playTs } from '@/utils/video.js'
import type { VideoPart } from '@/types/video.ts'
import { getM3U8Content, getVideoParts } from '@/utils/m3u8.ts'

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
const currentVodName = ref('')
const currentVideoProvider = ref('')
const showVideoContentDialog = ref(false)
const showVideoPreview = ref(false)
const tsContent = ref('')
const showTsContentDialog = ref(false)
const videoUrl = ref('')
const videoParts = ref<VideoPart[]>([])

onMounted(() => {
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
  result.data.unshift({
    name: '',
    url: '',
    remark: '全部',
  })
  vodProviders.value = result.data
}

const openVideoModal = async (vid: number, flag: string, name: string) => {
  showVideoModal.value = true

  const result = await reqGetVodVideoList(vid, flag)
  videoList.value = result.data
  currentVideoProvider.value = flag
  currentVodName.value = name
}

const onCurrentVideoProviderChange = async (flag: string | number | boolean | undefined) => {
  const result = await reqGetVodVideoByName(currentVodName.value, flag as string)
  videoList.value = result.data
}

const copy = (url: string) => {
  window.navigator.clipboard.writeText(url)
  ElMessage.success('复制成功')
}

const play = (url: string) => {
  videoUrl.value = url
  showVideoPreview.value = true
  nextTick(() => {
    playTs(videoUrl.value)
  })
}

const parseVideoUrl = async (url: string) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  try {
    const { content, realVideoUrl } = await getM3U8Content(url)
    tsContent.value = content

    // const tsUrls: string[] = []
    const host = realVideoUrl.substring(0, realVideoUrl.lastIndexOf('/') + 1)
    /*const tsContent = content.replaceAll(/(.+)\.ts$/gm, (str) => {
      tsUrls.push(host + str)
      return host + str
    })
    if (tsUrls.length) {
      tsUrl.value = tsUrls[0]
    }*/

    videoParts.value = await getVideoParts(content, host)

    // videoContent.value = content
    showVideoContentDialog.value = true
  } catch (err) {
    console.error('解析m3u8文件失败', err)
    ElMessage.error('解析m3u8文件失败')
  } finally {
    loading.close()
  }
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
              <span style="float: left">{{ item.name || '全部' }}</span>
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
            <img :src="row.pic" style="width: 50px; height: 80px" alt="封面" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" prop="name"></el-table-column>
        <el-table-column align="center" label="备注" prop="note" :width="100"></el-table-column>
        <el-table-column align="center" label="采集源" prop="flag" :width="100"></el-table-column>
        <el-table-column align="center" label="更新时间" prop="updateTime"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="openVideoModal(row.vid, row.flag, row.name)"
              >视频
            </el-button>
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

    <el-dialog v-model="showVideoModal" title="视频列表" :width="1000">
      <el-radio-group v-model="currentVideoProvider" @change="onCurrentVideoProviderChange">
        <el-radio-button
          v-for="item in vodProviders.filter((v) => v.name)"
          :key="item.id"
          :label="item.remark || item.name"
          :value="item.name"
        />
      </el-radio-group>

      <el-table :data="videoList" style="margin-top: 10px">
        <el-table-column align="center" label="id" prop="id" :width="80"></el-table-column>
        <el-table-column align="center" label="影片id" prop="vid" :width="80"></el-table-column>
        <el-table-column align="center" label="名称" prop="name" :width="100"></el-table-column>
        <el-table-column align="center" label="采集源" prop="flag" :width="100"></el-table-column>
        <el-table-column align="center" label="播放地址" prop="url" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link type="primary" @click.prevent="parseVideoUrl(row.url)">{{ row.url }}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="copy(row.url)">复制地址</el-button>
            <el-button type="warning" size="small" @click="play(row.url)">播放</el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button type="info" @click="showVideoModal = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog title="视频内容" v-model="showVideoContentDialog" :width="1000">
      <el-table :data="videoParts" :height="500">
        <el-table-column align="center" label="行数" prop="line" :width="70"></el-table-column>
        <el-table-column align="center" label="时间" prop="time" :width="120"></el-table-column>
        <el-table-column align="center" label="DISCONTINUITY" prop="DISCONTINUITY" :width="100">
          <template #default="{ row }">
            <el-tag :type="row.DISCONTINUITY ? 'danger' : 'primary'">
              {{ row.DISCONTINUITY ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="地址" prop="url" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link type="primary" @click.prevent="play(row.url)">{{ row.url }}</el-link>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button type="primary" @click="showTsContentDialog = true">数据</el-button>
        <el-button type="info" @click="showVideoContentDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog title="预览视频" v-model="showVideoPreview">
      <div id="video-wrapper">
        <p>加载视频资源中...</p>
      </div>
      <template #footer>
        <el-button type="info" @click="showVideoPreview = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog title="Ts预览" v-model="showTsContentDialog">
      <el-input type="textarea" v-model="tsContent" :rows="20" :autosize="true">
      </el-input>

      <template #footer>
        <el-button @click="showTsContentDialog = false">关闭</el-button>
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

  ::v-deep(video) {
    width: 100%;
  }
}
</style>
