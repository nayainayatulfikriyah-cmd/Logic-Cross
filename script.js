/* =====================================================================
   DATA SOAL TTS
   Setiap objek = satu "halaman" TTS.
   l = level (1-4), t = judul tema (ditampilkan di pita atas),
   w = daftar kata: [ [KATA, emoji_petunjuk], ... ]
   Total ada 16 halaman (4 level x 4 halaman).
   ===================================================================== */
const pages=[
{l:1,t:"Warna 🎨",w:[["MERAH","🟥"],["BIRU","🟦"],["HIJAU","🟩"],["KUNING","🟨"],["UNGU","🟪"],["HITAM","⬛"]]},
{l:1,t:"Hewan 🐱",w:[["KUCING","🐱"],["ANJING","🐶"],["SAPI","🐄"],["BEBEK","🦆"],["KUDA","🐴"],["IKAN","🐟"]]},
{l:1,t:"Kendaraan 🚗",w:[["MOBIL","🚗"],["BUS","🚌"],["KAPAL","🚢"],["MOTOR","🏍️"],["TRUK","🚚"],["SEPEDA","🚲"]]},
{l:1,t:"Makanan 🍚",w:[["NASI","🍚"],["ROTI","🍞"],["SATE","🍢"],["MIE","🍜"],["TEH","🍵"],["TELUR","🥚"]]},
{l:2,t:"Buah-buahan 🍎",w:[["APEL","🍎"],["PISANG","🍌"],["ANGGUR","🍇"],["JERUK","🍊"],["MANGGA","🥭"],["NANAS","🍍"],["MELON","🍈"],["LEMON","🍋"]]},
{l:2,t:"Benda di Sekolah ✏️",w:[["BUKU","📖"],["PENSIL","✏️"],["TAS","🎒"],["GUNTING","✂️"],["BEL","🔔"],["PETA","🗺️"],["KRAYON","🖍️"],["JAM","⏰"]]},
{l:2,t:"Benda di Rumah 🏠",w:[["LAMPU","💡"],["KURSI","🪑"],["PINTU","🚪"],["JENDELA","🪟"],["KASUR","🛏️"],["SAPU","🧹"],["KUNCI","🔑"],["TELEPON","☎️"]]},
{l:2,t:"Alam 🌳",w:[["MATAHARI","☀️"],["POHON","🌳"],["GUNUNG","⛰️"],["BULAN","🌙"],["AWAN","☁️"],["BUNGA","🌺"],["PELANGI","🌈"],["API","🔥"]]},
{l:3,t:"Pekerjaan 👮",w:[["POLISI","👮"],["GURU","👩‍🏫"],["PETANI","👨‍🌾"],["KOKI","👨‍🍳"],["PILOT","👨‍✈️"],["DOKTER","👨‍⚕️"],["PELUKIS","🧑‍🎨"],["TUKANG","👷"],["ASTRONOT","🧑‍🚀"],["PENYANYI","🧑‍🎤"]]},
{l:3,t:"Pakaian 👕",w:[["BAJU","👕"],["CELANA","👖"],["SEPATU","👟"],["TOPI","🧢"],["JAKET","🧥"],["SYAL","🧣"],["DASI","👔"],["GAUN","👗"],["KACAMATA","👓"],["SANDAL","🩴"]]},
{l:3,t:"Anggota Tubuh 👃",w:[["HIDUNG","👃"],["TANGAN","✋"],["MATA","👁️"],["KAKI","🦶"],["TELINGA","👂"],["GIGI","🦷"],["MULUT","👄"],["OTAK","🧠"],["LIDAH","👅"],["OTOT","💪"]]},
{l:3,t:"Sayuran 🥕",w:[["WORTEL","🥕"],["JAGUNG","🌽"],["TOMAT","🍅"],["BAWANG","🧅"],["BROKOLI","🥦"],["TERONG","🍆"],["CABAI","🌶️"],["KENTANG","🥔"],["TIMUN","🥒"],["JAMUR","🍄"]]},
{l:4,t:"Campuran 1 🎲",w:[["TRAKTOR","🚜"],["PISANG","🍌"],["JERAPAH","🦒"],["GURU","👩‍🏫"],["HIDUNG","👃"],["HUJAN","🌧️"],["BASKET","🏀"],["WORTEL","🥕"],["AWAN","☁️"],["KELINCI","🐰"],["KAMERA","📷"],["PAYUNG","☂️"]]},
{l:4,t:"Campuran 2 🧩",w:[["POLISI","👮"],["GURITA","🐙"],["SEPATU","👟"],["PIZZA","🍕"],["ROKET","🚀"],["GITAR","🎸"],["BINTANG","⭐"],["PANDA","🐼"],["APEL","🍎"],["BALON","🎈"],["PETIR","⚡"],["KEJU","🧀"]]},
{l:4,t:"Campuran 3 🎯",w:[["DOKTER","👨‍⚕️"],["BURUNG","🐦"],["PERAHU","⛵"],["ANGGUR","🍇"],["KURSI","🪑"],["TOPI","🧢"],["SALJU","❄️"],["DONAT","🍩"],["BULAN","🌙"],["GAJAH","🐘"],["KOPI","☕"],["MAHKOTA","👑"]]},
{l:4,t:"Campuran 4 🏆",w:[["PETANI","👨‍🌾"],["PENGUIN","🐧"],["TRUK","🚚"],["TOMAT","🍅"],["PENSIL","✏️"],["MATA","👁️"],["GUNUNG","⛰️"],["BIOLA","🎻"],["TAS","🎒"],["ULAR","🐍"],["SEPEDA","🚲"],["DRUM","🥁"]]}
];

/* Shortcut ala jQuery: $("id") = document.getElementById("id") */
const $=id=>document.getElementById(id);

/* ---------- STATE GLOBAL APLIKASI ---------- */
let page=1;              // nomor halaman TTS yang sedang dimainkan (1-16)
let me={name:"",id:""};  // data pemain saat ini: nama tampilan & id unik
let done={};             // { nomorHalaman: poinYangDidapat } untuk halaman yang sudah selesai
let db=null;             // referensi database bersama (jika tersedia lewat window.claude "db")
let t0=Date.now();       // waktu mulai, dipakai untuk menghitung timer berjalan
const st={};
/* Batas waktu tiap level (detik) untuk Level 1..4 — ubah angka di sini untuk menyesuaikan kesulitan */
const LIMITS=[180,280,390,480];
let lv=0,left=0,lvScore={},nextL=0,hist=[],fail={}; // fail[halaman]={v:jawaban pemain} = halaman terkunci karena ada huruf salah // hist = riwayat skor (maks 30 terakhir) // level aktif, sisa detik, skor tiap level, level berikutnya             // cache state tiap halaman: { puz, vals, hints } per nomor halaman

