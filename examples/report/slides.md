---
theme: slidev-theme-tahta
title: 2026 İkinci Çeyrek Büyüme Raporu
info: Türkçe örnek — çeyreklik büyüme raporu.
themeConfig:
  variant: editorial
  lang: tr
transition: slide-left
mdc: true
routerMode: hash
layout: cover
kicker: Çeyreklik rapor · 2026
subtitle: Kullanıcı büyümesi, gelir ve <span class="accent2">elde tutma</span> — ikinci çeyrek özeti.
---

# 2026 İkinci Çeyrek Büyüme Raporu

---
layout: statement
kicker: Yönetici özeti
title: Çeyreği <span class="accent2">rekor gelirle</span> kapattık — ama kayıp oranı arttı.
---

Büyüme hızlandı; asıl iş artık ilk 90 günde kullanıcıyı elde tutmakta.

---
layout: stats
kicker: İçgörüler
title: Çeyreğin temel göstergeleri
ghost: "Q2"
stats:
  - { value: 24.8, unit: "B₺", label: çeyreklik gelir, icon: "lucide:banknote", tone: good }
  - { value: 41, unit: "K", label: yeni aktif kullanıcı, icon: "lucide:users", tone: good }
  - { value: 6.3, unit: "%", label: aylık kayıp oranı, icon: "lucide:user-minus", tone: bad }
---

---
layout: chart
kicker: Gelir
title: Son altı çeyrekte gelir
note: Yıllık <span class="accent2">3,1 kat</span> büyüme.
chart:
  type: area
  unit: "B₺"
  categories: ["Ç1/25", "Ç2/25", "Ç3/25", "Ç4/25", "Ç1/26", "Ç2/26"]
  series:
    - { name: "Gelir (B₺)", data: [6.2, 8.9, 12.1, 16.8, 20.4, 24.8] }
---

---
layout: chart
kicker: Kanallar
title: Gelir nereden geliyor?
chart:
  type: donut
  unit: "%"
  categories: ["Doğrudan", "Bayi", "Pazaryeri", "Ortaklık"]
  series:
    - { data: [46, 27, 18, 9] }
---

---
layout: compare
kicker: Hedefe karşı
title: Hedeflerin çoğunu aştık
columns: ["Gösterge", "Hedef", "Gerçekleşen", "Δ"]
rows:
  - { metric: Gelir, before: "22B₺", after: "24.8B₺", delta: "+13%" }
  - { metric: Yeni kullanıcı, before: "38K", after: "41K", delta: "+8%" }
  - { metric: Kayıp oranı, before: "5%", after: "6.3%", delta: "−1.3p" }
  - { metric: NPS, before: "45", after: "52", delta: "+7" }
---

---
layout: default
kicker: Durum
title: Ekiplerin çeyrek sonu durumu
---

<div class="text-lg" style="display:flex; flex-direction:column; gap:0.8rem">
  <div>Büyüme ekibi <Badge tone="good">hedefte</Badge> — edinme kanalları planın önünde.</div>
  <div>Gelir ekibi <Badge tone="good">tamamlandı</Badge> — yıllık plan çeyrek erken kapandı.</div>
  <div>Elde tutma <Badge tone="warn">riskli</Badge> — ilk 90 gün kaybı izleniyor.</div>
  <div>Altyapı göçü <Badge tone="bad">gecikti</Badge> — bir sonraki çeyreğe kaydı.</div>
</div>

<Callout icon="lucide:triangle-alert" tone="warn">
<strong>Tek odak:</strong> kayıp oranı her şeyi gölgeliyor. Üçüncü çeyrekte tüm dikkat <span class="accent2">ilk 90 gün</span> elde tutmasına.
</Callout>

---
layout: timeline
kicker: Yol haritası
title: Üçüncü çeyrek öncelikleri
events:
  - { date: "TEMMUZ", title: Onboarding, desc: ilk gün değer anı }
  - { date: "AĞUSTOS", title: Uyarılar, desc: kayıp sinyalleri }
  - { date: "EYLÜL", title: Göç, desc: altyapı tamamlanır }
---

---
layout: fact
kicker: Çıkarım
value: "90"
unit: "gün"
label: Büyümeyi kazandık; sırada <span class="accent2">elde tutmayı</span> kazanmak var.
---

---
layout: end
title: Teşekkürler
subtitle: Sorular için açığız
contact: buyume@sirket.com
---
