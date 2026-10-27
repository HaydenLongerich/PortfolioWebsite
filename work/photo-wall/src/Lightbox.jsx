import React,{useRef,useState,useEffect,useCallback} from 'react';
import {createPortal} from 'react-dom';
import {motion,useReducedMotion} from 'framer-motion';
export default function Lightbox({photos, activeId, onChange, onClose}) {
  const dialog = useRef(null), close = useRef(null);
  const reduced = useReducedMotion();
  const index = photos.findIndex(p => p.id === activeId), photo = photos[index];
  const [loaded, setLoaded] = useState(false), [failed, setFailed] = useState(false);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current.showModal();
    close.current.focus();
    return () => {dialog.current?.close(); previous?.focus?.();};
  }, []);
  useEffect(() => {
    setLoaded(false); setFailed(false);
    const next = new Image(); next.src = photos[(index + 1) % photos.length].src;
  }, [activeId]);
  const step = useCallback(direction => onChange(photos[(index + direction + photos.length) % photos.length].id), [index, photos, onChange]);
  return createPortal(<dialog ref={dialog} className="pw-lightbox" aria-label="Photo viewer" onCancel={event => {event.preventDefault(); onClose();}} onClick={event => {if (event.target === event.currentTarget) onClose();}} onKeyDown={event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault(); event.stopPropagation(); step(event.key === 'ArrowRight' ? 1 : -1);}
  }}>
    <div className="pw-lightbox-top flex items-center justify-between gap-4"><span className="pw-kicker">THE PHOTO WALL <span>/ {String(index + 1).padStart(2,'0')} OF {photos.length}</span></span><button ref={close} type="button" className="pw-control" onClick={onClose} aria-label="Close photo viewer">✕</button></div>
    <button type="button" className="pw-control pw-prev" onClick={() => step(-1)} aria-label="Previous photo"><span className="gallery-chevron" aria-hidden="true"/></button>
    <motion.figure key={photo.id} initial={{opacity:0, y:reduced?0:8}} animate={{opacity:1,y:0}} transition={{duration:reduced?0:.22}} className="pw-lightbox-figure">
      <div className="pw-full-image" style={{backgroundImage:`url(${photo.placeholder})`}}>
        <img src={photo.src} alt={photo.alt} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} style={{opacity:loaded?1:0}} decoding="async" />
        {!loaded && <span className="pw-load-status" role="status">{failed ? 'Image unavailable' : 'Loading original…'}</span>}
      </div>
      <figcaption className="flex items-start justify-between gap-4">{photo.showCaption && <div><h2>{photo.title}</h2><p>{photo.collection} {photo.date && <span>· {photo.date}</span>}</p></div>}<a href={photo.src} target="_blank" rel="noopener" className="pw-original">Open original </a></figcaption>
    </motion.figure>
    <button type="button" className="pw-control pw-next" onClick={() => step(1)} aria-label="Next photo"><span className="gallery-chevron" aria-hidden="true"/></button>
    <p className="pw-lightbox-hint">Arrow keys to explore <span>·</span> esc to close</p>
  </dialog>, document.body);
}