/* Total skor = jumlah skor tiap level yang sudah selesai */
const total=()=>Object.values(lvScore).reduce((a,b)=>a+b,0); // skor hanya dari level yang selesai

/* Helper baca/tulis localStorage dengan try/catch (aman jika storage diblokir browser) */
function ls(k,v){
 try{
  if(v===undefined)return localStorage.getItem(k); // mode baca: ls("key")
  localStorage.setItem(k,v);                         // mode tulis: ls("key", value)
 }catch(e){return null}
}

/* =====================================================================
   GENERATOR TEKA-TEKI SILANG (deterministik)
   Semua pemain mendapat susunan TTS yang SAMA untuk halaman yang sama,
   karena posisi kata dihasilkan dari generator angka acak (rng) yang
   "seed"-nya tetap (berdasarkan nomor halaman), bukan Math.random().
   ===================================================================== */

/* rng(a): generator angka acak semu (pseudo-random) berbasis seed "a".
   Memanggil hasilnya berulang kali akan selalu menghasilkan urutan
   angka yang sama untuk seed yang sama (mutable-xorshift style). */
function rng(a){
 return()=>{
  a|=0;a=a+0x6D2B79F5|0;
  let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;
  return((t^t>>>14)>>>0)/4294967296
 }
}

/* tryBuild: satu kali percobaan menyusun semua kata dalam "words" ke
   dalam satu grid saling-silang (seperti TTS asli), memakai fungsi
   acak "rand" yang sudah diseed. Mengembalikan null jika gagal
   menempatkan salah satu kata (akan dicoba ulang oleh build()). */
function tryBuild(words,rand){
 const L=new Map();      // peta koordinat "baris,kolom" -> huruf yang sudah ditempati
 const A=new Set();      // set koordinat yang sudah dipakai kata MENDATAR (Across)
 const D=new Set();      // set koordinat yang sudah dipakai kata MENURUN (Down)
 const k=(r,c)=>r+","+c; // helper bikin kunci koordinat
 const pl=[];            // daftar kata yang berhasil ditempatkan: {word,r,c,d,clue}

 // urutkan kata dari yang terpanjang -> mempermudah penempatan awal
 const ord=[...words].sort((a,b)=>b[0].length-a[0].length);

 // put(): benar-benar menuliskan huruf kata w ke grid mulai (r,c), arah d (0=mendatar,1=menurun)
 const put=(w,r,c,d)=>{
  for(let i=0;i<w.length;i++){
   const y=r+(d?i:0),x=c+(d?0:i);
   L.set(k(y,x),w[i]);
   (d?D:A).add(k(y,x))
  }
 };

 // ok(): cek apakah kata w BOLEH ditempatkan di (r,c) arah d, dengan aturan:
 // - tidak boleh nempel langsung di depan/belakang kata lain (harus ada jarak)
 // - kalau bertumpuk dengan huruf yang sudah ada, hurufnya harus SAMA
 // - tidak boleh dua kata dengan arah sama saling menempel di sisi (harus lewat silangan)
 // - minimal harus ada satu persilangan (cross>0) dengan kata yang sudah ada
 const ok=(w,r,c,d)=>{
  let cross=0;
  const dr=d?1:0,dc=d?0:1; // arah pergerakan per huruf
  // cek sel tepat sebelum & sesudah kata tidak terisi (mencegah kata jadi lebih panjang secara tak sengaja)
  if(L.has(k(r-dr,c-dc))||L.has(k(r+dr*w.length,c+dc*w.length)))return false;
  for(let i=0;i<w.length;i++){
   const y=r+dr*i,x=c+dc*i,e=L.get(k(y,x));
   if(e){
    // sudah ada huruf di sini: harus sama, dan tidak boleh arah yang sama (baru persilangan valid)
    if(e!==w[i]||(d?D:A).has(k(y,x)))return false;
    cross++
   }else if(L.has(k(y+dc,x+dr))||L.has(k(y-dc,x-dr))){
    // sel kosong tapi bertetangga langsung (tegak lurus arah) dengan huruf lain -> tidak valid
    return false
   }
  }
  return cross>0 // wajib minimal 1 persilangan dengan kata sebelumnya
 };

 // Tempatkan kata pertama secara acak di posisi (0,0), arah mendatar
 let rest=ord.slice();
 const first=rest.splice(Math.floor(rand()*rest.length),1)[0];
 put(first[0],0,0,0);
 pl.push({word:first[0],r:0,c:0,d:0,clue:first[1]});

 // Tempatkan sisa kata satu per satu, mencari titik persilangan yang valid
 while(rest.length){
  let placed=false;
  // acak urutan kata yang dicoba supaya hasil susunan bervariasi
  for(const idx of rest.map((_,i)=>i).sort(()=>rand()-.5)){
   const w=rest[idx][0],cand=[]; // cand = daftar kandidat posisi valid untuk kata w
   // coba tiap arah (mendatar/menurun), cari huruf w yang cocok dengan huruf yang sudah ada di grid
   for(let d=0;d<2;d++)
    for(const[key,ch]of L){
     const[y,x]=key.split(",").map(Number);
     for(let i=0;i<w.length;i++)
      if(w[i]===ch){
       const r=y-(d?i:0),c=x-(d?0:i);
       if(ok(w,r,c,d))cand.push([r,c,d])
      }
    }
   if(cand.length){
    // pilih satu kandidat posisi secara acak, lalu tempatkan
    const[r,c,d]=cand[Math.floor(rand()*cand.length)];
    put(w,r,c,d);
    pl.push({word:w,r,c,d,clue:rest[idx][1]});
    rest.splice(idx,1);
    placed=true;
    break
   }
  }
  if(!placed)return null // tidak ada kata yang bisa ditempatkan -> percobaan ini gagal
 }

 // Hitung batas grid (bounding box) dari semua koordinat yang terisi,
 // lalu geser semua koordinat supaya mulai dari (0,0)
 const ys=[...L.keys()].map(s=>+s.split(",")[0]),xs=[...L.keys()].map(s=>+s.split(",")[1]);
 const r0=Math.min(...ys),c0=Math.min(...xs),H=Math.max(...ys)-r0+1,W=Math.max(...xs)-c0+1;
 const grid=Array.from({length:H},()=>Array(W).fill(null));
 L.forEach((v,key)=>{const[y,x]=key.split(",").map(Number);grid[y-r0][x-c0]=v});
 pl.forEach(p=>{p.r-=r0;p.c-=c0});
 // Tolak susunan bila dua gambar petunjuk jatuh di sel yang sama (gambar akan bertabrakan)
 const cs=new Set();
 for(const q of pl){const kk=(q.r-(q.d?1:0))+","+(q.c-(q.d?0:1));if(cs.has(kk))return null;cs.add(kk)}
 // Tolak juga bila dua gambar petunjuk bersebelahan langsung (agar tidak terlihat menempel)
 for(const kk of cs){const[y,x]=kk.split(",").map(Number);if(cs.has((y+1)+","+x)||cs.has(y+","+(x+1)))return null}

 // Beri nomor urut pada setiap kata (dibaca dari kiri-atas ke kanan-bawah),
 // sel yang jadi titik awal >1 kata akan punya lebih dari satu nomor (mis. "3/5")
 pl.sort((a,b)=>a.r-b.r||a.c-b.c||a.d-b.d);
 const nums={};let n=0;
 pl.forEach(p=>{
  const key=p.r+","+p.c;
  (nums[key]=nums[key]||[]).push(p.num=++n)
 });

 return{grid,pl,nums}
}

