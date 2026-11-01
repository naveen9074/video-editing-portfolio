# Video editor portfolio

Responsive React + Vite portfolio. Videos play on-page in a modal; no backend, upload dashboard, paid API, or runtime service is required.

## Run / build

```sh
npm install
npm run dev
npm run build
```

## Add a project

Project entries live in [`src/data/projects.ts`](./src/data/projects.ts). Duplicate an entry and update:

- `id`, `title`, `category`, and `order` (lower order numbers appear first).
- `poster`: a path under `public/media/posters/`, e.g. `/media/posters/trailer.webp`.
- `video`: a local MP4 path or an embed/direct video URL. Keep empty until the video is ready.
- `sourceType`: `local`, `mp4`, `youtube`, or `vimeo`.
- `aspectRatio`: the actual width divided by height, e.g. `9 / 16`, `4 / 5`, `1`, or `16 / 9`. For a custom ratio use its numeric value, e.g. `1.25`.
- `layout`: editorial gallery placement — `feature`, `portrait`, `wide`, or `square`. This affects gallery position only; `aspectRatio` controls the media frame.
- Optional `description`, `role`, and `featured: true`.

The featured project supplies the hero showreel preview. Choose only one `featured` project.

### Local video

Place an optimized MP4 under `public/media/videos/`, then configure:

```ts
{
  id: 'my-edit',
  title: 'Project title',
  category: 'Short-form',
  poster: '/media/posters/my-edit.webp',
  video: '/media/videos/my-edit.mp4',
  sourceType: 'local',
  aspectRatio: 9 / 16,
  order: 1,
  layout: 'feature',
}
```

Use an `ffprobe` binary if available to check source dimensions:

```sh
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 my-edit.mp4
```

Divide the reported width by height for `aspectRatio`. If ffprobe isn't installed, the field is editable and can be set using the video's export dimensions.

### YouTube / Vimeo

- YouTube: use an embed URL such as `https://www.youtube.com/embed/VIDEO_ID` (public or unlisted; check embed settings).
- Vimeo: use `https://player.vimeo.com/video/VIDEO_ID` and allow embedding in the Vimeo privacy settings.
- Direct MP4: use its direct `.mp4` stream URL with `sourceType: 'mp4'`.

Players are created only after opening a project. Native MP4 playback uses `preload="none"` and the configured poster.

## Portrait and contact

- Add your real photo to `public/media/profile/profile.jpg`, then set `profileImage` in `src/data/projects.ts` to `/media/profile/profile.jpg`. Until then, the site displays an illustrated placeholder.
- Update the `contact` object in `src/data/projects.ts`. Instagram and LinkedIn values should be full profile URLs; WhatsApp should be a number including country code.

The poster illustrations included with the project are placeholders, not actual client work. Replace them with compressed frames from your own edits before publishing. See [`public/media/README.md`](./public/media/README.md) for the asset folders.

## Deploy

Run `npm run build` and deploy the generated `dist/` folder to a static host. Check that external hosts permit embedding and MP4 playback before publishing.
