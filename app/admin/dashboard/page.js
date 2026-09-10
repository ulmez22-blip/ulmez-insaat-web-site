'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageListEditor from '../../../components/admin/ImageListEditor';

const CATEGORY_OPTIONS = [
  'seramik-fayans', 'vitrifiye', 'parke-zemin', 'yalitim', 'yapi-kimyasallari', 'hirdavat',
];

const EMPTY_FORM = {
  sku: '', category: CATEGORY_OPTIONS[0], unit: 'm²', spec: '', color: '#C9BBA0',
  name_tr: '', name_en: '', name_ku: '', desc_tr: '', desc_en: '', desc_ku: '', featured: false,
  images: [],
};

const EMPTY_PROJECT_FORM = {
  name_tr: '', name_en: '', name_ku: '', location: '',
  desc_tr: '', desc_en: '', desc_ku: '', images: [], videoUrl: '',
};

const LISTING_TYPES = ['ofis', 'ev'];
const LISTING_STATUSES = ['satilik', 'kiralik'];

const EMPTY_LISTING_FORM = {
  type: LISTING_TYPES[0], status: LISTING_STATUSES[0],
  title_tr: '', title_en: '', title_ku: '', location: '', price: '',
  desc_tr: '', desc_en: '', desc_ku: '', images: [],
};

const EMPTY_CATALOG_FORM = { dealerName: '', title: '', fileUrl: '' };

const EMPTY_SETTINGS = {
  phones: [],
  about: { tr: '', en: '', ku: '' },
  contact: { tr: '', en: '', ku: '' },
  address: { tr: '', en: '', ku: '' },
};

