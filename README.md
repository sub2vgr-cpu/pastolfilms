# Pastol Films — Website (may Admin Panel)

Modern na website para sa Pastol Films — navy blue, may Japanese-wave motif, video
gallery, mga anunsyo, at contact form. May kasamang **admin panel** (`/admin`) kung
saan pwedeng i-edit ng admin lang ang **logo, mga proyekto/video, mga anunsyo, at
contact info** — hindi na kailangang galawin ang code.

## Bakit Netlify, hindi lang GitHub Pages?

Ang GitHub Pages ay static file hosting lamang — walang paraan para mag-login at
mag-verify kung sino ang "admin". Para magkaroon ng tunay, secure na login (hindi
lang password na naka-hardcode sa JavaScript, na kahit sino'y makikita), kailangan
ng service na nag-aasikaso ng authentication. Ang **Netlify Identity + Git Gateway**
ay libreng serbisyo na gumagawa nito: nagbibigay ito ng tunay na login system, at
awtomatikong ico-commit ang mga pagbabago pabalik sa GitHub repo mo. Nananatili pa
rin ang code sa GitHub — Netlify lang ang nagho-host at nag-a-authenticate.

## Setup (isang beses lang)

### 1. I-push sa GitHub
Gumawa ng bagong **Public** repository sa GitHub (hal. `pastol-films`), i-upload
lahat ng mga file na ito (panatilihin ang folder structure: `css/`, `js/`,
`content/`, `admin/`, `images/`).

### 2. I-connect sa Netlify
1. Gumawa ng libreng account sa netlify.com (pwedeng mag-sign up gamit ang GitHub
   account mo).
2. **Add new site → Import an existing project → GitHub** → piliin ang `pastol-films`
   repo.
3. Build command: **iwanang blangko**. Publish directory: **`.`** (o "root").
4. I-click **Deploy**. Maghintay ng 1-2 minuto — may lalabas na link tulad ng
   `https://random-name-1234.netlify.app`.

### 3. I-enable ang Identity (ang "login system")
1. Sa Netlify dashboard ng site mo → **Site configuration → Identity → Enable Identity**.
2. Sa ilalim ng **Registration preferences**, piliin **Invite only**.

### 4. I-enable ang Git Gateway
Sa parehong Identity settings → **Services → Git Gateway → Enable Git Gateway**.

### 5. Mag-invite ng Admin
Sa **Identity** tab → **Invite users** → ilagay ang email ng admin (pwede ikaw
mismo). Makakatanggap sila ng email invite — pagka-click, magse-set sila ng
password, at maidi-redirect sila diretso sa `/admin`.

### 6. Gamitin ang Admin Panel
Pumunta sa `https://<pangalan-ng-site-mo>.netlify.app/admin/`, mag-login, at
pwede nang i-edit ang:
- **⚙️ Pangkalahatang Setting** — logo, pangalan ng site, hero text, email,
  social links, mga kulay
- **🎬 Mga Proyekto** — magdagdag/mag-edit/magtanggal ng proyekto/video
- **📰 Mga Anunsyo** — magdagdag/mag-edit ng anunsyo

Bawat "Publish" sa admin panel ay direktang nagco-commit sa GitHub repo mo, at
awtomatikong nag-a-update ang live site sa loob ng ilang segundo.

## Karaniwang Tanong
**Pwede bang maraming admin?** Oo — ulitin lang ang step 5 para sa bawat
karagdagang admin.

**Ligtas ba ito?** Oo — gumagamit ito ng parehong sistema ng authentication na
ginagamit ng maraming production websites (Netlify Identity + Git Gateway).

**Libre ba talaga lahat?** Oo, sapat na ang libreng tier ng Netlify.