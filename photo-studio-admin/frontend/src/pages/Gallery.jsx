import React, { useEffect, useRef, useState } from 'react';
import galleryService from '../services/galleryService';
import Spinner from '../components/Spinner.jsx';
import { useToast } from '../hooks/useToast.jsx';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_ALBUM_IMAGES = 10;
const MAX_ALBUM_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const GALLERY_CATEGORIES = [
  'Wedding Photography', 'Pre Wedding', 'Engagement', 'Couple Portraits',
  'Reception', 'Candid Moments', 'Traditional Ceremony', 'Bridal Portfolio',
];

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export default function Gallery() {
  const { showToast } = useToast();
  const fileInput = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [form, setForm] = useState({
    title: '', category: 'Wedding Photography', eventType: 'Wedding', location: '',
    eventDate: '', photoCount: '', description: '', featured: false, files: [], preview: '',
  });

  const load = async () => {
    try {
      const res = await galleryService.list();
      setImages(res.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectFile = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (files.length > MAX_ALBUM_IMAGES) return showToast(`Choose up to ${MAX_ALBUM_IMAGES} images`, 'error');
    if (files.some((file) => !ACCEPTED_TYPES.includes(file.type))) return showToast('Use JPG, PNG, or WebP images', 'error');
    if (files.some((file) => file.size > MAX_FILE_SIZE)) return showToast('Each image must be 5 MB or smaller', 'error');
    if (files.reduce((sum, file) => sum + file.size, 0) > MAX_ALBUM_SIZE) return showToast('All album images together must be 10 MB or smaller', 'error');
    setForm((current) => ({ ...current, files, preview: URL.createObjectURL(files[0]) }));
  };

  const upload = async (event) => {
    event.preventDefault();
    if (!form.files.length) return showToast('Choose album images first', 'error');
    setUploading(true);
    try {
      const imagesData = await Promise.all(form.files.map(readImage));
      const { files, preview, ...metadata } = form;
      const res = await galleryService.upload({ ...metadata, imagesData });
      setImages((current) => [res.data, ...current]);
      setForm({
        title: '', category: 'Wedding Photography', eventType: 'Wedding', location: '',
        eventDate: '', photoCount: '', description: '', featured: false, files: [], preview: '',
      });
      if (fileInput.current) fileInput.current.value = '';
      showToast('Image is now visible in the client portfolio', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Remove this image from the public gallery?')) return;
    setRemovingId(id);
    try {
      await galleryService.remove(id);
      setImages((current) => current.filter((image) => image.id !== id && image._id !== id));
      showToast('Gallery image removed', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      <span className="eyebrow">▧ Portfolio</span>
      <h1 className="page-title" style={{ fontSize: 30 }}>Gallery Albums</h1>
      <p className="page-subtitle">Upload an album cover and the details shown on the public client gallery.</p>

      <form className="card" onSubmit={upload} style={{ padding: 24, margin: '24px 0', display: 'grid', gridTemplateColumns: 'minmax(180px, 250px) 1fr', gap: 24, alignItems: 'start' }}>
        <button type="button" onClick={() => fileInput.current?.click()} style={{ minHeight: 190, overflow: 'hidden', border: '1px dashed var(--gold-500)', borderRadius: 10, background: 'var(--paper)', cursor: 'pointer', padding: 0 }}>
          {form.preview ? <img src={form.preview} alt="First image selected for the album cover" style={{ width: '100%', height: 190, objectFit: 'cover' }} /> : <span style={{ display: 'block', padding: 24, color: 'var(--ink-400)' }}>Click to choose album images<br /><small>JPG, PNG or WebP · up to 10 images / 10 MB total</small></span>}
        </button>
        <input ref={fileInput} type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={selectFile} style={{ display: 'none' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
          <label className="field-label">Album Title *<input required className="field-input" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} placeholder="e.g. Sunset wedding" /></label>
          <label className="field-label">Category *<select required className="field-select" value={form.category} onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}>{GALLERY_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="field-label">Event Type *<input required className="field-input" value={form.eventType} onChange={(e) => setForm((current) => ({ ...current, eventType: e.target.value }))} placeholder="e.g. Wedding" /></label>
          <label className="field-label">Location *<input required className="field-input" value={form.location} onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))} placeholder="e.g. Madurai" /></label>
          <label className="field-label">Event Date *<input required type="date" className="field-input" value={form.eventDate} onChange={(e) => setForm((current) => ({ ...current, eventDate: e.target.value }))} /></label>
          <label className="field-label">Number of Photos *<input required min="1" step="1" type="number" className="field-input" value={form.photoCount} onChange={(e) => setForm((current) => ({ ...current, photoCount: e.target.value }))} placeholder="e.g. 250" /></label>
          <label className="field-label" style={{ gridColumn: '1 / -1' }}>Album Description<textarea className="field-input" rows="3" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} placeholder="A short description displayed when visitors open the album." /></label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}><input type="checkbox" checked={form.featured} onChange={(e) => setForm((current) => ({ ...current, featured: e.target.checked }))} /> Feature this album</label>
          {form.files.length > 0 && <span style={{ alignSelf: 'center', fontSize: 12, color: 'var(--ink-400)' }}>{form.files.length} images selected · first image is the cover</span>}
          <button className="btn btn-gold" disabled={uploading} style={{ justifySelf: 'start' }}>{uploading ? 'Uploading...' : 'Upload to Client Gallery'}</button>
        </div>
      </form>

      {loading ? <Spinner label="Loading gallery..." /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
          {images.map((image) => {
            const id = image.id || image._id;
            return <div className="card" key={id} style={{ overflow: 'hidden' }}><img src={image.imageData} alt={image.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} /><div style={{ padding: 14, display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontWeight: 700 }}>{image.title}{image.featured && <span style={{ marginLeft: 6, color: 'var(--gold-600)', fontSize: 11 }}>FEATURED</span>}</div><div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 3 }}>{image.category} · {image.eventType}</div><div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 3 }}>{image.location} · {image.imagesData?.length || 1} uploaded / {image.photoCount} photos</div></div><button className="btn btn-danger btn-sm" disabled={removingId === id} onClick={() => remove(id)}>{removingId === id ? '...' : 'Remove'}</button></div></div>;
          })}
          {images.length === 0 && <div className="card" style={{ padding: 32, gridColumn: '1 / -1', textAlign: 'center', color: 'var(--ink-400)' }}>No uploaded gallery images yet.</div>}
        </div>
      )}
    </div>
  );
}