const TABS = [
  { key: 'products', label: 'Ürünler' },
  { key: 'projects', label: 'Projelerimiz' },
  { key: 'listings', label: 'Emlak İlanları' },
  { key: 'catalogs', label: 'Kataloglar' },
  { key: 'quotes', label: 'Teklif Talepleri' },
  { key: 'settings', label: 'Ayarlar' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT_FORM);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [listings, setListings] = useState([]);
  const [listingForm, setListingForm] = useState(EMPTY_LISTING_FORM);
  const [editingListingId, setEditingListingId] = useState(null);

  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [dealers, setDealers] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [catalogForm, setCatalogForm] = useState(EMPTY_CATALOG_FORM);
  const [editingCatalogId, setEditingCatalogId] = useState(null);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) router.push('/admin');
        else setAuthChecked(true);
      });
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    fetch('/api/products').then((r) => r.json()).then(setProducts);
    fetch('/api/quotes').then((r) => r.json()).then(setQuotes);
    fetch('/api/projects').then((r) => r.json()).then(setProjects);
    fetch('/api/listings').then((r) => r.json()).then(setListings);
    fetch('/api/settings').then((r) => r.json()).then(setSettings);
    fetch('/api/dealers').then((r) => r.json()).then((d) => {
      setDealers(d);
      setCatalogForm((f) => (f.dealerName ? f : { ...f, dealerName: d[0]?.name || '' }));
    });
    fetch('/api/catalogs').then((r) => r.json()).then(setCatalogs);
  }, [authChecked]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  // ---- Products ----
  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function loadForEdit(p) {
    setEditingId(p.id);
    setForm({
      sku: p.sku, category: p.category, unit: p.unit, spec: p.spec, color: p.color,
      name_tr: p.name.tr, name_en: p.name.en, name_ku: p.name.ku,
      desc_tr: p.desc.tr, desc_en: p.desc.en, desc_ku: p.desc.ku,
      featured: p.featured,
      images: p.images || [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      sku: form.sku, category: form.category, unit: form.unit, spec: form.spec, color: form.color,
      featured: form.featured,
      name: { tr: form.name_tr, en: form.name_en || form.name_tr, ku: form.name_ku || form.name_tr },
      desc: { tr: form.desc_tr, en: form.desc_en || form.desc_tr, ku: form.desc_ku || form.desc_tr },
      images: form.images.filter(Boolean),
    };

    const res = editingId
      ? await fetch(`/api/products/${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        })
      : await fetch('/api/products', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });

    if (res.ok) {
      const updated = await fetch('/api/products').then((r) => r.json());
      setProducts(updated);
      resetForm();
    }
  }

  async function handleDelete(id) {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleQuoteStatus(id, status) {
    const res = await fetch(`/api/quotes/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    });
    if (res.ok) setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  }

  // ---- Projects (Projelerimiz) ----
  function resetProjectForm() {
    setProjectForm(EMPTY_PROJECT_FORM);
    setEditingProjectId(null);
  }

  function loadProjectForEdit(p) {
    setEditingProjectId(p.id);
    setProjectForm({
      name_tr: p.name.tr, name_en: p.name.en, name_ku: p.name.ku, location: p.location,
      desc_tr: p.desc.tr, desc_en: p.desc.en, desc_ku: p.desc.ku,
      images: p.images || [], videoUrl: p.videoUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleProjectSubmit(e) {
    e.preventDefault();
    const payload = {
      location: projectForm.location,
      images: projectForm.images.filter(Boolean),
      videoUrl: projectForm.videoUrl,
      name: { tr: projectForm.name_tr, en: projectForm.name_en || projectForm.name_tr, ku: projectForm.name_ku || projectForm.name_tr },
      desc: { tr: projectForm.desc_tr, en: projectForm.desc_en || projectForm.desc_tr, ku: projectForm.desc_ku || projectForm.desc_tr },
    };

    const res = editingProjectId
      ? await fetch(`/api/projects/${editingProjectId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        })
      : await fetch('/api/projects', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });

    if (res.ok) {
      const updated = await fetch('/api/projects').then((r) => r.json());
      setProjects(updated);
      resetProjectForm();
    }
  }

  async function handleProjectDelete(id) {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  // ---- Listings (Emlak) ----
  function resetListingForm() {
    setListingForm(EMPTY_LISTING_FORM);
    setEditingListingId(null);
  }

  function loadListingForEdit(l) {
    setEditingListingId(l.id);
    setListingForm({
      type: l.type, status: l.status, location: l.location, price: l.price || '',
      title_tr: l.title.tr, title_en: l.title.en, title_ku: l.title.ku,
      desc_tr: l.desc.tr, desc_en: l.desc.en, desc_ku: l.desc.ku,
      images: l.images || [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleListingSubmit(e) {
    e.preventDefault();
    const payload = {
      type: listingForm.type, status: listingForm.status, location: listingForm.location, price: listingForm.price,
      images: listingForm.images.filter(Boolean),
      title: { tr: listingForm.title_tr, en: listingForm.title_en || listingForm.title_tr, ku: listingForm.title_ku || listingForm.title_tr },
      desc: { tr: listingForm.desc_tr, en: listingForm.desc_en || listingForm.desc_tr, ku: listingForm.desc_ku || listingForm.desc_tr },
    };

    const res = editingListingId
      ? await fetch(`/api/listings/${editingListingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        })
      : await fetch('/api/listings', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });

    if (res.ok) {
      const updated = await fetch('/api/listings').then((r) => r.json());
      setListings(updated);
      resetListingForm();
    }
  }

  async function handleListingDelete(id) {
    if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    if (res.ok) setListings((prev) => prev.filter((l) => l.id !== id));
  }

  // ---- Settings ----
  async function handleSettingsSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings),
    });
    if (res.ok) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor');
      return;
    }
    const res = await fetch('/api/admin/password', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2000);
    } else {
      setPasswordError(data.error || 'Bir hata oluştu');
    }
  }

  // ---- Catalogs (Kataloglar) ----
  function resetCatalogForm() {
    setCatalogForm({ ...EMPTY_CATALOG_FORM, dealerName: dealers[0]?.name || '' });
    setEditingCatalogId(null);
  }

  function loadCatalogForEdit(c) {
    setEditingCatalogId(c.id);
    setCatalogForm({ dealerName: c.dealerName, title: c.title, fileUrl: c.fileUrl });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleCatalogSubmit(e) {
    e.preventDefault();
    const payload = { ...catalogForm };

    const res = editingCatalogId
      ? await fetch(`/api/catalogs/${editingCatalogId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        })
      : await fetch('/api/catalogs', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });

    if (res.ok) {
      const updated = await fetch('/api/catalogs').then((r) => r.json());
      setCatalogs(updated);
      resetCatalogForm();
    }
  }

  async function handleCatalogDelete(id) {
    if (!confirm('Bu kataloğu silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/catalogs/${id}`, { method: 'DELETE' });
    if (res.ok) setCatalogs((prev) => prev.filter((c) => c.id !== id));
  }

  if (!authChecked) return <div className="p-10 text-sm text-charcoal/60">Yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold">Yönetim Paneli</h1>
        <button onClick={handleLogout} className="text-sm text-goldtext hover:text-goldtextdark">Çıkış Yap</button>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === t.key ? 'bg-charcoal text-paper' : 'bg-white border border-charcoal/15'
            }`}
          >
            {t.label}
            {t.key === 'products' && ` (${products.length})`}
            {t.key === 'projects' && ` (${projects.length})`}
            {t.key === 'listings' && ` (${listings.length})`}
            {t.key === 'catalogs' && ` (${catalogs.length})`}
            {t.key === 'quotes' && ` (${quotes.length})`}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          <form onSubmit={handleSubmit} className="bg-white border border-charcoal/10 rounded-lg p-5 h-fit space-y-3">
            <h2 className="font-display font-medium mb-2">{editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h2>
            <input required placeholder="SKU (örn: SR-105)" value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm">
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Birim (m², adet...)" value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="border border-charcoal/20 rounded px-3 py-2 text-sm" />
              <input type="color" value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="border border-charcoal/20 rounded h-full" />
            </div>
            <input placeholder="Özellik (60x60 cm, Mat...)" value={form.spec}
              onChange={(e) => setForm({ ...form, spec: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input required placeholder="Ürün Adı (Türkçe) *" value={form.name_tr}
              onChange={(e) => setForm({ ...form, name_tr: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input placeholder="Ürün Adı (English)" value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input placeholder="Ürün Adı (Kurdî)" value={form.name_ku}
              onChange={(e) => setForm({ ...form, name_ku: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <textarea required placeholder="Açıklama (Türkçe) *" value={form.desc_tr}
              onChange={(e) => setForm({ ...form, desc_tr: e.target.value })} rows={2}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <textarea placeholder="Açıklama (English)" value={form.desc_en}
              onChange={(e) => setForm({ ...form, desc_en: e.target.value })} rows={2}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <textarea placeholder="Açıklama (Kurdî)" value={form.desc_ku}
              onChange={(e) => setForm({ ...form, desc_ku: e.target.value })} rows={2}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Ana sayfada öne çıkar
            </label>
            <ImageListEditor
              images={form.images}
              onChange={(images) => setForm({ ...form, images })}
              label="Fotoğraflar"
            />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-brick hover:bg-brickdark text-charcoal text-sm font-medium py-2.5 rounded">
                {editingId ? 'Güncelle' : 'Ekle'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-sm px-3 border border-charcoal/20 rounded">
                  İptal
                </button>
              )}
            </div>
          </form>

          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-charcoal/10 rounded p-3 flex items-center gap-3">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded shrink-0" style={{ backgroundColor: p.color }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name.tr}</div>
                  <div className="text-xs text-charcoal/50 font-mono">{p.sku} · {p.category}</div>
                </div>
                <button onClick={() => loadForEdit(p)} className="text-xs text-steel hover:underline">Düzenle</button>
                <button onClick={() => handleDelete(p.id)} className="text-xs text-goldtext hover:underline">Sil</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'projects' && (
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          <form onSubmit={handleProjectSubmit} className="bg-white border border-charcoal/10 rounded-lg p-5 h-fit space-y-3">
            <h2 className="font-display font-medium mb-2">{editingProjectId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</h2>
            <input required placeholder="Proje Adı (Türkçe) *" value={projectForm.name_tr}
              onChange={(e) => setProjectForm({ ...projectForm, name_tr: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input placeholder="Proje Adı (English)" value={projectForm.name_en}
              onChange={(e) => setProjectForm({ ...projectForm, name_en: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input placeholder="Proje Adı (Kurdî)" value={projectForm.name_ku}
              onChange={(e) => setProjectForm({ ...projectForm, name_ku: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input required placeholder="Konum (örn: Kayapınar/Diyarbakır) *" value={projectForm.location}
              onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <textarea placeholder="Açıklama (Türkçe)" value={projectForm.desc_tr}
              onChange={(e) => setProjectForm({ ...projectForm, desc_tr: e.target.value })} rows={2}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <textarea placeholder="Açıklama (English)" value={projectForm.desc_en}
              onChange={(e) => setProjectForm({ ...projectForm, desc_en: e.target.value })} rows={2}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <textarea placeholder="Açıklama (Kurdî)" value={projectForm.desc_ku}
              onChange={(e) => setProjectForm({ ...projectForm, desc_ku: e.target.value })} rows={2}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <ImageListEditor
              images={projectForm.images}
              onChange={(images) => setProjectForm({ ...projectForm, images })}
            />
            <input placeholder="Video URL'si (YouTube vb.)" value={projectForm.videoUrl}
              onChange={(e) => setProjectForm({ ...projectForm, videoUrl: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-brick hover:bg-brickdark text-charcoal text-sm font-medium py-2.5 rounded">
                {editingProjectId ? 'Güncelle' : 'Ekle'}
              </button>
              {editingProjectId && (
                <button type="button" onClick={resetProjectForm} className="text-sm px-3 border border-charcoal/20 rounded">
                  İptal
                </button>
              )}
            </div>
          </form>

          <div className="space-y-2">
            {projects.map((p) => (
              <div key={p.id} className="bg-white border border-charcoal/10 rounded p-3 flex items-center gap-3">
                {p.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name.tr}</div>
                  <div className="text-xs text-charcoal/50">
                    {p.location}
                    {p.images?.length > 1 && ` · ${p.images.length} fotoğraf`}
                  </div>
                </div>
                <button onClick={() => loadProjectForEdit(p)} className="text-xs text-steel hover:underline">Düzenle</button>
                <button onClick={() => handleProjectDelete(p.id)} className="text-xs text-goldtext hover:underline">Sil</button>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-charcoal/60">Henüz proje eklenmedi.</p>}
          </div>
        </div>
      )}

      {tab === 'listings' && (
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          <form onSubmit={handleListingSubmit} className="bg-white border border-charcoal/10 rounded-lg p-5 h-fit space-y-3">
            <h2 className="font-display font-medium mb-2">{editingListingId ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}</h2>
            <div className="grid grid-cols-2 gap-2">
              <select value={listingForm.type} onChange={(e) => setListingForm({ ...listingForm, type: e.target.value })}
                className="border border-charcoal/20 rounded px-3 py-2 text-sm">
                <option value="ofis">Ofis</option>
                <option value="ev">Ev</option>
              </select>
              <select value={listingForm.status} onChange={(e) => setListingForm({ ...listingForm, status: e.target.value })}
                className="border border-charcoal/20 rounded px-3 py-2 text-sm">
                <option value="satilik">Satılık</option>
                <option value="kiralik">Kiralık</option>
              </select>
            </div>
            <input required placeholder="İlan Başlığı (Türkçe) *" value={listingForm.title_tr}
              onChange={(e) => setListingForm({ ...listingForm, title_tr: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input placeholder="İlan Başlığı (English)" value={listingForm.title_en}
              onChange={(e) => setListingForm({ ...listingForm, title_en: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input placeholder="İlan Başlığı (Kurdî)" value={listingForm.title_ku}
              onChange={(e) => setListingForm({ ...listingForm, title_ku: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input required placeholder="Konum *" value={listingForm.location}
              onChange={(e) => setListingForm({ ...listingForm, location: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input placeholder="Fiyat (örn: 2.500.000 TL)" value={listingForm.price}
              onChange={(e) => setListingForm({ ...listingForm, price: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <textarea placeholder="Açıklama (Türkçe)" value={listingForm.desc_tr}
              onChange={(e) => setListingForm({ ...listingForm, desc_tr: e.target.value })} rows={2}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <textarea placeholder="Açıklama (English)" value={listingForm.desc_en}
              onChange={(e) => setListingForm({ ...listingForm, desc_en: e.target.value })} rows={2}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <textarea placeholder="Açıklama (Kurdî)" value={listingForm.desc_ku}
              onChange={(e) => setListingForm({ ...listingForm, desc_ku: e.target.value })} rows={2}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <ImageListEditor
              images={listingForm.images}
              onChange={(images) => setListingForm({ ...listingForm, images })}
              label="Fotoğraflar"
            />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-brick hover:bg-brickdark text-charcoal text-sm font-medium py-2.5 rounded">
                {editingListingId ? 'Güncelle' : 'Ekle'}
              </button>
              {editingListingId && (
                <button type="button" onClick={resetListingForm} className="text-sm px-3 border border-charcoal/20 rounded">
                  İptal
                </button>
              )}
            </div>
          </form>

          <div className="space-y-2">
            {listings.map((l) => (
              <div key={l.id} className="bg-white border border-charcoal/10 rounded p-3 flex items-center gap-3">
                {l.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.images[0]} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{l.title.tr}</div>
                  <div className="text-xs text-charcoal/50">
                    {l.type === 'ofis' ? 'Ofis' : 'Ev'} · {l.status === 'satilik' ? 'Satılık' : 'Kiralık'} · {l.location}
                    {l.price && ` · ${l.price}`}
                    {l.images?.length > 1 && ` · ${l.images.length} fotoğraf`}
                  </div>
                </div>
                <button onClick={() => loadListingForEdit(l)} className="text-xs text-steel hover:underline">Düzenle</button>
                <button onClick={() => handleListingDelete(l.id)} className="text-xs text-goldtext hover:underline">Sil</button>
              </div>
            ))}
            {listings.length === 0 && <p className="text-sm text-charcoal/60">Henüz ilan eklenmedi.</p>}
          </div>
        </div>
      )}

      {tab === 'catalogs' && (
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          <form onSubmit={handleCatalogSubmit} className="bg-white border border-charcoal/10 rounded-lg p-5 h-fit space-y-3">
            <h2 className="font-display font-medium mb-2">{editingCatalogId ? 'Kataloğu Düzenle' : 'Yeni Katalog Ekle'}</h2>
            <select required value={catalogForm.dealerName}
              onChange={(e) => setCatalogForm({ ...catalogForm, dealerName: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm">
              {dealers.length === 0 && <option value="">Önce bayilik ekleyin</option>}
              {dealers.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
            <input required placeholder="Katalog Başlığı (örn: 2026 Ana Katalog)" value={catalogForm.title}
              onChange={(e) => setCatalogForm({ ...catalogForm, title: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <input required placeholder="Dosya URL'si (PDF linki)" value={catalogForm.fileUrl}
              onChange={(e) => setCatalogForm({ ...catalogForm, fileUrl: e.target.value })}
              className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-brick hover:bg-brickdark text-charcoal text-sm font-medium py-2.5 rounded">
                {editingCatalogId ? 'Güncelle' : 'Ekle'}
              </button>
              {editingCatalogId && (
                <button type="button" onClick={resetCatalogForm} className="text-sm px-3 border border-charcoal/20 rounded">
                  İptal
                </button>
              )}
            </div>
          </form>

          <div className="space-y-2">
            {catalogs.map((c) => (
              <div key={c.id} className="bg-white border border-charcoal/10 rounded p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.title}</div>
                  <div className="text-xs text-charcoal/50">{c.dealerName}</div>
                </div>
                <button onClick={() => loadCatalogForEdit(c)} className="text-xs text-steel hover:underline">Düzenle</button>
                <button onClick={() => handleCatalogDelete(c.id)} className="text-xs text-goldtext hover:underline">Sil</button>
              </div>
            ))}
            {catalogs.length === 0 && <p className="text-sm text-charcoal/60">Henüz katalog eklenmedi.</p>}
          </div>
        </div>
      )}

      {tab === 'quotes' && (
        <div className="space-y-3">
          {quotes.length === 0 && <p className="text-sm text-charcoal/60">Henüz teklif talebi yok.</p>}
          {quotes.map((q) => (
            <div key={q.id} className="bg-white border border-charcoal/10 rounded-lg p-4">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <div>
                  <div className="font-medium text-sm">{q.name} · {q.phone}</div>
                  <div className="text-xs text-charcoal/50">{q.email} · {new Date(q.createdAt).toLocaleString('tr-TR')}</div>
                </div>
                <select
                  value={q.status}
                  onChange={(e) => handleQuoteStatus(q.id, e.target.value)}
                  className="text-xs border border-charcoal/20 rounded px-2 py-1 h-fit"
                >
                  <option value="new">Yeni</option>
                  <option value="contacted">İletişime Geçildi</option>
                  <option value="closed">Tamamlandı</option>
                </select>
              </div>
              {q.address && <p className="text-xs text-charcoal/60 mb-1">Adres: {q.address}</p>}
              {q.message && <p className="text-xs text-charcoal/60 mb-2">Not: {q.message}</p>}
              <ul className="text-xs font-mono text-charcoal/70 list-disc pl-4">
                {q.items.map((i) => (
                  <li key={i.sku}>{i.sku} — {i.name?.tr || i.name} — {i.quantity} {i.unit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <form onSubmit={handleSettingsSubmit} className="bg-white border border-charcoal/10 rounded-lg p-5 max-w-xl space-y-6">
          <div>
            <h2 className="font-display font-medium mb-2">Telefon Numaraları</h2>
            <p className="text-xs text-charcoal/50 mb-2">
              Bu numaralar Gayrimenkul sayfasında ve iletişim bilgilerinde gösterilir. Birden fazla ekleyebilirsiniz.
            </p>
            <div className="space-y-2">
              {(settings.phones.length ? settings.phones : ['']).map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    placeholder="0531 845 16 83"
                    value={p}
                    onChange={(e) => {
                      const next = [...(settings.phones.length ? settings.phones : [''])];
                      next[i] = e.target.value;
                      setSettings({ ...settings, phones: next });
                    }}
                    className="flex-1 border border-charcoal/20 rounded px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = settings.phones.filter((_, idx) => idx !== i);
                      setSettings({ ...settings, phones: next });
                    }}
                    title="Kaldır"
                    className="text-xs px-2 py-2 rounded border border-charcoal/20 text-charcoal/60 hover:border-brick hover:text-goldtext shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSettings({ ...settings, phones: [...settings.phones, ''] })}
                className="text-xs px-3 py-2 rounded border border-dashed border-charcoal/30 text-charcoal/60 hover:border-brick hover:text-goldtext w-full"
              >
                + Telefon Ekle
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-display font-medium mb-2">Hakkımızda Metni</h2>
            <p className="text-xs text-charcoal/50 mb-2">Boş bırakılırsa site varsayılan metni gösterilir.</p>
            <div className="space-y-2">
              <textarea placeholder="Türkçe" rows={3} value={settings.about.tr}
                onChange={(e) => setSettings({ ...settings, about: { ...settings.about, tr: e.target.value } })}
                className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
              <textarea placeholder="English" rows={3} value={settings.about.en}
                onChange={(e) => setSettings({ ...settings, about: { ...settings.about, en: e.target.value } })}
                className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
              <textarea placeholder="Kurdî" rows={3} value={settings.about.ku}
                onChange={(e) => setSettings({ ...settings, about: { ...settings.about, ku: e.target.value } })}
                className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <h2 className="font-display font-medium mb-2">İletişim Sayfası Metni</h2>
            <p className="text-xs text-charcoal/50 mb-2">İletişim sayfasındaki üst açıklama metni. Boş bırakılırsa varsayılan gösterilir.</p>
            <div className="space-y-2">
              <textarea placeholder="Türkçe" rows={2} value={settings.contact.tr}
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, tr: e.target.value } })}
                className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
              <textarea placeholder="English" rows={2} value={settings.contact.en}
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, en: e.target.value } })}
                className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
              <textarea placeholder="Kurdî" rows={2} value={settings.contact.ku}
                onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, ku: e.target.value } })}
                className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <h2 className="font-display font-medium mb-2">Adres</h2>
            <p className="text-xs text-charcoal/50 mb-2">Boş bırakılırsa varsayılan adres gösterilir.</p>
            <div className="space-y-2">
              <input placeholder="Türkçe" value={settings.address.tr}
                onChange={(e) => setSettings({ ...settings, address: { ...settings.address, tr: e.target.value } })}
                className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
              <input placeholder="English" value={settings.address.en}
                onChange={(e) => setSettings({ ...settings, address: { ...settings.address, en: e.target.value } })}
                className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
              <input placeholder="Kurdî" value={settings.address.ku}
                onChange={(e) => setSettings({ ...settings, address: { ...settings.address, ku: e.target.value } })}
                className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <button type="submit" className="bg-brick hover:bg-brickdark text-charcoal text-sm font-medium px-5 py-2.5 rounded">
              Kaydet
            </button>
            {settingsSaved && <p className="text-xs text-goldtext mt-2">Kaydedildi.</p>}
          </div>
        </form>
      )}

      {tab === 'settings' && (
        <form onSubmit={handlePasswordSubmit} className="bg-white border border-charcoal/10 rounded-lg p-5 max-w-xl space-y-3 mt-6">
          <h2 className="font-display font-medium mb-2">Admin Şifresini Değiştir</h2>
          <input required type="password" placeholder="Mevcut şifre" value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
          <input required type="password" placeholder="Yeni şifre (en az 6 karakter)" value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
          <input required type="password" placeholder="Yeni şifre (tekrar)" value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            className="w-full border border-charcoal/20 rounded px-3 py-2 text-sm" />
          {passwordError && <p className="text-xs text-goldtext">{passwordError}</p>}
          <button type="submit" className="bg-brick hover:bg-brickdark text-charcoal text-sm font-medium px-5 py-2.5 rounded">
            Şifreyi Değiştir
          </button>
          {passwordSaved && <p className="text-xs text-goldtext mt-2">Şifre değiştirildi.</p>}
        </form>
      )}
    </div>
  );
}