/* build(p): mencoba tryBuild() sampai 600 kali dengan seed berbeda-beda,
   lalu memilih hasil dengan "skor kerapian" terbaik (sc), supaya bentuk
   grid TTS tidak terlalu memanjang/aneh dan persilangan kata cukup merata. */
function build(p){
 let best=null,bs=-1e9;
 const n=pages[p-1].w.length,tries=n>=10?2000:n>=9?1200:600; // soal banyak butuh lebih banyak percobaan agar grid tetap rapat
 for(let s=0;s<tries;s++){
  const r=tryBuild(pages[p-1].w,rng(p*1000+s)); // seed unik per halaman & percobaan
  if(!r)continue;
  const P=r.pl;
  // set koordinat sel yang ditempati tiap kata, untuk menghitung persilangan antar kata
  const cells=P.map(w=>new Set(Array.from({length:w.word.length},(_,i)=>(w.r+(w.d?i:0))+","+(w.c+(w.d?0:i)))));
  // deg[i] = berapa banyak kata lain yang bersilangan dengan kata ke-i
  const deg=P.map((_,i)=>P.reduce((a,_,j)=>a+(i!==j&&[...cells[i]].some(k=>cells[j].has(k))?1:0),0));
  const nA=P.filter(w=>!w.d).length,nD=P.length-nA; // jumlah kata mendatar vs menurun
  const H=r.grid.length,W=r.grid[0].length,ratio=Math.max(H,W)/Math.min(H,W); // rasio panjang:lebar grid
  // Rumus skor: makin seimbang mendatar/menurun, makin banyak persilangan merata,
  // makin kecil & makin persegi grid-nya -> skor makin tinggi (lebih baik)
  const sc=-Math.abs(nA-nD)*5-Math.max(...deg)*4+deg.filter(x=>x>=2).length*2-H*W/20-ratio*2-Math.max(0,W-10)*3-Math.max(0,H-12)*4; // grid terlalu lebar/tinggi dikurangi skornya // grid terlalu lebar dikurangi skornya
  if(sc>bs){bs=sc;best=r}
 }
 return best
}

/* S(p): ambil (atau buat baru bila belum ada) state halaman p, berisi:
   - puz: hasil build() (grid + daftar kata + nomor)
   - vals: jawaban yang sudah diketik pemain di halaman ini (belum tentu benar)
   - hints: jumlah petunjuk yang sudah dipakai di halaman ini */
const S=p=>st[p]||(st[p]={puz:build(p),vals:{},hints:0});

/* =====================================================================
   NAVIGASI LAYAR & HALAMAN
   ===================================================================== */

/* Tampilkan satu layar (id="home" atau id="game"), sembunyikan yang lain */
function show(id){
 document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));
 $(id).classList.add("active")
}

/* Kembali ke beranda: hentikan timer & perbarui progres level sebelum ditampilkan */
function home(){stopTimer();prog();show("home")}

/* Tombol "Sebelumnya": hanya aktif jika bukan halaman pertama dalam level (page%4!==1) */
function pv(){if(page%4!==1)go(page-1)}
/* Tombol "Berikutnya": jika halaman ke-4 (terakhir) dalam level, kembali ke beranda; selain itu lanjut */
function nx(){if(page%4===0)home();else go(page+1)}

/* unlocked(l): level 1 selalu terbuka; level lain terbuka hanya jika
   SEMUA 4 halaman level sebelumnya sudah selesai (done) */
const unlocked=l=>l===1||[1,2,3,4].every(i=>done[(l-2)*4+i]);

/* prog(): perbarui tampilan status tiap level di beranda
   (kunci/tidak terkunci, jumlah halaman yang sudah selesai) */
function prog(){
 for(let l=1;l<=4;l++){
  let n=0;
  for(let i=1;i<=4;i++)if(done[(l-1)*4+i])n++;
  const u=unlocked(l);
  document.querySelector(".level.l"+l).classList.toggle("locked",!u);
  $("lp"+l).textContent=u
   ?n+"/4 selesai • "+pages[(l-1)*4].w.length+" gambar • ⏱️ "+fmt(LIMITS[l-1])
   :"🔒 Terkunci • selesaikan Level "+(l-1)
 }
}

/* Tampilkan notifikasi kecil (toast) selama 3.5 detik lalu hilang otomatis */
function toast(m){
 const t=$("toast");
 t.textContent=m;
 t.classList.add("show");
 clearTimeout(toast.t);
 toast.t=setTimeout(()=>t.classList.remove("show"),3500)
}

