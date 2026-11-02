## Hosting choices

- **YouTube Unlisted:** Upload the edit, allow embedding, and put the `youtu.be` share URL or embed URL in the project's `video`. Anyone who gets an unlisted link may watch it.
- **Vimeo:** Allow embedding and use a video/share or player URL. Keep the unlisted privacy hash (`h`) in the URL.
- **Direct MP4:** Use the direct stream URL with `sourceType: 'mp4'`. A Google Drive share page is not a direct MP4 stream.
- **Local MP4:** Put an optimized small export here and use `video: '/media/videos/your-file.mp4'` with `sourceType: 'local'`.

Video files are gitignored to prevent accidental large uploads. To deploy a deliberately small local file, explicitly force-add only that file. Keep full-resolution exports off GitHub.
