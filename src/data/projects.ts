export const categories = ['All', 'Short-form', 'Podcast', 'Cinematic', 'Motion', 'Color'] as const

export type ProjectCategory = (typeof categories)[number]

export type Project = {
  id: string
  title: string
  category: Exclude<ProjectCategory, 'All'>
  poster: string
  video: string
  sourceType: 'youtube' | 'vimeo' | 'mp4' | 'local'
  aspectRatio: number
  description?: string
  role?: string
  featured?: boolean
  order: number
  layout: 'feature' | 'portrait' | 'wide' | 'square'
}

export const contact = {
  email: '',
  whatsapp: '',
  instagram: '',
  linkedin: '',
}

export const profileImage = ''

export const projects: Project[] = [
  {
    id: 'project-01',
    title: 'Project title 01',
    category: 'Short-form',
    poster: '/media/posters/project-01.svg',
    video: '',
    sourceType: 'mp4',
    aspectRatio: 4 / 5,
    featured: true,
    order: 1,
    layout: 'feature',
  },
  {
    id: 'project-02',
    title: 'Project title 02',
    category: 'Cinematic',
    poster: '/media/posters/project-02.svg',
    video: '',
    sourceType: 'youtube',
    aspectRatio: 16 / 9,
    order: 2,
    layout: 'wide',
  },
  {
    id: 'project-03',
    title: 'Project title 03',
    category: 'Motion',
    poster: '/media/posters/project-03.svg',
    video: '',
    sourceType: 'vimeo',
    aspectRatio: 1,
    order: 3,
    layout: 'square',
  },
  {
    id: 'project-04',
    title: 'Project title 04',
    category: 'Podcast',
    poster: '/media/posters/project-04.svg',
    video: '',
    sourceType: 'mp4',
    aspectRatio: 9 / 16,
    order: 4,
    layout: 'portrait',
  },
]

export const featuredProject = projects.find((project) => project.featured) ?? projects[0]
