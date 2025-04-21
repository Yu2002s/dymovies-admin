<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  reqAddVodBanner,
  reqDeleteVodBanner,
  reqGetVodBanners,
  reqUpdateVodBanner
} from '@/api/content/banner'
import type { VodBanner } from '@/api/content/types'
import type { Vod } from '@/api/vod/types'
import { reqGetVodList } from '@/api/vod/list.ts'

defineOptions({
  name: 'BannerList',
})

const bannerList = ref<VodBanner[]>([])
const currentBanner = ref<VodBanner>({
  flag: '',
})
const showModal = ref(false)
const showVodModal = ref(false)
const vodList = ref<Vod[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')
const selectedBannerIds = ref<number[]>([])
const isAddBanner = computed(() => {
  return !currentBanner.value.id
})

onMounted(() => {
  getVodBanners()
})

const getVodBanners = async () => {
  const res = await reqGetVodBanners()
  bannerList.value = res.data
}

const editBanner = (row: VodBanner) => {
  Object.assign(currentBanner.value, row)
  showModal.value = true
}

const saveVodBanner = async (vodBanner: VodBanner) => {
  if (!vodBanner.id) {
    await reqAddVodBanner(vodBanner)
  } else {
    await reqUpdateVodBanner(vodBanner)
  }
  ElMessage.success('操作成功')
  showModal.value = false
  await getVodBanners()
}

const addVodBanner = () => {
  currentBanner.value = {
    flag: '',
  }
  showModal.value = true
}

const openVodModal = async () => {
  await resetVodSearch()
  showVodModal.value = true
}

const getVodList = async () => {
  const result = await reqGetVodList({
    page: page.value,
    pageSize: pageSize.value,
    keyword: keyword.value,
  })

  total.value = result.data.total
  vodList.value = result.data.data
}

const selectVod = (row: Vod) => {
  currentBanner.value.vid = row.vid
  currentBanner.value.name = row.name
  currentBanner.value.pic = row.pic
  currentBanner.value.flag = row.flag
  currentBanner.value.note = row.note
  showVodModal.value = false
}

const resetVodSearch = async () => {
  keyword.value = ''
  page.value = 1
  pageSize.value = 10
  await getVodList()
}

const onStatusChange = (val: number | string | boolean, row: VodBanner) => {
  row.status = val ? 1 : 0
  saveVodBanner(row)
}

const onWeightChange = (row: VodBanner) => {
  saveVodBanner(row)
}

const deleteBanner = async (id: number) => {
  await reqDeleteVodBanner([id])
  ElMessage.success('删除成功')
  await getVodBanners()
}

const deleteBanners = async () => {
  if (!selectedBannerIds.value.length) {
    return ElMessage.info('请选择要删除的Banner')
  }
  await reqDeleteVodBanner(selectedBannerIds.value)
  ElMessage.success('删除成功')
  await getVodBanners()
}

const onSelectionChange = (val: VodBanner[]) => {
  selectedBannerIds.value = val.map((item) => item.id!)
}
</script>

<template>
  <div style="padding: 10px">
    <el-card>
      <el-button type="primary" @click="addVodBanner">新增</el-button>
      <el-button type="danger" @click="deleteBanners">删除所选</el-button>
      <el-button type="info" @click="getVodBanners">重置</el-button>
    </el-card>

    <el-card style="margin-top: 10px">
      <el-table :data="bannerList" @selectionChange="onSelectionChange">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" label="ID" prop="id" :width="50"></el-table-column>
        <el-table-column align="center" label="影片id" prop="vid" :width="100"></el-table-column>
        <el-table-column align="center" label="图片" prop="pic" :width="120">
          <template #default="scope">
            <el-image
              style="width: 80px"
              :z-index="999"
              preview-teleported
              :src="scope.row.pic"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="bannerList.map((item) => item.pic!)"
              show-progress
              :initial-index="4"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" prop="name"></el-table-column>
        <el-table-column align="center" label="来源" prop="flag" :width="120"></el-table-column>
        <el-table-column align="center" label="备注" prop="note"></el-table-column>
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
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editBanner(scope.row)">编辑</el-button>
            <el-popconfirm @confirm="deleteBanner(scope.row.id)" title="是否删除该Banner">
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :width="500" v-model="showModal" :title="isAddBanner ? '添加Banner' : '更新Banner'">
      <el-form :model="currentBanner" :label-width="80" label-position="left">
        <el-form-item label="影片ID" prop="vid">
          <el-input v-model="currentBanner.vid" placeholder="影片id">
            <template #append>
              <el-button type="primary" @click="openVodModal">去选择</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="来源" prop="flag">
          <el-input v-model="currentBanner.flag" placeholder="来源"></el-input>
        </el-form-item>
        <template v-if="currentBanner.name">
          <el-form-item label="影片名称">
            <el-input v-model="currentBanner.name" placeholder="影片名称"></el-input>
          </el-form-item>
          <el-form-item prop="pic" label="影片封面">
            <el-image :src="currentBanner.pic" style="width: 100px" />
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="currentBanner.note" placeholder="备注"></el-input>
          </el-form-item>
        </template>
      </el-form>

      <template #footer>
        <el-button @click="showModal = false">取消</el-button>
        <el-button type="primary" @click="saveVodBanner(currentBanner)">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showVodModal" title="选择影片" :width="1000">
      <el-form inline>
        <el-form-item label="影片名称">
          <el-input
            v-model="keyword"
            placeholder="输入影片名称搜索"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getVodList">搜索</el-button>
          <el-button type="info" @click="resetVodSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="vodList" highlight-current-row show-overflow-tooltip>
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
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="selectVod(row)">选择</el-button>
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
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
