// Generates data/products.json with sample catalog data.
// Run again any time with `npm run seed` to reset to the sample catalog.
const fs = require('fs');
const path = require('path');

const products = [
  // Seramik & Fayans
  { sku: 'SR-101', category: 'seramik-fayans', unit: 'm²', spec: '60x60 cm, Mat', color: '#C9BBA0',
    name: { tr: 'Traverten Desen Zemin Seramiği', en: 'Travertine-Pattern Floor Tile', ku: 'Keramîka Erdê ya Neqşa Traverten' },
    desc: { tr: 'Doğal traverten görünümlü, iç mekan zeminleri için mat yüzeyli seramik.', en: 'Natural travertine look, matte-finish tile for indoor floors.', ku: 'Xuya kirina traverten a xwezayî, ji bo erdê hundir.' } },
  { sku: 'SR-102', category: 'seramik-fayans', unit: 'm²', spec: '30x60 cm, Parlak', color: '#EDEAE4',
    name: { tr: 'Beyaz Parlak Duvar Fayansı', en: 'White Gloss Wall Tile', ku: 'Kaşiya Dîwar a Spî ya Parqîn' },
    desc: { tr: 'Mutfak ve banyo duvarları için klasik parlak beyaz fayans.', en: 'Classic glossy white tile for kitchen and bathroom walls.', ku: 'Kaşiya spî ya klasîk ji bo dîwarên metbex û serşokê.' } },
  { sku: 'SR-103', category: 'seramik-fayans', unit: 'm²', spec: '60x120 cm, Mermer Desen', color: '#D8D3C8',
    name: { tr: 'Mermer Desenli Büyük Ebat Seramik', en: 'Large-Format Marble-Look Tile', ku: 'Keramîka Mezin a Neqşa Mermer' },
    desc: { tr: 'Salon ve mekan girişleri için ihtişamlı mermer desenli seramik.', en: 'Statement marble-look tile for living rooms and entrances.', ku: 'Ji bo salon û derî, keramîka bi neqşa mermer.' } },
  { sku: 'SR-104', category: 'seramik-fayans', unit: 'm²', spec: '20x20 cm, Doku Yüzey', color: '#8C7A65',
    name: { tr: 'Dış Cephe Doğal Taş Görünümlü Seramik', en: 'Facade Natural-Stone-Look Tile', ku: 'Keramîka Rûyê Derve ya Xuya Kevirê Xwezayî' },
    desc: { tr: 'Dış cephe ve bahçe zeminleri için kaymaz doku yüzeyli seramik.', en: 'Slip-resistant textured tile for facades and garden floors.', ku: 'Ji bo rûyê derve û baxçe, keramîka nelemiz.' } },

  // Vitrifiye
  { sku: 'VT-201', category: 'vitrifiye', unit: 'adet', spec: 'Asma / Duvara Montaj', color: '#F2F1ED',
    name: { tr: 'Asma Klozet Takımı', en: 'Wall-Hung Toilet Set', ku: 'Tekîma Tuwaleta Daliqandî' },
    desc: { tr: 'Modern banyolar için gizli rezervuarlı asma klozet takımı.', en: 'Wall-hung toilet with concealed cistern for modern bathrooms.', ku: 'Ji bo serşokên nûjen, bi rezervuara veşartî.' } },
  { sku: 'VT-202', category: 'vitrifiye', unit: 'adet', spec: '60 cm, Tezgahaltı', color: '#EFEEEA',
    name: { tr: 'Tezgahaltı Lavabo', en: 'Under-Counter Basin', ku: 'Lavaboya Bin-Textê' },
    desc: { tr: 'Banyo dolapları ile uyumlu, kolay temizlenen tezgahaltı lavabo.', en: 'Easy-to-clean basin designed for under-counter installation.', ku: 'Lavaboya hêsan a paqijkirinê, ji bo bin-textê.' } },
  { sku: 'VT-203', category: 'vitrifiye', unit: 'takım', spec: 'Krom, Tek Kollu', color: '#B8BEC2',
    name: { tr: 'Lavabo Bataryası', en: 'Basin Mixer Tap', ku: 'Baterya Lavabo' },
    desc: { tr: 'Tek kollu, krom kaplama, uzun ömürlü lavabo bataryası.', en: 'Single-lever chrome-plated basin mixer, built for long service life.', ku: 'Bi yek destan, rûpoşa krom, dirêj dixebite.' } },

  // Parke & Zemin
  { sku: 'PK-301', category: 'parke-zemin', unit: 'm²', spec: '8 mm, AC4 Sınıf', color: '#A9754A',
    name: { tr: 'Meşe Desenli Laminat Parke', en: 'Oak-Pattern Laminate Flooring', ku: 'Parkeya Laminat a Neqşa Meşê' },
    desc: { tr: 'Yoğun kullanım alanları için AC4 sınıfı dayanıklı laminat parke.', en: 'AC4-rated laminate built for high-traffic areas.', ku: 'Ji bo cihên bi tîrbûna bikaranînê ya bilind.' } },
  { sku: 'PK-302', category: 'parke-zemin', unit: 'm²', spec: '12 mm, Su Geçirmez', color: '#7A5233',
    name: { tr: 'Su Geçirmez SPC Zemin Kaplaması', en: 'Waterproof SPC Flooring', ku: 'Rûyê Erdê yê SPC yê Bênav' },
    desc: { tr: 'Mutfak ve ıslak zeminler için su geçirmez taş plastik kompozit kaplama.', en: 'Stone-plastic composite flooring safe for kitchens and wet areas.', ku: 'Ji bo metbex û cihên şil, kompozîta kevir-plastîk.' } },
  { sku: 'PK-303', category: 'parke-zemin', unit: 'm²', spec: '7 mm, Ceviz Desen', color: '#5B3B27',
    name: { tr: 'Ceviz Desenli Laminat Parke', en: 'Walnut-Pattern Laminate Flooring', ku: 'Parkeya Laminat a Neqşa Gwîzê' },
    desc: { tr: 'Sıcak ceviz tonlarında, oturma alanları için şık laminat parke.', en: 'Warm walnut-tone laminate suited to living spaces.', ku: 'Bi rengê gwîza germ, ji bo salonan.' } },

  // Yalıtım
  { sku: 'YL-401', category: 'yalitim', unit: 'm²', spec: '5 cm, Beyaz EPS', color: '#F5F5F2',
    name: { tr: 'Isı Yalıtım Levhası (EPS)', en: 'EPS Thermal Insulation Board', ku: 'Textê Îzolasyona Germê (EPS)' },
    desc: { tr: 'Dış cephe mantolama sistemleri için standart yoğunluklu EPS levha.', en: 'Standard-density EPS board for exterior insulation systems.', ku: 'Textê EPS yê standard ji bo pergalên derve.' } },
  { sku: 'YL-402', category: 'yalitim', unit: 'rulo', spec: '1x10 m, Bitümlü', color: '#3C3A38',
    name: { tr: 'Bitümlü Su Yalıtım Membranı', en: 'Bituminous Waterproofing Membrane', ku: 'Membrana Îzolasyona Avê ya Bîtûmî' },
    desc: { tr: 'Temel, teras ve çatılar için kendinden yapışkanlı su yalıtım membranı.', en: 'Self-adhesive waterproofing membrane for foundations, terraces and roofs.', ku: 'Ji bo bingeh, teras û banan, xwe-zeliqok e.' } },
  { sku: 'YL-403', category: 'yalitim', unit: 'm²', spec: '10 cm, Taşyünü', color: '#D9D2C5',
    name: { tr: 'Taşyünü Ses ve Isı Yalıtımı', en: 'Rockwool Sound & Thermal Insulation', ku: 'Îzolasyona Deng û Germê ya Rockwool' },
    desc: { tr: 'Yangına dayanıklı, yüksek performanslı taşyünü yalıtım levhası.', en: 'Fire-resistant, high-performance rockwool insulation board.', ku: 'Li dijî agir berxwedêr e û performansa bilind e.' } },

  // Yapı Kimyasalları
  { sku: 'KM-501', category: 'yapi-kimyasallari', unit: 'torba', spec: '25 kg, C2 Sınıf', color: '#B7B0A3',
    name: { tr: 'Seramik Yapıştırıcısı', en: 'Ceramic Tile Adhesive', ku: 'Zeliqoka Kaşî' },
    desc: { tr: 'Zemin ve duvar seramikleri için esnek, güçlü tutuşlu yapıştırıcı.', en: 'Flexible, high-bond adhesive for floor and wall tiles.', ku: 'Zeliqoka bi hêz ji bo kaşiyên erd û dîwar.' } },
  { sku: 'KM-502', category: 'yapi-kimyasallari', unit: 'torba', spec: '5 kg, Beyaz', color: '#FFFFFF',
    name: { tr: 'Derz Dolgu Harcı', en: 'Tile Grout', ku: 'Herman a Dagirtina Derzan' },
    desc: { tr: 'Su itici katkılı, küf tutmaz derz dolgu harcı, çok renk seçeneği.', en: 'Water-repellent, mould-resistant grout, available in multiple colours.', ku: 'Li dijî kizê berxwedêr e, gelek reng hene.' } },
  { sku: 'KM-503', category: 'yapi-kimyasallari', unit: 'torba', spec: '25 kg, İç/Dış Mekan', color: '#DCD6C9',
    name: { tr: 'Hazır Sıva', en: 'Ready-Mix Plaster', ku: 'Sîwaxa Amade' },
    desc: { tr: 'İç ve dış cepheler için pürüzsüz yüzey veren hazır sıva harcı.', en: 'Ready-mix plaster giving a smooth finish, for interior and exterior use.', ku: 'Ji bo rûyê hundir û derve, rûyekî nerm dide.' } },

  // Hırdavat
  { sku: 'HD-601', category: 'hirdavat', unit: 'adet', spec: 'Galvaniz, Çeşitli Boy', color: '#8E9298',
    name: { tr: 'Galvanizli Vida ve Dübel Seti', en: 'Galvanized Screw & Anchor Set', ku: 'Tekîma Vîde û Dûbelê ya Galvanîze' },
    desc: { tr: 'İnşaat ve tadilat işleri için paslanmaz galvaniz kaplamalı set.', en: 'Rust-resistant galvanized set for construction and renovation work.', ku: 'Ji bo avahîsazî û tamîrkariyê, li dijî zengarê.' } },
  { sku: 'HD-602', category: 'hirdavat', unit: 'adet', spec: '600 g, Fiber Sap', color: '#4A4744',
    name: { tr: 'Çekiç', en: 'Hammer', ku: 'Çakuç' },
    desc: { tr: 'Fiber saplı, dengeli darbe gücüne sahip usta tipi çekiç.', en: 'Fibreglass-handled, professional-grade hammer with balanced strike.', ku: 'Bi destikê fiber, ji bo karên profesyonel.' } },
  { sku: 'HD-603', category: 'hirdavat', unit: 'adet', spec: '30 m, Manyetik', color: '#C9A227',
    name: { tr: 'Şerit Metre', en: 'Measuring Tape', ku: 'Şerîta Pîvanê' },
    desc: { tr: 'Manyetik uçlu, 30 metre uzunluğunda dayanıklı şerit metre.', en: 'Magnetic-tip, 30-metre durable measuring tape.', ku: 'Bi serê magnetîk, 30 metre dirêj.' } },
];

const withIds = products.map((p, i) => ({
  id: i + 1,
  ...p,
  featured: i % 5 === 0,
  createdAt: new Date().toISOString(),
}));

const outPath = path.join(__dirname, '..', 'data', 'products.json');
fs.writeFileSync(outPath, JSON.stringify(withIds, null, 2));
console.log(`Seeded ${withIds.length} products to ${outPath}`);

const quotesPath = path.join(__dirname, '..', 'data', 'quotes.json');
if (!fs.existsSync(quotesPath)) {
  fs.writeFileSync(quotesPath, '[]');
  console.log('Created empty data/quotes.json');
}
