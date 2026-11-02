import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import GlareHover from './components/GlareHover'
import {
  categories,
  contact,
  featuredProject,
  portfolio,
  profileImage,
  projects,
  type Project,
  type ProjectCategory,
} from './data/projects'
import { getEmbedUrl, isGoogleDriveShareUrl, mediaUrl } from './data/media'

function App() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'All'>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const filteredProjects = useMemo(
    () => [...(activeCategory === 'All' ? projects : projects.filter((project) => project.category === activeCategory))]
      .sort((left, right) => left.order - right.order),
    [activeCategory],
  )
  const embedUrl = selectedProject ? getEmbedUrl(selectedProject) : null
  const resolveMediaUrl = (path: string) => mediaUrl(path, import.meta.env.BASE_URL)
  const isDriveShare = selectedProject ? isGoogleDriveShareUrl(selectedProject.video) : false
  const hasInvalidEmbed = Boolean(
    selectedProject?.video
    && (selectedProject.sourceType === 'youtube' || selectedProject.sourceType === 'vimeo')
    && !embedUrl,
  )
  const showPlayerPlaceholder = Boolean(
    selectedProject
    && (!selectedProject.video || videoError || isDriveShare || hasInvalidEmbed),
  )

  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    revealElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [filteredProjects])

  useEffect(() => {
    if (!selectedProject) return undefined

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null)
      if (event.key !== 'Tab') return

      const dialog = document.querySelector<HTMLElement>('[role="dialog"]')
      const focusable = dialog?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], iframe, video, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [selectedProject])

  const openProject = (project: Project) => {
    setVideoError(false)
    setMenuOpen(false)
    setSelectedProject(project)
  }

  return (
    <div className="studio-page">
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Home">
          <span className="wordmark-icon" aria-hidden="true">{portfolio.displayName.charAt(0).toLowerCase()}<span>.</span></span>
          <span className="wordmark-name">{portfolio.displayName.toUpperCase()}<br /><small>{portfolio.studioIdentity}</small></span>
        </a>

        <button
          className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
          <span className="menu-glyph" aria-hidden="true"><i /><i /></span>
        </button>

        <nav id="primary-navigation" className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>Selected work <span>01</span></a>
          <a href="#about" onClick={() => setMenuOpen(false)}>The editor <span>02</span></a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Say hello <span>03</span></a>
        </nav>
        <a className="availability" href="#contact"><span /> Open for select projects <b>↗</b></a>
      </header>

      <main id="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span>{portfolio.professionalTitle} <i>✳</i> Independent work</span>
            <span>Based wherever the story is</span>
          </div>

          <div className="hero-stage">
            <div className="hero-copy">
              <p className="hero-label"><span>01</span> Picture / rhythm / feeling</p>
              <h1 id="hero-title" className="hero-title">
                <span className="headline-mask"><span>Stories,</span></span>
                <span className="headline-mask headline-middle"><span>cut</span></span>
                <span className="headline-mask headline-last"><span>different<span className="headline-stop">.</span></span></span>
              </h1>
              <p className="hero-intro">{portfolio.shortIntroduction}</p>
              <a href="#work" className="hero-cta"><span>Come see the work</span><b>↘</b></a>
            </div>

            <div className="hero-collage" aria-label="Featured showreel preview">
              <div className="collage-backdrop" />
              {profileImage ? (
                <img className="portrait-cutout" src={resolveMediaUrl(profileImage)} alt={`Portrait of ${portfolio.displayName}`} fetchPriority="high" />
              ) : (
                <div className="portrait-placeholder" aria-label="Add your portrait in the media profile folder">
                  <span className="portrait-sun" />
                  <span className="portrait-silhouette"><i /><b /></span>
                  <span className="portrait-caption">YOUR<br />PORTRAIT</span>
                </div>
              )}
              <button className="showreel-card" type="button" onClick={() => openProject(featuredProject)} aria-label={`Play ${featuredProject.title}`}>
                <span className="showreel-card-image">
                  <img src={resolveMediaUrl(featuredProject.poster)} alt="" fetchPriority="high" />
                  <span className="showreel-play"><i aria-hidden="true" />Play the reel</span>
                  <span className="showreel-card-count">FEATURED FILM&nbsp;&nbsp; / &nbsp;&nbsp;00:00</span>
                </span>
                <span className="showreel-card-caption"><b>{featuredProject.title}</b><span>Open showreel <i>↗</i></span></span>
              </button>
              <span className="collage-note">A frame is<br />a feeling.</span>
              <span className="collage-star" aria-hidden="true">✳</span>
              <span className="collage-side">EDITED WITH INTENTION — 01/04</span>
            </div>
          </div>

          <div className="hero-bottomline">
            <span>Thoughtful edits for every screen.</span>
            <a href="#work">Scroll for the good bits <b>↓</b></a>
            <span>Independent by nature</span>
          </div>
        </section>

        <section id="work" className="work-section section-wrap" aria-labelledby="work-title">
          <div className="section-intro" data-reveal>
            <div className="section-index"><span>01 / WORK</span><i>✳</i></div>
            <div className="section-title-block">
              <p className="section-overline">A few frames from the edit room</p>
              <h2 id="work-title">Made to <em>move.</em></h2>
            </div>
            <p className="section-aside">Different formats.<br />One thing in common:<br />the story comes first.</p>
          </div>

          <div className="filter-toolbar">
            <span className="filter-label">Explore by</span>
            <div className="filter-list" aria-label="Filter projects">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-button${category === activeCategory ? ' active' : ''}`}
                  aria-pressed={category === activeCategory}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <span className="project-count">{String(filteredProjects.length).padStart(2, '0')} FILMS</span>
          </div>

          {filteredProjects.length ? (
            <div className="project-gallery">
              {filteredProjects.map((project, index) => (
                <article
                  key={project.id}
                  className={`project-card layout-${project.layout}`}
                  data-reveal
                  style={{ order: project.order }}
                >
                  <GlareHover
                    className="project-glare"
                    width="100%"
                    borderRadius="15px"
                    glareOpacity={0.2}
                    glareSize={18}
                    transitionDuration={650}
                    rimGlint={false}
                  >
                    <button className="project-open" type="button" onClick={() => openProject(project)} aria-label={`Play ${project.title}`}>
                      <span className="project-art" style={{ aspectRatio: project.aspectRatio }}>
                        <img src={resolveMediaUrl(project.poster)} alt="" loading="lazy" />
                        <span className="project-placeholder-note">Your frame goes here</span>
                        <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                        <span className="project-play"><i aria-hidden="true" /> Play film</span>
                      </span>
                    </button>
                  </GlareHover>
                  <div className="project-meta">
                    <div className="project-title-line">
                      <span className="project-category">{project.category}</span>
                      <span className="project-order">NO. {String(project.order).padStart(2, '0')}</span>
                    </div>
                    <div className="project-heading-row">
                      <h3>{project.title}</h3>
                      {project.role && <span className="project-role">{project.role}</span>}
                      <span className="project-arrow" aria-hidden="true">↗</span>
                    </div>
                    {project.description && <p className="project-description">{project.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-projects" data-reveal>
              <span>✳</span>
              <p>Nothing in this cut just yet.</p>
              <button type="button" onClick={() => setActiveCategory('All')}>See all projects ↗</button>
            </div>
          )}
          <p className="gallery-footnote"><span>THE ARCHIVE IS GROWING</span><span>Replace the sample frames with your own work any time.</span></p>
        </section>

        <section className="manifesto" aria-label="Creative approach">
          <span className="manifesto-label">A note from the edit suite&nbsp; / &nbsp;02</span>
          <p>First the feeling.<br />Then the <em>frame.</em></p>
          <span className="manifesto-orbit" aria-hidden="true">STORY<br />OVER<br />NOISE</span>
          <span className="manifesto-foot">CUT ON FEELING&nbsp; ✳ &nbsp;BUILT TO LAND</span>
        </section>

        <section id="about" className="about-section section-wrap" aria-labelledby="about-title">
          <div className="section-index about-index" data-reveal><span>02 / THE EDITOR</span><i>✳</i></div>
          <div className="about-layout">
            <div className="about-portrait" data-reveal>
              {profileImage ? (
                <img src={resolveMediaUrl(profileImage)} alt={`Portrait of ${portfolio.displayName}`} loading="lazy" />
              ) : (
                <div className="portrait-placeholder portrait-about">
                  <span className="portrait-sun" />
                  <span className="portrait-silhouette"><i /><b /></span>
                  <span className="portrait-caption">YOUR<br />PORTRAIT</span>
                  <span className="portrait-hint">Add your image<br /><small>public/media/profile/</small></span>
                </div>
              )}
              <span className="about-image-index">{profileImage ? 'EDITOR PORTRAIT' : 'ADD YOUR PORTRAIT IN THE MEDIA FOLDER'}</span>
            </div>
            <div className="about-copy" data-reveal>
              <p className="section-overline">Hello, I’m {portfolio.displayName}.</p>
              <h2 id="about-title">A good cut<br />knows when to <em>stay.</em></h2>
              {portfolio.biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="capabilities">
                <span>Video editing</span><span>Short-form</span><span>Podcast</span><span>Motion</span><span>Color</span>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <div className="contact-header"><span>03 / YOUR TURN</span><span>Have a story in mind? <i>✳</i></span></div>
          <div className="contact-main">
            <p className="contact-overline">Let’s make something that sticks.</p>
            <h2 id="contact-title">Let’s make<br /><em>it move.</em></h2>
            <p className="contact-intro">Good briefs, kind people, stories worth telling — my inbox is open.</p>
            {contact.email ? (
              <a className="contact-action" href={`mailto:${contact.email}`}><span>{contact.email}</span><b>↗</b></a>
            ) : (
              <a className="contact-action" href="#contact-links"><span>Add your contact details</span><b>↗</b></a>
            )}
          </div>
          <footer id="contact-links" className="site-footer">
            <a className="footer-wordmark" href="#home" aria-label="Back to top">{portfolio.displayName.charAt(0).toLowerCase()}<span>.</span></a>
            <span className="footer-caption">{portfolio.professionalTitle}</span>
            <div className="footer-socials">
              {contact.email && <a href={`mailto:${contact.email}`}>Email ↗</a>}
              {contact.whatsapp && <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp ↗</a>}
              {contact.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>}
              {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
              {!contact.email && !contact.whatsapp && !contact.instagram && !contact.linkedin && <span>Contact links can be added in <code>src/data/projects.ts</code></span>}
            </div>
            <a className="footer-top" href="#home">Back up ↑</a>
          </footer>
        </section>
      </main>

      {selectedProject && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProject(null)
          }}
        >
          <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-header">
              <div>
                <p className="modal-category">{selectedProject.category} <span>✳</span></p>
                <h2 id="modal-title">{selectedProject.title}</h2>
              </div>
              <button ref={closeButtonRef} className="modal-close" type="button" onClick={() => setSelectedProject(null)} aria-label="Close preview">
                <span>Close</span><b aria-hidden="true">×</b>
              </button>
            </div>
            <div
              className="video-shell"
              style={{
                aspectRatio: selectedProject.aspectRatio,
                width: selectedProject.aspectRatio <= 1 ? 'auto' : '100%',
                height: selectedProject.aspectRatio <= 1 ? 'min(72svh, 80vw)' : 'auto',
              }}
            >
              {selectedProject.video && selectedProject.sourceType === 'youtube' && embedUrl && (
                <iframe
                  src={embedUrl}
                  title={selectedProject.title}
                  loading="lazy"
                  allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              )}
              {selectedProject.video && selectedProject.sourceType === 'vimeo' && embedUrl && (
                <iframe src={embedUrl} title={selectedProject.title} loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              )}
              {selectedProject.video && !videoError && !isDriveShare && (selectedProject.sourceType === 'mp4' || selectedProject.sourceType === 'local') && (
                <video
                  controls
                  preload="none"
                  playsInline
                  poster={resolveMediaUrl(selectedProject.poster)}
                  onError={() => setVideoError(true)}
                >
                  <source src={resolveMediaUrl(selectedProject.video)} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              )}
              {showPlayerPlaceholder && (
                <div className="player-placeholder">
                  <span className="player-mark" aria-hidden="true">✳</span>
                  <p>{videoError ? 'This video didn’t load.' : 'Your film, right here.'}</p>
                  <span>
                    {videoError
                      ? <>Check the URL and host permissions in <code>src/data/projects.ts</code>.</>
                      : isDriveShare
                        ? <>Google Drive sharing links are not direct MP4 streams. Use YouTube, Vimeo or a direct MP4 URL.</>
                        : hasInvalidEmbed
                          ? <>Add a valid YouTube or Vimeo watch/embed URL in <code>src/data/projects.ts</code>.</>
                          : <>Add its video URL in <code>src/data/projects.ts</code> to enable playback.</>}
                  </span>
                </div>
              )}
            </div>
            <div className="modal-footer"><span>Play here · no download needed</span><span>ESC TO CLOSE</span></div>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
