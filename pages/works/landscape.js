import Head from 'next/head'
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import s from '../../styles/landscape.module.css'
import { useVideoPlayer } from '../../hooks/useVideoPlayer'

const IMG = {
  refuse:            '/images/landscape/refuse.webp',
  metalSandGravel:   '/images/landscape/metal-sand-gravel.webp',
  fillingMaterial:   '/images/landscape/filling-material.webp',
  coverSoil:         '/images/landscape/cover-soil.webp',
  hill:              '/images/landscape/hill.webp',
  island:            '/images/landscape/island.webp',
  contaminatedSite:  '/images/landscape/contaminated-site.webp',
  extraction:        '/images/landscape/extraction.webp',
  actingArea:        '/images/landscape/acting-area.webp',
  reflectivePond:    '/images/landscape/reflective-pond.webp',
  rotatingParking:   '/images/landscape/rotating-parking.webp',
  drinkBar:          '/images/landscape/drink-bar.webp',
  waterIntake:       '/images/landscape/water-intake.webp',
  algaeBiomass:      '/images/landscape/algae-biomass.webp',
  purificationField: '/images/landscape/purification-field.webp',
  purifiedWater:     '/images/landscape/purified-water.webp',
  marshGas:          '/images/landscape/marsh-gas.webp',
}

function PhaseHeader({ num, label }) {
  return (
    <div className={s.phaseHeader}>
      <span className={s.phaseLabel}>
        <span className={s.phaseAccent}>{num}</span>&nbsp;&nbsp;{label}
      </span>
      <span className={s.phaseLine} />
    </div>
  )
}

function ImageCard({ src, alt, contain = false, altBg = false, titleSize = 'lg', title, desc }) {
  return (
    <div className={s.col}>
      <div className={`${s.card}${altBg ? ` ${s.cardAlt}` : ''}`}>
        <img src={src} alt={alt} className={contain ? s.cardImgContain : s.cardImg} />
      </div>
      <div className={s.cardMeta}>
        <span className={titleSize === 'sm' ? s.cardTitleSm : s.cardTitle}>{title}</span>
      </div>
      {desc && <p className={s.cardDesc}>{desc}</p>}
    </div>
  )
}

function Connector({ label }) {
  return (
    <div className={s.connector}>
      <span className={s.connectorLabel}>{label}</span>
      <span className={s.connectorArrow}>↓</span>
    </div>
  )
}

function ClosingNote({ icon, text }) {
  return (
    <div className={s.closing}>
      <span className={s.closingIcon}>{icon}</span>
      <span className={s.closingText}>{text}</span>
    </div>
  )
}

