# Naveen — Video Editor & Motion Designer

A responsive React, TypeScript, and Vite portfolio with a Liquid Glass visual system. Project filters, variable-aspect-ratio previews, lazy video playback, and a keyboard-accessible player are built in. There is no backend, upload dashboard, paid API, or animation-library dependency.

The gallery uses the official React Bits GlareHover source for a subtle cursor reflection; its source and license notice are in [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

## Run locally

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
npm run preview
```

## Configure your identity

Update the `portfolio` object in [`src/data/projects.ts`](./src/data/projects.ts):

- `displayName`, `studioIdentity`, and `professionalTitle` update the portfolio identity.
- `shortIntroduction` and `biography` hold your editable introduction and about text.
- `profileImage` points to your real portrait; add it under `public/media/profile/`, for example `'/media/profile/naveen.webp'`. No portrait is included by default.
- `contact.email`, `contact.whatsapp`, `contact.instagram`, and `contact.linkedin` are intentionally blank until you add your own details. Use full profile URLs for Instagram and LinkedIn, and a WhatsApp number with its country code.
- `showreelProjectId` selects a project from the project list for the hero preview.

## Add a project

Projects are configured in `src/data/projects.ts`; adding or reordering a project does not require editing a React component. Duplicate an entry and set:

- `id`, `title`, `category`, and `order` (lower numbers appear first).
- `poster`: a lightweight thumbnail under `public/media/posters/`, such as `'/media/posters/launch.webp'`.
- `video`: a YouTube/Vimeo video URL, direct MP4 URL, or local file path.
- `sourceType`: `'youtube'`, `'vimeo'`, `'mp4'` (direct stream), or `'local'`.
- `aspectRatio`: width divided by height, such as `9 / 16`, `4 / 5`, `1`, or `16 / 9`; custom numeric ratios are supported.
- `layout`: `'feature'`, `'wide'`, `'portrait'`, or `'square'` controls gallery placement. The configured aspect ratio controls the media frame, so footage is not stretched to fit the layout.
- Optional `description`, `role`, and `featured`.

The included poster artwork and project titles are placeholders, not real client work. Replace them with your own compressed thumbnails and project details. If you add a category not already listed, add it to the `categories` array in the same file.

## Video hosting and local media

**Recommended: YouTube unlisted.** Upload the finished video to YouTube, set visibility to **Unlisted**, and use its video URL (for example `https://youtu.be/VIDEO_ID`) or embed URL. The player converts supported YouTube watch/share URLs to a privacy-enhanced embed and loads only after the viewer opens a project. Anyone who obtains an unlisted link may be able to watch it; unlisted is not private.

**Vimeo:** use a Vimeo video/share or player URL and allow embedding in the video's privacy settings. For an unlisted video, preserve its privacy hash (the `h` value) in the URL.

**Direct MP4:** set `sourceType: 'mp4'` and `video` to a direct, playable `.mp4` stream URL. A Google Drive sharing page is not a direct video stream and will not work as an MP4 source.

**Small local MP4:** put an optimized export in `public/media/videos/`, use a path such as `'/media/videos/project-01.mp4'`, and set `sourceType: 'local'`. Local video files are ignored by Git to prevent accidental large uploads. If the optimized file is small enough to include in your deployment, explicitly add only that file with `git add -f public/media/videos/project-01.mp4`. Prefer hosted embeds for larger videos; do not commit full-resolution exports.

Players are created only after a project is selected. Local playback uses the configured poster and `preload="none"`. See [`public/media/videos/README.md`](./public/media/videos/README.md) for the short hosting checklist.

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). It installs dependencies, lints, builds, and deploys `dist/` when changes are pushed to `main`. Vite uses the `/video-editing-portfolio/` base path in Actions builds; no generated `dist/` files are committed.

1. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
2. Push or merge the workflow to `main`, or run **Actions → Build and deploy portfolio → Run workflow**.
3. Confirm the run succeeds in the **Actions** tab. GitHub Pages will then be available at **<https://naveen9074.github.io/video-editing-portfolio/>**.

The repository must remain public for GitHub Pages on GitHub Free. Pages publishes a public website; do not put secrets or private information in the site or repository.