/* start(): dipanggil saat tombol "Mulai Bermain" ditekan.
   - Validasi nama tidak kosong
   - Buat id unik dari nama (huruf kecil, tanpa spasi/simbol)
   - Muat progres (done) dari localStorage, digabung dengan data server bila ada
   - Mulai timer & masuk ke halaman pertama yang belum diselesaikan */
async function start(){
 const n=$("nameIn").value.trim().slice(0,16);
 if(!n){$("nameIn").focus();return}
 me.name=n;
 me.id="p_"+(n.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,24)||"anon");
 ls("lc_name",n); // ingat nama untuk kunjungan berikutnya
 $("who").textContent=n;

 done={};
 try{done=JSON.parse(ls("lc_done_"+me.id)||"{}")}catch(e){}
 lvScore={};
 try{lvScore=JSON.parse(ls("lc_lv_"+me.id)||"{}")}catch(e){}
 hist=[];
 try{hist=JSON.parse(ls("lc_hist_"+me.id)||"[]")}catch(e){}
 fail={};
 try{fail=JSON.parse(ls("lc_fail_"+me.id)||"{}")}catch(e){}

 // Jika ada koneksi database bersama, gabungkan progres dari server (data lokal tetap diutamakan)
 if(db){
  try{
   const s=await db.doc("scores/"+me.id).get(),d=s.data();
   if(d&&d.pages)done={...d.pages,...done};
   if(d&&d.lv)lvScore={...d.lv,...lvScore};
   if(d&&d.fail)fail={...d.fail,...fail}
  }catch(e){}
 }

 for(let l=1;l<=4;l++)if(!lvScore[l]&&[1,2,3,4].every(i=>done[(l-1)*4+i]))lvScore[l]=[1,2,3,4].reduce((a,i)=>a+done[(l-1)*4+i],0);
 lv=0;stopTimer();
 $("score").textContent=total();
 prog();
 // masuk ke halaman pertama yang belum selesai (kecuali semua 16 sudah selesai -> mulai dari 1)
 enter(Object.keys(done).length<16?firstOpen():1)
}

/* Cari nomor halaman pertama (1-16) yang belum ditandai selesai */
function firstOpen(){for(let i=1;i<=16;i++)if(!done[i])return i;return 1}

/* enter(n): dipanggil saat pemain klik kartu level atau titik halaman.
   Cek nama sudah diisi & level sudah terbuka sebelum benar-benar masuk. */
function enter(n){
 if(!me.name){$("nameIn").focus();$("mode").textContent="Isi nama dulu ya 🙂";return}
 const L=Math.floor((n-1)/4)+1;
 if(!unlocked(L)){toast("🔒 Selesaikan Level "+(L-1)+" dulu untuk membuka Level "+L+"!");return}
 if(lv!==L||!tmr)beginLevel(L); // timer level baru dimulai saat masuk level dari beranda
 go(n)
}

/* go(n): pindah ke halaman n (dibatasi 1-16), tampilkan layar game, lalu render ulang */
/* fit(): ukuran kotak mengikuti lebar tempat grid (pas di HP: min 26px, maks 44px; di layar lebar maks 52px) */
/* lvDims(L): kolom & baris terbesar di antara 4 halaman pada level L (termasuk tepi gambar petunjuk),
   dipakai agar semua halaman satu level punya ukuran kotak dan bingkai papan yang sama */
function lvDims(L){
 let c=0,r=0;
 for(let q=(L-1)*4+1;q<=L*4;q++){ // 4 halaman satu level (jumlah soalnya sama)
  const u=S(q).puz,pl=u.pl;
  const oc=pl.some(w=>!w.d&&w.c===0)?1:0,orow=pl.some(w=>w.d&&w.r===0)?1:0;
  c=Math.max(c,u.grid[0].length+oc);r=Math.max(r,u.grid.length+orow)
 }
 return{c:c,r:r}
}
function fit(){
 const cr=$("cross"),D=lvDims(Math.ceil(page/4)),n=Math.max(D.c,+cr.dataset.cols);if(!+cr.dataset.cols)return;
 const gb=cr.parentElement,gs=getComputedStyle(gb);
 const avW=gb.clientWidth-parseFloat(gs.paddingLeft)-parseFloat(gs.paddingRight)-6; // lebar sebenarnya yang tersedia untuk grid
 const av=avW>0?Math.min(avW,640):innerWidth-60,mx=innerWidth<=600?44:52;
 /* Ukuran kotak menyesuaikan jumlah soal: sedikit -> besar, banyak -> kecil (6 soal ≈ 44px, 8 ≈ 40, 10 ≈ 36, 12 ≈ 32 di HP),
    lalu dibatasi lebar layar agar grid tidak terpotong */
 const wc=pages[page-1].w.length,tgt=Math.round((48-(wc-4)*2)*mx/44);
 const cs=Math.max(20,Math.min(mx,tgt,Math.floor(av/n)));
 cr.style.setProperty("--cs",cs+"px");
 gb.style.minHeight=(D.r*cs+parseFloat(gs.paddingTop)+parseFloat(gs.paddingBottom)+6)+"px"; // tinggi bingkai papan sama untuk semua halaman level
}
addEventListener("resize",fit);
function go(n){page=Math.max(1,Math.min(16,n));show("game");render()}

/* =====================================================================
   RENDER TAMPILAN HALAMAN TTS
   Fungsi ini membangun ulang seluruh isi layar game: judul, tema warna,
   dekorasi, titik navigasi halaman, grid kotak TTS, dan kartu petunjuk.
   ===================================================================== */
