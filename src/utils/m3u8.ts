import type { VideoPart } from '@/types/video.ts'

export const getM3U8Content = async (
  url: string,
): Promise<{
  content: string
  realVideoUrl: string
}> => {
  let realVideoUrl = url
  const content = await fetch(url)
    .then((res) => res.text())
    .then(async (res) => {
      const lines = res.split('\n')
      let content = res
      if (lines.length < 6) {
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('#EXT-X-STREAM-INF')) {
            // 这是一个多码率的文件
            realVideoUrl = lines[i + 1]
            if (!realVideoUrl.startsWith('http')) {
              const host = url.substring(0, url.lastIndexOf('/') + 1)
              realVideoUrl = host + realVideoUrl
            }
            break
          }
        }
        if (realVideoUrl) {
          content = await fetch(realVideoUrl).then((res) => res.text())
        }
      } else {
        // 普通的m3u8地址
      }
      return content
    })
  return {
    content,
    realVideoUrl,
  }
}

export const getVideoParts: (content: string, host?: string) => Promise<VideoPart[]> = async (
  content: string,
  host: string = '',
) => {
  const lines = content.split('\n')
  const videoParts: VideoPart[] = []

  const extInfReg = /#EXTINF:(\d+\.\d+),/gm
  const videoPart: VideoPart = {
    line: 0,
    url: '',
    time: '',
    DISCONTINUITY: false,
  }
  let second = 0
  for (let i = 0; i < lines.length; i++) {
    videoPart.line = i
    if (lines[i].startsWith('#EXTINF')) {
      const result = extInfReg.exec(lines[i])
      if (result == null || !result.length) {
        continue
      }
      const time = Number(result[1])
      second += time
      let minutes: string | number = Math.floor(second / 60)
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      let seconds: string | number = Math.floor(second % 60)
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      videoPart.time = minutes + ':' + seconds
    } else if (lines[i].startsWith('#EXT-X-DIS')) {
      videoPart.DISCONTINUITY = !videoPart.DISCONTINUITY;
    } else if (lines[i].endsWith('.ts')) {
      videoPart.url = lines[i]
      if (!videoPart.url.startsWith('http')) {
        videoPart.url = host + videoPart.url
      }
      videoParts.push(structuredClone(videoPart))
    }
  }

  return videoParts
}
