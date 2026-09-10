# Ülmez İnşaat — Web Sitesi

🔗 **Canlı site:** [ulmezinsaat.com](https://ulmezinsaat.com)

Bu proje, Ülmez İnşaat için hazırlanmış tam fonksiyonel, canlıda çalışan bir web
sitesidir: front-end (ürün kataloğu, teklif sepeti) ve back-end (ürün/teklif
yönetimi, admin panel) bir arada, Next.js ile geliştirilmiştir.

> Not: `data/` klasöründeki içerik (ürünler, projeler vb.) canlı işletme verisi
> olduğu için bu repoda yer almaz. Depoyu klonlayıp çalıştırmak isterseniz
> `npm run seed` ile örnek verilerle doldurabilirsiniz — aşağıya bakın.

## Neler var?

- **Anasayfa, Ürünlerimiz, Referans Projelerimiz, Bayiliklerimiz + E-Katalog, Emlak
  (satılık/kiralık), Hakkımızda, İletişim, Teklif Sepeti** sayfaları
- **3 dil**: Türkçe (varsayılan), İngilizce, Kurdî — sağ üstten değiştirilebilir
- **Teklif sepeti**: Müşteri ürün seçer, miktar girer, iletişim bilgileriyle teklif talebi gönderir (online ödeme yok)
- **Ürün ve proje fotoğrafları**: Her ürüne/projeye admin panelden istediğiniz kadar fotoğraf
  eklenebilir, birini "Ana Fotoğraf" yapabilirsiniz; ürün/proje sayfasında büyük galeri +
  tıklayınca açılan tam ekran görüntüleyici (ok tuşlarıyla gezinme) olarak gösterilir
- **Fotoğraf yükleme**: Admin panelden bilgisayarınızdan doğrudan fotoğraf yükleyebilirsiniz
  ("📤 Yükle" düğmesi) — ayrıca bir yere yükleyip link almanıza gerek yok
- **Admin panel** (`/admin`): Ürünler, Projelerimiz, Emlak İlanları, Kataloglar sekmelerinde
  ekleme/düzenleme/silme; gelen teklif taleplerini görüntüleme; site telefon numarası gibi
  ayarlar
- 19 örnek ürün ile dolu geliyor — gerçek ürünlerinizi admin panelden ekleyebilir, fotoğrafsız
  ürünler otomatik olarak rengini gösteren basit bir "örnek kart" ile gösterilir

## Yerel bilgisayarda çalıştırma

Gereksinim: [Node.js](https://nodejs.org) 18 veya üzeri.

```bash
npm install
cp .env.local.example .env.local   # şifreyi değiştirin
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

Örnek verileri sıfırlamak isterseniz: `npm run seed`

## Admin paneline giriş

- Adres: `/admin` (örn. `http://localhost:3000/admin`)
- Varsayılan şifre: `ulmez1980` — **canlıya almadan önce mutlaka değiştirin.**
  Admin panelinde giriş yaptıktan sonra **Ayarlar** sekmesinin altında
  "Admin Şifresini Değiştir" bölümünden değiştirebilirsiniz — dosya
  düzenlemeye gerek yoktur, değişiklik hemen geçerli olur.

## Domain satın alma ve siteyi yayına alma

Domain satın almak ve siteyi barındırmak (hosting) benim yapabileceğim bir işlem değil —
bunlar sizin adınıza bir ödeme/hesap gerektirir. Ama adım adım şöyle ilerleyebilirsiniz:

### 1. Domain satın alma
Türkiye'de yaygın seçenekler: **isimtescil.com, natro.com, turhost.com** ya da
uluslararası **Namecheap, GoDaddy**. Örnek: `ulmezinsaat.com.tr` veya `ulmezinsaat.com`.
".com.tr" için genelde vergi levhası istenir (kurumsal .tr uzantıları için).

### 2. Siteyi yayına alma (hosting)

Bu site ürün/teklif/proje verilerini ve admin panelinden yüklenen fotoğrafları basit
dosyalarda tutuyor (`data/` klasöründe JSON, `public/uploads/` klasöründe resimler).
Bu yüzden **kalıcı bir disk'i olan bir sunucu** (VPS) seçmeniz öneriliyor — böylece
hem veriler hem yüklenen fotoğraflar sorunsuz kalıcı olur, ayrı bir veritabanına
geçmenize gerek kalmaz.

**Yaygın VPS seçenekleri:** Hetzner, Contabo, DigitalOcean (uluslararası, uygun
fiyatlı) veya Natro, Turhost gibi Türkiye merkezli sağlayıcılar. Aylık ~5-10€
seviyesindeki en küçük paket bu site için fazlasıyla yeterlidir.

**Kurulum adımları (Ubuntu sunucu için):**

1. VPS'i satın alıp SSH ile bağlanın: `ssh root@sunucu-ip-adresi`
2. Node.js kurun (18 veya üzeri):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Projeyi sunucuya aktarın (GitHub'a yükleyip `git clone` ile, veya `scp`/SFTP ile
   doğrudan kopyalayarak).
4. Bağımlılıkları kurup projeyi derleyin:
   ```bash
   npm install
   cp .env.local.example .env.local   # ADMIN_PASSWORD ve ADMIN_SESSION_SECRET'ı değiştirin
   npm run build
   ```
5. Siteyi sürekli çalışır tutmak için bir process manager kullanın (sunucu yeniden
   başlasa veya site çökse bile otomatik ayağa kalkar):
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name ulmez-insaat -- start
   pm2 save
   pm2 startup   # sunucu yeniden başladığında otomatik başlatma için verilen komutu çalıştırın
   ```
6. **Nginx** kurup siteyi 80/443 portlarından (standart web portları) 3000 portundaki
   uygulamaya yönlendirin (reverse proxy), ardından **Certbot** ile ücretsiz SSL
   sertifikası alın — bu adımlar için yardımcı olabilirim, sunucunuz hazır olduğunda
   söylemeniz yeterli.
7. Domain sağlayıcınızda, domaininizin **A kaydını** VPS'in IP adresine yönlendirin.
   DNS'in yayılması birkaç saat sürebilir.

**Alternatif — Vercel:** Ücretsiz ve daha az teknik bilgi gerektiren bir seçenek
Vercel'dir, ancak dosya sistemi her deploy'da sıfırlandığı için hem JSON veri
dosyaları hem admin panelinden yüklenen fotoğraflar kalıcı olmaz — Vercel'de bu
site için ayrıca bir veritabanı (örn. Vercel Postgres) ve bulut depolama (örn.
Vercel Blob veya S3) kurulumu gerekir. VPS yolunda bu ek kurulumlara gerek yoktur.

### 3. Yedekleme

VPS'te veriler kalıcı olsa da, tek bir sunucuda tutulduğu için düzenli yedek almanız
önerilir. En basit yöntem: `data/` ve `public/uploads/` klasörlerini düzenli aralıklarla
(örn. haftalık) bilgisayarınıza indirmek veya bir bulut depoya (Google Drive, Dropbox vb.)
otomatik kopyalayan basit bir zamanlanmış görev (cron) kurmak — isterseniz bunu da
kurabilirim.

## Klasör yapısı (özet)

```
app/[locale]/         → dile göre sayfalar (tr/en/ku)
app/api/               → backend uçları (ürünler, projeler, bayilikler, kataloglar,
                          emlak ilanları, ayarlar, fotoğraf yükleme, admin girişi)
app/admin/             → admin panel sayfaları
components/            → arayüz bileşenleri
data/                  → ürün, kategori, proje, bayilik, katalog, emlak ilanı,
                          teklif, ayar verileri (JSON)
lib/                   → veri erişimi, çeviri metinleri, admin doğrulama
public/uploads/        → admin panelden yüklenen fotoğraflar
```