function render(){
 const d=pages[page-1],s=S(page),g=s.puz.grid;

 // Label level & nomor halaman di kotak nama
 $("levelLabel").textContent=["","🟢 Level 1","🔵 Level 2","🟠 Level 3","🟣 Level 4"][d.l]+" • Halaman "+((page-1)%4+1)+"/4";
 $("prevBtn").disabled=page%4===1; // tombol "Sebelumnya" nonaktif di halaman pertama level
 $("nextBtn").textContent=page%4===0?"⌂ Finish":"Next →"; // ganti label di halaman terakhir level
 $("title").textContent=d.t;

 // Palet warna tema (per level), diterapkan lewat CSS variable --th/--th2/--th3
 const th=[0,
  ["#bff0e4","#8edcc9","#2f9c82"], // level 1: hijau mint
  ["#c8e2ff","#8fc0f5","#3f86d0"], // level 2: biru
  ["#ffdcb8","#f5b877","#d9782a"], // level 3: oranye
  ["#dccbff","#b99af0","#7f55c9"]  // level 4: ungu
 ][d.l];
 const sh=$("sheet");
 sh.style.setProperty("--th",th[0]);
 sh.style.setProperty("--th2",th[1]);
 sh.style.setProperty("--th3",th[2]);
 $("pname").textContent=me.name||"........";

 // Posisi (persen) 8 titik dekorasi di sekeliling lembar kertas
 const P=[[-3,-3],[90,-3],[-3,45],[91,44],[-3,91],[90,91],[45,93],[47,-4]];
 $("decor").replaceChildren(...P.map((q,i)=>{
  const e=document.createElement("span");
  // emoji dekorasi diambil dari daftar petunjuk gambar (diulang jika jumlah kata < 8)
  e.textContent=s.puz.pl[i%s.puz.pl.length].clue;
  e.style.cssText=`left:${q[0]}%;top:${q[1]}%;transform:rotate(${(i*37%40)-20}deg)`;
  return e
 }));

 // Titik-titik navigasi 4 halaman dalam level ini (hijau=selesai, ungu=aktif)
 $("dots").replaceChildren(...Array.from({length:4},(_,i)=>{
  const n=Math.floor((page-1)/4)*4+i+1;
  const b=document.createElement("button");
  b.className="dot"+(n===page?" on":"")+(done[n]?" done":"");
  b.textContent=i+1;
  b.onclick=()=>go(n);
  return b
 }));

 // Hitung ukuran sel (--cs) berdasarkan lebar layar yang tersedia, supaya grid tidak melebar keluar layar
 const cr=$("cross");
 /* Gambar petunjuk diletakkan di sel kosong TEPAT SEBELUM huruf pertama tiap kata (sel petunjuk).
    cm = peta "baris,kolom" -> daftar kata yang petunjuknya ada di sel itu.
    orow/oc = tambahan 1 baris/kolom di atas/kiri grid bila ada kata yang mulai di tepi grid. */
 const cm={};let oc=0,orow=0;
 s.puz.pl.forEach(p=>{
  const y=p.r-(p.d?1:0),x=p.c-(p.d?0:1);
  if(y<0)orow=1;if(x<0)oc=1;
  (cm[y+","+x]=cm[y+","+x]||[]).push(p)
 });
 const gp=[...(orow?[Array(g[0].length+oc).fill(null)]:[]),...g.map(row=>oc?[null,...row]:row)];
 cr.dataset.cols=g[0].length+oc;
 fit();
 cr.style.gridTemplateColumns=`repeat(${g[0].length+oc},var(--cs))`;
 cr.style.gridTemplateRows=`repeat(${gp.length},var(--cs))`; // tinggi baris dikunci = ukuran kotak, agar tidak ada baris yang melebar
 cr.replaceChildren();

 // Bangun setiap sel grid TTS (r,c = koordinat asli soal; pr,pc = posisi pada grid yang sudah diberi tepi)
 gp.forEach((row,pr)=>row.forEach((ch,pc)=>{
  const r=pr-orow,c=pc-oc;
  const cell=document.createElement("div");
  cell.className="cell";
  if(!ch){
   const cl=cm[r+","+c];
   if(cl){
    // sel petunjuk: tampilkan emoji gambar + badge nomor/arah; diketuk -> fokus ke huruf pertama kata
    cell.className="cell clue"+(cl.length>1?" two":"");
    cl.forEach(p=>{
     const e=document.createElement("span");
     e.className="cp";e.dataset.k=p.num+"_"+p.d;
     e.append(p.clue);
     
     e.onclick=()=>{const n=cellAt(p.r,p.c);if(n){dir=p.d;n.focus();hl(p.r,p.c)}};
     cell.appendChild(e)
    })
   }else cell.className="cell block" // sel kosong -> blok transparan
  }else{
   const key=r+","+c,inp=document.createElement("input");
   inp.maxLength=1;
   inp.dataset.a=ch;          // jawaban benar untuk sel ini (huruf), dipakai saat check()/hint()
   inp.dataset.k=key;         // kunci koordinat, dipakai untuk menyimpan nilai ke s.vals
   inp.dataset.r=r;inp.dataset.c=c;
   inp.autocomplete="off";inp.inputMode="text";
   // isi otomatis dengan jawaban benar jika halaman sudah selesai, kalau belum pakai isian tersimpan
   const fv=fail[page]?(fail[page].v[key]||""):null; // jawaban terkunci milik pemain bila halaman gagal
   inp.value=done[page]?(fv!==null?fv:ch):(s.vals[key]||"");
   inp.readOnly=!!done[page]; // halaman selesai/terkunci tidak bisa diubah lagi
   if(done[page])inp.style.background=(fv!==null&&fv!==ch)?"#ffe7e7":"#e5faef"; // merah muda: huruf salah (terkunci); hijau muda: benar

   // Saat mengetik: hanya terima huruf, otomatis huruf besar, simpan ke state, lalu pindah ke sel berikut
   inp.oninput=e=>{
    const v=e.target.value.replace(/[^a-zA-Z]/g,"").toUpperCase();
    e.target.value=v.slice(-1);
    s.vals[key]=e.target.value;
    if(v)advance(r,c)
   };
   inp.onkeydown=e=>arrow(e,r,c); // navigasi pakai tombol panah/backspace/enter
   inp.onfocus=()=>{setDir(r,c);hl(r,c);inp.select()}; // saat fokus: tentukan arah kata & sorot
   // deteksi klik ulang pada sel yang sama -> dipakai untuk mengganti arah (mendatar<->menurun)
   inp.onpointerdown=()=>{lastK=document.activeElement===inp?r+","+c:null};
   inp.onclick=()=>{
    if(lastK===r+","+c&&wordAt(r,c,0)&&wordAt(r,c,1)){dir^=1;hl(r,c)}
   };

   // tampilkan nomor kata di pojok sel bila sel ini adalah awal satu/lebih kata
   if(s.puz.nums[key]){
    const n=document.createElement("span");
    n.className="num";
    n.textContent=s.puz.nums[key].join("/"); // contoh "3/5" jika 2 kata mulai di sel yang sama
    cell.appendChild(n)
   }
   cell.appendChild(inp)
  }
  cr.appendChild(cell)
 }));

 // Bangun kartu-kartu petunjuk gambar, dibagi rata ke kolom kiri & kanan
 const cL=$("cluesL"),cR=$("cluesR");
 cL.replaceChildren();cR.replaceChildren();
 const arr=s.puz.pl.slice().sort((a,b)=>a.num-b.num||a.d-b.d);
 arr.forEach((p,i)=>{
  const c=document.createElement("div");
  c.className="pic";
  c.dataset.k=p.num+"_"+p.d; // kunci untuk mencocokkan dengan sorot sel (hl())
  const b=document.createElement("span");
  b.className="b";
  b.textContent=p.num+(p.d?"⬇":"➡"); // badge nomor + arah kata
  const e=document.createElement("div");
  e.className="e";
  e.textContent=p.clue; // emoji petunjuk gambar
  const m=document.createElement("small");
  m.textContent=p.word.length+" huruf";
  c.append(b,e,m);
  (i<Math.ceil(arr.length/2)?cL:cR).appendChild(c) // separuh pertama -> kiri, sisanya -> kanan
 });

 // Tampilkan pesan "sudah selesai" jika halaman ini sudah pernah dituntaskan
 fb(done[page]?(fail[page]?"🔒 Ada huruf salah (merah muda), nilai dikurangi 2 per huruf salah. Halaman terkunci, dapat +"+done[page]+" poin dan tidak bisa diulang.":"🎉 TTS ini sudah selesai! (+"+done[page]+" poin)"):"","success")
}