export default function LandscapePage() {
  const {
    videoRef, playing, muted, volume, progress,
    togglePlay, handleVideoClick, handleSeek, toggleMute, handleVolume
  } = useVideoPlayer({ trackProgress: true })

  return (
    <>
      <Head>
        <title>Design Prototypes — Lake in Yunnan, China</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --ls-paper:           #FAF8F3;
            --ls-neutral-100:     #F2EEE6;
            --ls-neutral-200:     #E6E1D5;
            --ls-neutral-300:     #D4CDBE;
            --ls-neutral-400:     #ABA08C;
            --ls-neutral-500:     #847B69;
            --ls-neutral-800:     #2A2620;
            --ls-ink:             #1A1712;
            --ls-accent-500:      #C8442A;
            --ls-accent-600:      #AE3620;
            --ls-surface-page:    var(--ls-paper);
            --ls-surface-sunken:  var(--ls-neutral-100);
            --ls-text-strong:     var(--ls-ink);
            --ls-text-body:       var(--ls-neutral-800);
            --ls-text-muted:      var(--ls-neutral-500);
            --ls-text-faint:      var(--ls-neutral-400);
            --ls-text-accent:     var(--ls-accent-600);
            --ls-border-hairline: var(--ls-neutral-200);
            --ls-border-strong:   var(--ls-neutral-300);
            --ls-accent:          var(--ls-accent-500);
            --ls-radius-md:       8px;
            --ls-ring:            inset 0 0 0 1px var(--ls-border-hairline);
            --ls-font-display:    'Instrument Serif', Georgia, serif;
            --ls-font-sans:       'Hanken Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
            --ls-font-mono:       'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
          }
        `}</style>
      </Head>

      <main className={s.page}>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className={s.hero}>
          <div className={s.heroWrap}>
            <div className={s.videoWrapper}>
              <span className={s.heroLabel}>LAKE IN YUNNAN, CHINA</span>

              <video
                ref={videoRef}
                className={s.heroVideo}
                autoPlay
                muted
                loop
                playsInline
                onClick={handleVideoClick}
              >
                <source src="https://dbgftyntvqk2gwwb.public.blob.vercel-storage.com/landscape.mp4" type="video/mp4" />
              </video>

              <div className={s.controls}>
                <button
                  className={s.playBtn}
                  onClick={togglePlay}
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? '⏸' : '▶'}
                </button>
                <input
                  className={s.progressBar}
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleSeek}
                  aria-label="Seek"
                />
                <div className={s.volContainer}>
                  <button
                    className={s.muteBtn}
                    onClick={toggleMute}
                    aria-label={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted ? <IoVolumeMute size={18} /> : <IoVolumeHigh size={18} />}
                  </button>
                  <input
                    className={s.volSlider}
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={muted ? 0 : volume}
                    onChange={handleVolume}
                    aria-label="Volume"
                  />
                </div>
              </div>
            </div>

            <h1 className={s.heroH1}>
              <span className={s.heroH1Dim}>Design</span>
              <br />
              Prototypes
            </h1>

            <p className={s.heroHint}>
              Framework 1: Terrain Reclamation through Material Transformation&nbsp;↓
            </p>
          </div>
        </section>

        {/* ── Framework 1 ──────────────────────────────────────── */}
        <div className={s.container}>
          <div className={s.intro}>
            <span className={s.eyebrow}>Framework 1 — a circular material system</span>
            <p className={s.bodyText}>
              The site&apos;s building-produced refuse — demolition rubble, excavated soil, sand and
              gravel — is treated not as waste but as a raw material system. Sorted and classified,
              then repurposed as structural fill and cover-soil, it is layered back onto the site
              to build a new topographic form — a constructed hill and a series of island-like
              plateaus. The logic is circular: waste from human occupation becomes the medium for
              a new natural landscape.
            </p>
          </div>

          <PhaseHeader num="01" label="Reclaim &amp; sort" />
          <div className={s.grid}>
            <ImageCard
              src={IMG.refuse}
              alt="Building-produced refuse on site"
              title="Building-produced Refuse"
              desc="Demolition rubble, excavated soil, sand and gravel — kept on site as raw material."
            />
            <ImageCard
              src={IMG.metalSandGravel}
              alt="Refuse sorted into metal, sand and gravel"
              contain
              altBg
              title="Metal · Sand · Gravel"
              desc="Sorted and classified into reusable material streams."
            />
          </div>

          <Connector label="repurposed as" />

          <PhaseHeader num="02" label="Repurpose into material" />
          <div className={s.grid}>
            <ImageCard
              src={IMG.fillingMaterial}
              alt="Reclaimed material as structural fill"
              title="Filling Material"
              desc="Coarse rubble repurposed as structural fill — builds the hill."
            />
            <ImageCard
              src={IMG.coverSoil}
              alt="Reclaimed material as cover-soil substrate"
              title="Cover-soil Material"
              desc="Fine soil repurposed as cover-soil substrate — surfaces the islands."
            />
          </div>

          <Connector label="layered &amp; built up" />

          <PhaseHeader num="03" label="Build new terrain" />
          <div className={s.grid}>
            <ImageCard
              src={IMG.hill}
              alt="Constructed hill from layered fill"
              title="Hill"
              desc="Fill layered into a new topographic form."
            />
            <ImageCard
              src={IMG.island}
              alt="Elevated island plateaus"
              title="Island"
              desc="Elevated plateaus restructure the flat, degraded terrain."
            />
          </div>

          <ClosingNote
            icon="↺"
            text="Circular — waste from occupation becomes a new natural landscape"
          />
        </div>

        {/* ── Framework 2 ──────────────────────────────────────── */}
        <div className={s.sectionBorder}>
          <div className={s.container}>
            <p className={s.frameworkMeta}>
              Framework 2: Contaminated Ground as Spatial Opportunity&nbsp;↓
            </p>

            <div className={s.introWide}>
              <span className={s.eyebrow}>Framework 2 — Pit-to-Program</span>
              <p className={s.bodyText}>
                The design begins by acknowledging contamination rather than erasing it. The site —
                subsurface soil pollution and scattered excavation pits — is surveyed and classified.
                Contaminated soil is extracted and relocated to a landfill disposal zone, while the
                residual pits, once liabilities, become the spatial skeleton of a new public program.
                The voids are deepened, widened and shaped to hold an acting area with bleachers, a
                reflective pond, rotating parking, and food and beverage. A zone of environmental
                risk becomes a vibrant destination embedded in the remediated landscape.
              </p>
            </div>

            <PhaseHeader num="01" label="Acknowledge &amp; extract" />
            <div className={s.grid}>
              <ImageCard
                src={IMG.contaminatedSite}
                alt="Contaminated site surveyed and classified"
                title="Contaminated Site"
                desc="Subsurface pollution and scattered pits — surveyed and classified."
              />
              <ImageCard
                src={IMG.extraction}
                alt="Contaminated soil extracted; residual pits remain"
                title="Extraction &amp; Disposal"
                desc="Contaminated soil removed to a landfill zone; the empty pits stay."
              />
            </div>

            <Connector label="residual pits reimagined as program" />

            <PhaseHeader num="02" label="Pit-to-program — voids deepened &amp; shaped" />
            <div className={s.gridStack}>
              <div className={s.grid}>
                <ImageCard
                  src={IMG.actingArea}
                  alt="Sunken amphitheatre with bleachers"
                  title="Acting Area &amp; Bleachers"
                  desc="A void shaped into a sunken amphitheatre."
                />
                <ImageCard
                  src={IMG.reflectivePond}
                  alt="Reflective pond in a sealed pit"
                  title="Reflective Pond"
                  desc="A pit deepened and sealed to hold water."
                />
              </div>
              <div className={s.grid}>
                <ImageCard
                  src={IMG.rotatingParking}
                  alt="Spiral rotating parking structure"
                  title="Rotating Parking"
                  desc="A spiral ramp winds cars down into the ground."
                />
                <ImageCard
                  src={IMG.drinkBar}
                  alt="Drink bar and restaurant in an enclosed court"
                  title="Drink Bar &amp; Restaurant"
                  desc="Food and beverage set within an enclosed court."
                />
              </div>
            </div>

            <ClosingNote
              icon="↳"
              text="From environmental risk to a vibrant destination in the remediated landscape"
            />
          </div>
        </div>

        {/* ── Framework 3 ──────────────────────────────────────── */}
        <div className={s.sectionBorder}>
          <div className={s.container}>
            <p className={s.frameworkMeta}>
              Framework 3: Phytoremediation and Resource Recovery through Water Flow&nbsp;↓
            </p>

            <div className={s.introWide}>
              <span className={s.eyebrow}>Framework 3 — Resource Recovery through Water Flow</span>
              <p className={s.bodyText}>
                Caohai, the northern basin of Dianchi Lake, has long carried high pollutant loads
                from inflowing surface water. This framework uses the site&apos;s own hydrology —
                subsurface flow and prevailing winds — to route polluted water through a
                purification sequence. Inflow enters constructed wetland cells colonised by
                blue-green algae; as water migrates through, the algae absorb excess nitrogen,
                phosphorus and heavy metals, converting them into harvestable biomass. Treated
                water exits fit for ecological reuse, while byproducts — marsh gas and organic
                manure — are captured as secondary resources, closing the nutrient loop.
              </p>
            </div>

            <PhaseHeader num="01" label="Channel &amp; purify — constructed wetland, subsurface flow" />
            <div className={s.grid}>
              <ImageCard
                src={IMG.waterIntake}
                alt="Polluted inflow channelled into wetland cells"
                titleSize="sm"
                title="Polluted Water Intake"
                desc="Inflow channelled into wetland cells seeded with blue-green algae."
              />
              <ImageCard
                src={IMG.algaeBiomass}
                alt="Algae biomass absorbing nutrients"
                titleSize="sm"
                title="Algae Biomass"
                desc="Algae absorb nitrogen, phosphorus and heavy metals via subsurface flow."
              />
              <ImageCard
                src={IMG.purificationField}
                alt="Living phytoremediation field"
                titleSize="sm"
                title="Purification Field"
                desc="Cells and biomass build a living phytoremediation field."
              />
            </div>

            <Connector label="harvested &amp; recovered" />

            <PhaseHeader num="02" label="Recover resources — water &amp; byproducts" />
            <div className={s.grid}>
              <ImageCard
                src={IMG.purifiedWater}
                alt="Purified water fit for ecological reuse"
                title="Purified Water &amp; Reuse"
                desc="Treated water exits the system, fit for ecological reuse."
              />
              <ImageCard
                src={IMG.marshGas}
                alt="Marsh gas and organic manure captured as byproducts"
                title="Marsh Gas &amp; Organic Manure"
                desc="Biological byproducts captured as secondary resources."
              />
            </div>

            <ClosingNote
              icon="↺"
              text="Closed nutrient loop — a pollution problem becomes productive landscape infrastructure"
            />
          </div>
        </div>

      </main>
    </>
  )
}

/* Bypass the main site layout (navbar / footer / hero video) */
LandscapePage.getLayout = page => page
