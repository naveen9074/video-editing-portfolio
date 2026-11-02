import assert from 'node:assert/strict'
import test from 'node:test'
import { getEmbedUrl, isGoogleDriveShareUrl, mediaUrl } from '../src/data/media.ts'

test('resolves YouTube watch, share, and embed URLs to privacy-enhanced playback', () => {
  for (const source of [
    'https://youtu.be/Abc_123',
    'https://www.youtube.com/watch?v=Abc_123',
    'https://youtube.com/embed/Abc_123',
    'https://m.youtube.com/shorts/Abc_123',
  ]) {
    assert.equal(
      getEmbedUrl({ sourceType: 'youtube', video: source }),
      'https://www.youtube-nocookie.com/embed/Abc_123?autoplay=1&playsinline=1&rel=0',
    )
  }
})

test('preserves Vimeo unlisted hashes from query and share-path URLs', () => {
  assert.equal(
    getEmbedUrl({ sourceType: 'vimeo', video: 'https://vimeo.com/123456789?h=abc123' }),
    'https://player.vimeo.com/video/123456789?h=abc123&autoplay=1',
  )
  assert.equal(
    getEmbedUrl({ sourceType: 'vimeo', video: 'https://vimeo.com/123456789/abc123' }),
    'https://player.vimeo.com/video/123456789?h=abc123&autoplay=1',
  )
})

test('rejects invalid embed hosts and does not convert other project sources', () => {
  assert.equal(getEmbedUrl({ sourceType: 'youtube', video: 'https://example.com/watch?v=Abc_123' }), null)
  assert.equal(getEmbedUrl({ sourceType: 'vimeo', video: 'https://example.com/123456789' }), null)
  assert.equal(getEmbedUrl({ sourceType: 'mp4', video: 'https://cdn.example.com/edit.mp4' }), null)
  assert.equal(isGoogleDriveShareUrl('https://drive.google.com/file/d/example/view'), true)
  assert.equal(isGoogleDriveShareUrl('https://cdn.example.com/edit.mp4'), false)
})

test('adds the Vite base path only to local public assets', () => {
  assert.equal(mediaUrl('/media/posters/edit.webp', '/video-editing-portfolio/'), '/video-editing-portfolio/media/posters/edit.webp')
  assert.equal(mediaUrl('https://cdn.example.com/edit.mp4', '/video-editing-portfolio/'), 'https://cdn.example.com/edit.mp4')
})