/* Set teks & jenis (success/error/kosong) pada area feedback */
const fb=(t,c)=>{$("feedback").textContent=t;$("feedback").className="feedback "+(c||"")};

/* Cari elemen <input> pada koordinat (r,c) tertentu di grid */
const cellAt=(r,c)=>document.querySelector(`#cross input[data-r="${r}"][data-c="${c}"]`);

let dir=0;      // arah kata yang sedang aktif: 0 = mendatar, 1 = menurun
let lastK=null; // koordinat sel yang terakhir diklik (untuk deteksi klik ganda -> ganti arah)

/* wordAt(r,c,d): cari objek kata (dari puzzle) yang melewati sel (r,c) pada arah d */
const wordAt=(r,c,d)=>S(page).puz.pl.find(p=>
 p.d===d&&(d
  ?p.c===c&&r>=p.r&&r<p.r+p.word.length   // kata menurun: kolom sama, baris dalam rentang panjang kata
  :p.r===r&&c>=p.c&&c<p.c+p.word.length)  // kata mendatar: baris sama, kolom dalam rentang panjang kata
);

/* Tentukan arah default saat sel difokus: kalau sel hanya bagian dari
   satu arah (mendatar saja / menurun saja), pakai arah itu */
function setDir(r,c){
 const a=wordAt(r,c,0),b=wordAt(r,c,1);
 if(a&&!b)dir=0;else if(b&&!a)dir=1
}

/* Sorot (highlight) semua sel & kartu petunjuk milik kata yang sedang aktif */
function hl(r,c){
 document.querySelectorAll(".cell.hl,.pic.hl,.cp.hl").forEach(x=>x.classList.remove("hl"));
 const w=wordAt(r,c,dir);
 if(!w)return;
 for(let i=0;i<w.word.length;i++){
  const n=cellAt(w.r+(dir?i:0),w.c+(dir?0:i));
  if(n)n.parentElement.classList.add("hl")
 }
 document.querySelectorAll(".pic,.cp").forEach(p=>{
  if(p.dataset.k===w.num+"_"+w.d)p.classList.add("hl")
 })
}

/* Setelah mengetik satu huruf, otomatis pindah fokus ke sel berikutnya dalam kata yang sama */
function advance(r,c){
 const w=wordAt(r,c,dir);
 if(!w)return;
 const i=dir?r-w.r:c-w.c;
 if(i<w.word.length-1){
  const n=cellAt(r+(dir?1:0),c+(dir?0:1));
  if(n)n.focus()
 }
}

/* Navigasi keyboard: panah untuk pindah sel (sekaligus menentukan arah),
   Backspace pada sel kosong mundur ke sel sebelumnya dalam kata yang sama,
   Enter langsung memicu pemeriksaan jawaban (check()) */
function arrow(e,r,c){
 const m={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowDown:[1,0],ArrowUp:[-1,0]}[e.key];
 if(m){
  const n=cellAt(r+m[0],c+m[1]);
  dir=m[0]?1:0; // panah atas/bawah -> arah menurun, kiri/kanan -> arah mendatar
  if(n){n.focus();e.preventDefault()}else hl(r,c)
 }else if(e.key==="Backspace"&&!e.target.value){
  const w=wordAt(r,c,dir);
  if(w&&(dir?r>w.r:c>w.c)){
   const n=cellAt(r-(dir?1:0),c-(dir?0:1));
   if(n){n.focus();e.preventDefault()}
  }
 }else if(e.key==="Enter")check()
}

/* =====================================================================
   AKSI PEMAIN: PERIKSA, PETUNJUK, ULANG, TIMER
   ===================================================================== */

/* check(): periksa semua isian di grid.
   - Jika ada kotak kosong -> tampilkan pesan error jumlah kotak kosong
   - Jika ada huruf salah -> tandai merah & tampilkan pesan error
   - Jika semua benar & halaman belum pernah selesai -> hitung poin,
     simpan progres, tampilkan efek confetti, cek apakah level selesai */
function check(){
 const ins=[...document.querySelectorAll("#cross input")];
 let w=0,e=0; // w = jumlah huruf salah, e = jumlah kotak kosong
 ins.forEach(i=>{
  const v=i.value.toUpperCase();
  if(!v)e++;
  else if(v!==i.dataset.a)w++
 });

 if(done[page])return; // halaman selesai/terkunci tidak bisa dicek ulang
 if(e)return fb(`Masih ada ${e} kotak kosong. Isi semua kotak dulu ya!`,"error"); // belum dinilai, tanpa pengurangan
 // Semua kotak terisi -> ini satu-satunya kesempatan menjawab halaman ini
 const s=S(page);
 const pts=Math.max(1,10-2*s.hints-2*w); // 10 − 2/petunjuk − 2/huruf salah, minimal 1
 done[page]=pts;
 if(w)fail[page]={v:{...s.vals}}; // ada yang salah -> halaman terkunci, jawaban pemain disimpan
 else celebrate();
 const L=Math.floor((page-1)/4)+1,L0=(L-1)*4;
 if([1,2,3,4].every(i=>done[L0+i]))finishLevel(L); // skor muncul saat level selesai
 else{save();toast(w?`❌ ${w} huruf salah (−${2*w} poin). Halaman terkunci dan tidak bisa diulang.`:"✅ Halaman selesai! Selesaikan 4 halaman untuk mendapat skor level.")}
 render() // render ulang untuk menampilkan status "selesai"/"terkunci"
}

