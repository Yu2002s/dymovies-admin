<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: '0 0 * * * ?',
  },
})

const emit = defineEmits(['update:value', 'change'])

const activeTab = ref('second')
const cronResult = ref(props.value)

// 各项值
const second = ref('0')
const minute = ref('0')
const hour = ref('*')
const day = ref('*')
const month = ref('*')
const week = ref('?')

// 执行时间预览
const nextExecutionTimes = ref<string[]>([])

// 秒、分的可选值
const secondOptions = Array.from({ length: 60 }, (_, i) => i.toString())
const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString())
const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString())
const dayOptions = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
const monthOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
const weekOptions = ['?', '1', '2', '3', '4', '5', '6', '7']
const weekNameOptions = ['?', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

// 提取数字部分
const getNumberPart = (value: string, index: number, defaultValue: number): number => {
  const parts = value.split(/[-\/]/)
  if (parts.length > index) {
    const num = parseInt(parts[index])
    return isNaN(num) ? defaultValue : num
  }
  return defaultValue
}

// 特殊字符
const specialCharOptions = ['*', '?', '-', ',', '/', 'L', 'W', 'C']
const specialCharDesc = {
  '*': '每一个时间',
  '?': '不指定值',
  '-': '范围',
  ',': '枚举多个值',
  '/': '起始值/步长',
  L: '最后一天(day, week)',
  W: '工作日(day)',
  C: '日历计算(day, week)',
}

// 通用选择器模式
const secondType = ref('specific')
const minuteType = ref('specific')
const hourType = ref('specific')
const dayType = ref('specific')
const monthType = ref('specific')
const weekType = ref('specific')

// 解析cron表达式
const parseCron = (cron: string) => {
  try {
    const parts = cron.split(' ')
    if (parts.length !== 6) return false

    second.value = parts[0]
    minute.value = parts[1]
    hour.value = parts[2]
    day.value = parts[3]
    month.value = parts[4]
    week.value = parts[5]

    // 更新选择器类型
    updateTypeFromValue(second.value, secondType)
    updateTypeFromValue(minute.value, minuteType)
    updateTypeFromValue(hour.value, hourType)
    updateTypeFromValue(day.value, dayType)
    updateTypeFromValue(month.value, monthType)
    updateTypeFromValue(week.value, weekType)

    return true
  } catch (e) {
    console.error('Cron表达式解析失败', e)
    return false
  }
}

// 根据值更新选择器类型
const updateTypeFromValue = (value: string, typeRef: Ref<string>) => {
  if (value === '*') {
    typeRef.value = 'every'
  } else if (value.includes('/')) {
    typeRef.value = 'interval'
  } else if (value.includes(',') || value.includes('-')) {
    typeRef.value = 'range'
  } else {
    typeRef.value = 'specific'
  }
}

// 生成cron表达式
const generateCron = () => {
  cronResult.value = `${second.value} ${minute.value} ${hour.value} ${day.value} ${month.value} ${week.value}`
  emit('update:value', cronResult.value)
  calculateNextExecutionTimes()
}

// 计算未来5次执行时间
const calculateNextExecutionTimes = () => {
  nextExecutionTimes.value = []
  try {
    // 解析当前cron表达式
    const cronParts = cronResult.value.split(' ')
    if (cronParts.length !== 6) return

    const currentDate = new Date()
    let nextDate = new Date(currentDate)

    // 未来5次执行时间
    for (let i = 0; i < 5; i++) {
      nextDate = getNextExecutionTime(nextDate, cronParts)
      if (nextDate) {
        nextExecutionTimes.value.push(formatDate(nextDate))
        // 向后推进1秒，计算下一次执行时间
        nextDate.setSeconds(nextDate.getSeconds() + 1)
      }
    }
  } catch (e) {
    console.error('计算执行时间失败', e)
  }
}

// 获取下一次执行时间
const getNextExecutionTime = (startDate: Date, cronParts: string[]): Date => {
  const [secondPart, minutePart, hourPart, dayPart, monthPart, weekPart] = cronParts

  // 简单实现，只处理常见的情况
  const date = new Date(startDate)

  // 检查是否匹配当前时间，如果不匹配，则往后找
  let found = false
  let safeCounter = 1000 // 防止无限循环

  while (!found && safeCounter > 0) {
    safeCounter--

    // 月份检查 (注意JS月份从0开始)
    if (monthPart !== '*') {
      if (!checkCronPart(date.getMonth() + 1, monthPart)) {
        // 移至下个月1日
        date.setMonth(date.getMonth() + 1)
        date.setDate(1)
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        continue
      }
    }

    // 日期和星期检查
    const dayMatches = dayPart === '*' || dayPart === '?' || checkCronPart(date.getDate(), dayPart)
    const weekMatches =
      weekPart === '*' ||
      weekPart === '?' ||
      checkCronPart(date.getDay() === 0 ? 7 : date.getDay(), weekPart)

    if (!(dayMatches || weekMatches)) {
      // 移至下一天
      date.setDate(date.getDate() + 1)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      continue
    }

    // 小时检查
    if (hourPart !== '*') {
      if (!checkCronPart(date.getHours(), hourPart)) {
        // 移至下一小时
        date.setHours(date.getHours() + 1)
        date.setMinutes(0)
        date.setSeconds(0)
        continue
      }
    }

    // 分钟检查
    if (minutePart !== '*') {
      if (!checkCronPart(date.getMinutes(), minutePart)) {
        // 移至下一分钟
        date.setMinutes(date.getMinutes() + 1)
        date.setSeconds(0)
        continue
      }
    }

    // 秒检查
    if (secondPart !== '*') {
      if (!checkCronPart(date.getSeconds(), secondPart)) {
        // 移至下一秒
        date.setSeconds(date.getSeconds() + 1)
        continue
      }
    }

    // 所有条件都满足
    found = true
  }

  return date
}

// 检查值是否匹配cron表达式部分
const checkCronPart = (value: number, cronPart: string): boolean => {
  // 处理通配符
  if (cronPart === '*' || cronPart === '?') return true

  // 处理具体值
  if (!isNaN(Number(cronPart)) && value === Number(cronPart)) return true

  // 处理逗号分隔的多个值
  if (cronPart.includes(',')) {
    const values = cronPart.split(',')
    if (values.some((v) => checkCronPart(value, v))) return true
  }

  // 处理范围
  if (cronPart.includes('-')) {
    const [start, end] = cronPart.split('-').map(Number)
    if (value >= start && value <= end) return true
  }

  // 处理间隔
  if (cronPart.includes('/')) {
    const [start, step] = cronPart.split('/')
    const startVal = start === '*' ? 0 : Number(start)
    if (start === '*' && value % Number(step) === 0) return true
    if ((value - startVal) % Number(step) === 0 && value >= startVal) return true
  }

  return false
}

// 格式化日期
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 监听各项值变化
watch([second, minute, hour, day, month, week], () => {
  generateCron()
})

// 初始化解析
watch(
  () => props.value,
  (newVal) => {
    if (newVal !== cronResult.value) {
      parseCron(newVal)
      calculateNextExecutionTimes()
    }
  },
  { immediate: true },
)

// 不同类型处理函数
const handleTypeChange = (
  type: string,
  valueRef: Ref<string>,
  options: string[],
  defaultValue: string = '*',
) => {
  switch (type) {
    case 'every':
      valueRef.value = '*'
      break
    case 'specific':
      valueRef.value = options[0]
      break
    case 'range':
      valueRef.value = `${options[0]}-${options[1]}`
      break
    case 'interval':
      valueRef.value = `0/${options[1] || 1}`
      break
    default:
      valueRef.value = defaultValue
  }
}

watch(secondType, (val) => handleTypeChange(val, second, secondOptions))
watch(minuteType, (val) => handleTypeChange(val, minute, minuteOptions))
watch(hourType, (val) => handleTypeChange(val, hour, hourOptions))
watch(dayType, (val) => handleTypeChange(val, day, dayOptions, '1'))
watch(monthType, (val) => handleTypeChange(val, month, monthOptions, '1'))
watch(weekType, (val) => handleTypeChange(val, week, weekOptions, '?'))

// 常用示例
const commonExamples = [
  { label: '每秒', value: '* * * * * ?' },
  { label: '每分钟', value: '0 * * * * ?' },
  { label: '每小时', value: '0 0 * * * ?' },
  { label: '每天0点', value: '0 0 0 * * ?' },
  { label: '每月1号0点', value: '0 0 0 1 * ?' },
  { label: '每周一0点', value: '0 0 0 ? * 1' },
]

const useExample = (example: string) => {
  cronResult.value = example
  parseCron(example)
}

// 确认选择
const confirmSelection = () => {
  emit('change', cronResult.value)
}
</script>

<template>
  <div class="cron-editor">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="秒" name="second">
        <div class="tab-content">
          <el-radio-group v-model="secondType">
            <el-radio label="every">每秒</el-radio>
            <el-radio label="specific">
              具体秒数
              <el-select v-if="secondType === 'specific'" v-model="second" size="small">
                <el-option v-for="item in secondOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-radio>
            <el-radio label="interval">
              从
              <el-input-number
                :model-value="getNumberPart(second, 0, 0)"
                :min="0"
                :max="59"
                size="small"
                controls-position="right"
                @update:model-value="(val: number | undefined) => (second = `${val}/${getNumberPart(second, 1, 1)}`)"
              />
              秒开始，每
              <el-input-number
                :model-value="getNumberPart(second, 1, 1)"
                :min="1"
                :max="59"
                size="small"
                controls-position="right"
                @update:model-value="(val: number | undefined) => (second = `${getNumberPart(second, 0, 0)}/${val}`)"
              />
              秒执行一次
            </el-radio>
            <el-radio label="range">
              从
              <el-select
                v-if="secondType === 'range'"
                v-model="second.split('-')[0]"
                size="small"
                @change="
                  second = `${second.split('-')[0]}-${second.split('-')[1] || secondOptions[1]}`
                "
              >
                <el-option v-for="item in secondOptions" :key="item" :label="item" :value="item" />
              </el-select>
              到
              <el-select
                v-if="secondType === 'range'"
                v-model="second.split('-')[1]"
                size="small"
                @change="second = `${second.split('-')[0]}-${second.split('-')[1]}`"
              >
                <el-option v-for="item in secondOptions" :key="item" :label="item" :value="item" />
              </el-select>
              秒
            </el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>

      <el-tab-pane label="分钟" name="minute">
        <div class="tab-content">
          <el-radio-group v-model="minuteType">
            <el-radio label="every">每分钟</el-radio>
            <el-radio label="specific">
              具体分钟
              <el-select v-if="minuteType === 'specific'" v-model="minute" size="small">
                <el-option v-for="item in minuteOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-radio>
            <el-radio label="interval">
              从
              <el-input-number
                :model-value="getNumberPart(minute, 0, 0)"
                :min="0"
                :max="59"
                size="small"
                controls-position="right"
                @update:model-value="(val: number | undefined) => (minute = `${val}/${getNumberPart(minute, 1, 1)}`)"
              />
              分开始，每
              <el-input-number
                :model-value="getNumberPart(minute, 1, 1)"
                :min="1"
                :max="59"
                size="small"
                controls-position="right"
                @update:model-value="(val: number | undefined) => (minute = `${getNumberPart(minute, 0, 0)}/${val}`)"
              />
              分执行一次
            </el-radio>
            <el-radio label="range">
              从
              <el-select
                v-if="minuteType === 'range'"
                v-model="minute.split('-')[0]"
                size="small"
                @change="
                  minute = `${minute.split('-')[0]}-${minute.split('-')[1] || minuteOptions[1]}`
                "
              >
                <el-option v-for="item in minuteOptions" :key="item" :label="item" :value="item" />
              </el-select>
              到
              <el-select
                v-if="minuteType === 'range'"
                v-model="minute.split('-')[1]"
                size="small"
                @change="minute = `${minute.split('-')[0]}-${minute.split('-')[1]}`"
              >
                <el-option v-for="item in minuteOptions" :key="item" :label="item" :value="item" />
              </el-select>
              分
            </el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>

      <el-tab-pane label="小时" name="hour">
        <div class="tab-content">
          <el-radio-group v-model="hourType">
            <el-radio label="every">每小时</el-radio>
            <el-radio label="specific">
              具体小时
              <el-select v-if="hourType === 'specific'" v-model="hour" size="small">
                <el-option v-for="item in hourOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-radio>
            <el-radio label="interval">
              从
              <el-input-number
                :model-value="getNumberPart(hour, 0, 0)"
                :min="0"
                :max="23"
                size="small"
                controls-position="right"
                @update:model-value="(val: number | undefined) => (hour = `${val}/${getNumberPart(hour, 1, 1)}`)"
              />
              时开始，每
              <el-input-number
                :model-value="getNumberPart(hour, 1, 1)"
                :min="1"
                :max="23"
                size="small"
                controls-position="right"
                @update:model-value="(val: number | undefined) => (hour = `${getNumberPart(hour, 0, 0)}/${val}`)"
              />
              小时执行一次
            </el-radio>
            <el-radio label="range">
              从
              <el-select
                v-if="hourType === 'range'"
                v-model="hour.split('-')[0]"
                size="small"
                @change="hour = `${hour.split('-')[0]}-${hour.split('-')[1] || hourOptions[1]}`"
              >
                <el-option v-for="item in hourOptions" :key="item" :label="item" :value="item" />
              </el-select>
              到
              <el-select
                v-if="hourType === 'range'"
                v-model="hour.split('-')[1]"
                size="small"
                @change="hour = `${hour.split('-')[0]}-${hour.split('-')[1]}`"
              >
                <el-option v-for="item in hourOptions" :key="item" :label="item" :value="item" />
              </el-select>
              时
            </el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>

      <el-tab-pane label="日期" name="day">
        <div class="tab-content">
          <el-radio-group v-model="dayType">
            <el-radio label="every">每天</el-radio>
            <el-radio label="specific">
              具体日期
              <el-select v-if="dayType === 'specific'" v-model="day" size="small">
                <el-option v-for="item in dayOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-radio>
            <el-radio label="interval">
              从
              <el-input-number
                :model-value="getNumberPart(day, 0, 1)"
                :min="1"
                :max="31"
                size="small"
                controls-position="right"
                @update:model-value="(val: number | undefined) => (day = `${val}/${getNumberPart(day, 1, 1)}`)"
              />
              日开始，每
              <el-input-number
                :model-value="getNumberPart(day, 1, 1)"
                :min="1"
                :max="31"
                size="small"
                controls-position="right"
                @update:model-value="(val: number | undefined) => (day = `${getNumberPart(day, 0, 1)}/${val}`)"
              />
              天执行一次
            </el-radio>
            <el-radio label="range">
              从
              <el-select
                v-if="dayType === 'range'"
                v-model="day.split('-')[0]"
                size="small"
                @change="day = `${day.split('-')[0]}-${day.split('-')[1] || dayOptions[1]}`"
              >
                <el-option v-for="item in dayOptions" :key="item" :label="item" :value="item" />
              </el-select>
              到
              <el-select
                v-if="dayType === 'range'"
                v-model="day.split('-')[1]"
                size="small"
                @change="day = `${day.split('-')[0]}-${day.split('-')[1]}`"
              >
                <el-option v-for="item in dayOptions" :key="item" :label="item" :value="item" />
              </el-select>
              日
            </el-radio>
            <el-radio label="last">每月最后一天</el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>

      <el-tab-pane label="月份" name="month">
        <div class="tab-content">
          <el-radio-group v-model="monthType">
            <el-radio label="every">每月</el-radio>
            <el-radio label="specific">
              具体月份
              <el-select v-if="monthType === 'specific'" v-model="month" size="small">
                <el-option
                  v-for="item in monthOptions"
                  :key="item"
                  :label="`${item}月`"
                  :value="item"
                />
              </el-select>
            </el-radio>
            <el-radio label="interval">
              从
              <el-input-number
                :model-value="getNumberPart(month, 0, 1)"
                :min="1"
                :max="12"
                size="small"
                controls-position="right"
                @update:model-value="(val: number | undefined) => (month = `${val}/${getNumberPart(month, 1, 1)}`)"
              />
              月开始，每
              <el-input-number
                :model-value="getNumberPart(month, 1, 1)"
                :min="1"
                :max="12"
                size="small"
                controls-position="right"
                @update:model-value="(val: number | undefined) => (month = `${getNumberPart(month, 0, 1)}/${val}`)"
              />
              月执行一次
            </el-radio>
            <el-radio label="range">
              从
              <el-select
                v-if="monthType === 'range'"
                v-model="month.split('-')[0]"
                size="small"
                @change="month = `${month.split('-')[0]}-${month.split('-')[1] || monthOptions[1]}`"
              >
                <el-option
                  v-for="item in monthOptions"
                  :key="item"
                  :label="`${item}月`"
                  :value="item"
                />
              </el-select>
              到
              <el-select
                v-if="monthType === 'range'"
                v-model="month.split('-')[1]"
                size="small"
                @change="month = `${month.split('-')[0]}-${month.split('-')[1]}`"
              >
                <el-option
                  v-for="item in monthOptions"
                  :key="item"
                  :label="`${item}月`"
                  :value="item"
                />
              </el-select>
              月
            </el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>

      <el-tab-pane label="星期" name="week">
        <div class="tab-content">
          <el-radio-group v-model="weekType">
            <el-radio label="every">不指定</el-radio>
            <el-radio label="specific">
              具体星期
              <el-select v-if="weekType === 'specific'" v-model="week" size="small">
                <el-option
                  v-for="(item, i) in weekOptions"
                  :key="item"
                  :label="weekNameOptions[i]"
                  :value="item"
                />
              </el-select>
            </el-radio>
            <el-radio label="range">
              从
              <el-select
                v-if="weekType === 'range'"
                v-model="week.split('-')[0]"
                size="small"
                @change="week = `${week.split('-')[0]}-${week.split('-')[1] || weekOptions[1]}`"
              >
                <el-option
                  v-for="(item, i) in weekOptions.filter((item) => item !== '?')"
                  :key="item"
                  :label="weekNameOptions[i]"
                  :value="item"
                />
              </el-select>
              到
              <el-select
                v-if="weekType === 'range'"
                v-model="week.split('-')[1]"
                size="small"
                @change="week = `${week.split('-')[0]}-${week.split('-')[1]}`"
              >
                <el-option
                  v-for="(item, i) in weekOptions.filter((item) => item !== '?')"
                  :key="item"
                  :label="weekNameOptions[i]"
                  :value="item"
                />
              </el-select>
            </el-radio>
          </el-radio-group>
        </div>
      </el-tab-pane>

      <el-tab-pane label="生成结果" name="result">
        <div class="tab-content">
          <div class="cron-result">
            <el-alert title="Cron表达式：" type="success" :closable="false">
              <template #default>
                <div class="cron-expression">{{ cronResult }}</div>
              </template>
            </el-alert>

            <div class="cron-desc">
              <p>表达式说明：</p>
              <p>* 秒: {{ second }}</p>
              <p>* 分: {{ minute }}</p>
              <p>* 时: {{ hour }}</p>
              <p>* 日: {{ day }}</p>
              <p>* 月: {{ month }}</p>
              <p>* 周: {{ week }}</p>
            </div>

            <div class="next-execution-times" v-if="nextExecutionTimes.length > 0">
              <p>最近5次执行时间预览：</p>
              <el-timeline>
                <el-timeline-item
                  v-for="(time, index) in nextExecutionTimes"
                  :key="index"
                  :timestamp="time"
                  placement="top"
                  type="primary"
                  :hollow="index !== 0"
                >
                  <span>第 {{ index + 1 }} 次执行</span>
                </el-timeline-item>
              </el-timeline>
            </div>

            <div class="common-examples">
              <p>快速示例：</p>
              <el-button
                v-for="(item, i) in commonExamples"
                :key="i"
                size="small"
                type="info"
                plain
                @click="useExample(item.value)"
              >
                {{ item.label }}
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.cron-editor {
  padding: 10px;
}

.tab-content {
  margin-top: 10px;
  padding: 15px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
}

.cron-result {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cron-expression {
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
}

.cron-desc {
  margin-top: 10px;
}

.next-execution-times {
  margin-top: 15px;
  border-top: 1px dashed #eaeaea;
  padding-top: 15px;
}

.common-examples {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 10px;
}

.common-examples .el-button {
  margin-right: 10px;
}
</style>
