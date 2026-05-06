// Spotify iframe embed — no API token needed for public embeds.
// Playlist URL is configurable via localStorage so admin can change it later;
// fallback is the Teen Pop Hits playlist from CLAUDE.md.

const DEFAULT_EMBED =
  'https://open.spotify.com/embed/playlist/37i9dQZF1DX1g0iEXLFycr?utm_source=generator&theme=0'

function readEmbedUrl() {
  try {
    const saved = localStorage.getItem('checklist:spotifyEmbed')
    if (saved) return saved
  } catch {
    /* ignore */
  }
  return DEFAULT_EMBED
}

export default function MusicPlayer() {
  const src = readEmbedUrl()

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-pink to-teal px-3 pt-2 pb-2 shadow-[0_-6px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
    >
      <div className="text-white text-xs font-bold tracking-wider uppercase mb-1 px-1">
        🎵 Music
      </div>
      <div className="rounded-xl overflow-hidden bg-black/10">
        <iframe
          title="Spotify Player"
          src={src}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ display: 'block', border: 0 }}
        />
      </div>
    </div>
  )
}