/* hint(): buka satu huruf yang masih salah/kosong secara otomatis.
   Tidak bisa dipakai jika halaman sudah selesai. Menambah hitungan
   hints (mengurangi poin maksimal yang bisa didapat di halaman ini). */
function hint(){
 if(done[page])return;
 const s=S(page);
 const t=[...document.querySelectorAll("#cross input")].find(i=>i.value.toUpperCase()!==i.dataset.a);
 if(!t)return fb("Semua huruf sudah benar!","success");
 t.value=t.dataset.a;
 s.vals[t.dataset.k]=t.value;
 s.hints++;
 t.style.background="#fff4c7"; // kuning: sel hasil petunjuk
 t.focus();
 fb("💡 Satu huruf dibantu (−2 poin di halaman ini).","")
}

/* reset(): kosongkan semua isian di halaman ini (tidak bisa dipakai
   jika halaman sudah pernah diselesaikan) */
function reset(){
 if(done[page])return;
 const s=S(page);
 s.vals={};
 render()
}

/* ---------- TIMER BERMAIN ---------- */
let tmr=null;
function fmt(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function warn(b){$("timer").parentElement.classList.toggle("warn",b)}
function showT(){$("timer").textContent=fmt(left);warn(left<=10&&left>0)}
/* tick(): hitung mundur 1 detik; jika habis -> timeUp() */
function tick(){left=Math.max(0,left-1);showT();if(left<=0)timeUp()}
function stopTimer(){clearInterval(tmr);tmr=null}
/* beginLevel(L): mulai hitung mundur sesuai batas waktu level (tidak jalan jika level sudah selesai) */
function beginLevel(L){
 lv=L;stopTimer();
 if([1,2,3,4].every(i=>done[(L-1)*4+i])){$("timer").textContent="Selesai ✔";warn(false);return}
 left=LIMITS[L-1];showT();tmr=setInterval(tick,1000)
}
/* finishLevel(L): skor level = poin 4 halaman + bonus waktu (1 poin per 5 detik sisa) */
function finishLevel(L){
 const base=[1,2,3,4].reduce((a,i)=>a+done[(L-1)*4+i],0),bonus=Math.floor(left/5);
 stopTimer();
 $("timer").textContent="Selesai ✔";warn(false);
 if(!lvScore[L]){lvScore[L]=base+bonus;logH({l:L,s:lvScore[L],bn:bonus})}
 $("score").textContent=total();
 save();
 nextL=L<4?L+1:0;
 showEnd("🎉","Level "+L+" Selesai!","Skor Level "+L+": "+lvScore[L]+" (halaman "+base+" + bonus waktu "+bonus+"). Total skor kamu: "+total()+".")
}
function timeUp(){
 stopTimer();nextL=0;logH({l:lv,s:0,x:1});save();
 showEnd("⏰","Waktu Telah Habis!","Waktu Level "+lv+" sudah habis. Jangan menyerah, coba lagi ya! Ini papan skornya:")
}
function showEnd(ico,t,m){
 $("eIco").textContent=ico;$("eTitle").textContent=t;$("eMsg").textContent=m;
 $("eNext").style.display=nextL?"":"none";
 $("board2").innerHTML=$("board").innerHTML;
 setTimeout(()=>{$("board2").innerHTML=$("board").innerHTML},1000);
 $("end").classList.add("show")
}
/* openScore(): tampilkan jendela papan skor (dari beranda atau dengan mengetuk kapsul ⭐ skor) */
/* logH(o): catat satu kejadian (level selesai / waktu habis) ke riwayat skor pemain */
function logH(o){o.t=Date.now();hist.push(o);hist=hist.slice(-30);ls("lc_hist_"+me.id,JSON.stringify(hist))}
const LVC=["#16a34a","#2563eb","#ea580c","#9333ea"];
/* openScore(): jendela riwayat skor = skor total, skor tiap level, riwayat kejadian, dan peringkat */
function openScore(){
 const n=[1,2,3,4].filter(l=>lvScore[l]!=null).length;
 $("scTot").textContent=total();
 $("scName").textContent=(me&&me.name?me.name:"Pemain")+" • "+n+"/4 level selesai";
 $("scBar").style.width=n*25+"%";
 $("scLv").innerHTML=[1,2,3,4].map(l=>'<div class="lc" style="--c:'+LVC[l-1]+'"><small>Level '+l+'</small><b>'+(lvScore[l]!=null?lvScore[l]:"–")+'</b><span>'+(lvScore[l]!=null?"✅":"⏳")+'</span></div>').join("");
 const hs=hist.slice().reverse();
 $("scHist").innerHTML=hs.length?hs.map(x=>'<div class="h"><i>'+(x.x?"⏰":"🎉")+'</i><div><b>Level '+x.l+(x.x?" waktu habis":" selesai • +"+x.s)+'</b><small>'+new Date(x.t).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})+(x.x?"":" • bonus waktu "+x.bn)+'</small></div></div>').join(""):'<p class="note">Belum ada riwayat. Selesaikan satu level dulu!</p>';
 $("sc").classList.add("show")
}
function closeScore(){$("sc").classList.remove("show")}
$("score").parentElement.onclick=openScore;$("score").parentElement.style.cursor="pointer";
/* restartAll(): HAPUS SEMUA progres pemain (halaman selesai, skor level, halaman terkunci, riwayat)
   sehingga permainan bisa dimulai lagi dari awal (Level 1, halaman 1). */
