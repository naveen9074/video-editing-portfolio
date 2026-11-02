import type { Project } from './projects'

export function mediaUrl(path: string, baseUrl: string) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return `${base}${path.replace(/^\/+/, '')}`
}

export function isGoogleDriveShareUrl(source: string) {
  try {
    const host = new URL(source).hostname.toLowerCase()
    return host === 'drive.google.com' || host === 'docs.google.com'
  } catch {
    return false
  }
}

export function getEmbedUrl(project: Pick<Project, 'sourceType' | 'video'>) {
  try {
    const url = new URL(project.video)
    const host = url.hostname.toLowerCase().replace(/^www\./, '')

    if (project.sourceType === 'youtube') {
      const segments = url.pathname.split('/').filter(Boolean)
      const videoId = host === 'youtu.be'
        ? segments[0]
        : url.searchParams.get('v')
          ?? (['embed', 'shorts', 'live'].includes(segments[0]) ? segments[1] : undefined)
      const validHost = host === 'youtu.be'
        || host === 'youtube.com'
        || host === 'm.youtube.com'
        || host === 'youtube-nocookie.com'

      if (!validHost || !videoId || !/^[\w-]+$/.test(videoId)) return null

      const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`)
      embedUrl.searchParams.set('autoplay', '1')
      embedUrl.searchParams.set('playsinline', '1')
      embedUrl.searchParams.set('rel', '0')
      return embedUrl.toString()
    }

    if (project.sourceType === 'vimeo') {
      const validHost = host === 'vimeo.com' || host === 'player.vimeo.com'
      const segments = url.pathname.split('/').filter(Boolean)
      const videoId = [...segments].reverse().find((segment) => /^\d+$/.test(segment))

      if (!validHost || !videoId) return null

      const embedUrl = new URL(`https://player.vimeo.com/video/${videoId}`)
      const videoIndex = segments.indexOf(videoId)
      const pathHash = segments[videoIndex + 1]
      const privacyHash = url.searchParams.get('h')
        ?? (pathHash && /^[\da-z]{6,}$/i.test(pathHash) ? pathHash : null)
      if (privacyHash) embedUrl.searchParams.set('h', privacyHash)
      embedUrl.searchParams.set('autoplay', '1')
      return embedUrl.toString()
    }
  } catch {
    return null
  }

  return null
}