async function restartAll(){
 const n=me.name||$("nameIn").value.trim().slice(0,16);
 if(!n){$("nameIn").focus();toast("Isi nama dulu ya 🙂");return}
 if(!confirm("Mulai dari awal?\nSemua progres, skor, dan halaman terkunci milik "+n+" akan dihapus dan tidak bisa dikembalikan."))return;
 me.name=n;
 me.id="p_"+(n.toLowerCase().replace(/[^a-z0-9]/g,"").slice(0,24)||"anon");
 $("who").textContent=n;
 // kosongkan semua state di memori
 done={};lvScore={};fail={};hist=[];nextL=0;lv=0;
 Object.keys(st).forEach(k=>delete st[k]); // buang isian & hint tiap halaman
 stopTimer();warn(false);$("timer").textContent="00:00";
 $("score").textContent=0;
 // hapus data tersimpan di perangkat (termasuk baris papan skor lokal milik pemain)
 ["lc_done_","lc_lv_","lc_fail_","lc_hist_"].forEach(k=>{try{localStorage.removeItem(k+me.id)}catch(e){}});
 try{const b=JSON.parse(ls("lc_board")||"{}");delete b[me.id];ls("lc_board",JSON.stringify(b));if(!db)drawBoard(Object.values(b))}catch(e){}
 // papan skor bersama: hapus dokumen pemain (jika gagal, timpa dengan skor kosong)
 if(db){
  try{await db.doc("scores/"+me.id).delete()}
  catch(e){try{await db.doc("scores/"+me.id).set({name:me.name,score:0,solved:0,pages:{},lv:{},fail:{},updated:Date.now()})}catch(e2){}}
 }
 closeScore();$("end").classList.remove("show");
 prog();show("home");
 toast("🔄 Progres dihapus. Kamu bisa mulai dari awal!")
}
function endHome(){$("end").classList.remove("show");home()}
function endNext(){
 $("end").classList.remove("show");
 const L=nextL;let n=(L-1)*4+1;while(n<L*4&&done[n])n++;
 enter(n)
}

/* celebrate(): efek confetti — membuat 26 emoji jatuh dari atas layar
   dengan posisi & delay acak, lalu menghapusnya setelah animasi selesai */
function celebrate(){
 for(let i=0;i<26;i++){
  const s=document.createElement("span");
  s.className="cf";
  s.textContent=["🎉","⭐","🎈","✨","🌟"][i%5];
  s.style.left=Math.random()*95+"%";
  s.style.animationDelay=Math.random()*.8+"s";
  document.body.appendChild(s);
  setTimeout(()=>s.remove(),3500)
 }
}

/* =====================================================================
   PENYIMPANAN SKOR
   Skor disimpan bersama lewat database (jika tersedia lewat window.claude),
   jika tidak tersedia/izin ditolak, disimpan lokal di perangkat (localStorage)
   ===================================================================== */

/* save(): simpan progres halaman & skor total, baik ke localStorage
   (selalu) maupun ke database bersama (jika ada koneksi db) */
async function save(){
 ls("lc_done_"+me.id,JSON.stringify(done)); // progres per-halaman disimpan lokal
 ls("lc_lv_"+me.id,JSON.stringify(lvScore)); // skor tiap level
 ls("lc_fail_"+me.id,JSON.stringify(fail)); // halaman terkunci

 const rec={name:me.name,score:total(),solved:Object.keys(lvScore).length,pages:done,lv:lvScore,fail:fail,updated:Date.now()};

 if(db){
  try{
   await db.doc("scores/"+me.id).set(rec) // simpan ke papan skor bersama
  }catch(e){
   $("mode").textContent="Skor hanya tersimpan di perangkat ini (tidak punya izin menulis papan skor bersama)."
  }
 }else{
  // tanpa db: simpan papan skor gabungan semua pemain (di perangkat ini saja) ke localStorage
  let b={};
  try{b=JSON.parse(ls("lc_board")||"{}")}catch(e){}
  b[me.id]=rec;
  ls("lc_board",JSON.stringify(b));
  drawBoard(Object.values(b))
 }
}

/* drawBoard(rows): render tabel papan skor, urut skor tertinggi dulu
   (jika skor sama, yang lebih dulu update yang di atas), maksimal 20 baris */
function drawBoard(rows){
 rows=rows.sort((a,b)=>b.score-a.score||a.updated-b.updated).slice(0,20);
 const tb=$("board");
 tb.replaceChildren();
 if(!rows.length){
  tb.innerHTML='<tr><td colspan="4" class="note">Belum ada skor. Jadilah yang pertama!</td></tr>';
  return
 }
 rows.forEach((r,i)=>{
  const tr=document.createElement("tr");
  if(r.name===me.name)tr.className="me"; // sorot baris milik pemain saat ini
  [["🥇","🥈","🥉"][i]||i+1,r.name,r.score,(r.solved||0)+"/4"].forEach(v=>{
   const td=document.createElement("td");
   td.textContent=v;
   tr.appendChild(td)
  });
  tb.appendChild(tr)
 })
}

/* =====================================================================
   INISIALISASI SAAT HALAMAN DIMUAT (Immediately Invoked Function)
   - Isi kembali nama pemain terakhir (jika ada) ke input nama
   - Gambar papan skor dari localStorage sebagai tampilan awal
   - Coba sambungkan ke database bersama ("db") lewat window.claude;
     jika berhasil, papan skor akan live-update untuk semua pemain;
     jika gagal/tidak tersedia, tetap pakai mode lokal per perangkat
   ===================================================================== */
(async()=>{
 const n=ls("lc_name");
 if(n)$("nameIn").value=n;

 let b=[];
 try{b=Object.values(JSON.parse(ls("lc_board")||"{}"))}catch(e){}
 drawBoard(b);

 try{
  const c=window.claude&&await window.claude.use("db");
  if(c){
   db=c;
   // dengarkan perubahan papan skor bersama secara real-time (onSnapshot)
   db.collection("scores").orderBy("score","desc").limit(20)
    .onSnapshot(s=>drawBoard(s.docs.map(d=>d.data())),()=>{db=null});
   $("mode").textContent="🌐 Papan skor bersama aktif — semua pemain terlihat langsung."
  }else{
   $("mode").textContent="Mode perangkat ini: papan skor tersimpan di browser."
  }
 }catch(e){
  $("mode").textContent="Mode perangkat ini: papan skor tersimpan di browser."
 }
})();

prog(); // tampilkan status level (terkunci/terbuka) segera saat halaman dimuat

