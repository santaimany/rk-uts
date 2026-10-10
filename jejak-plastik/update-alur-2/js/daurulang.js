/*
 * Halaman Pabrik Daur Ulang (daurulang.html)
 * Akhir jalur bank sampah.
 * Pengguna mengikuti botol melewati tahap pilah, cacah dan cuci, lelehkan,
 * lalu melihat produk hasil daur ulang dan mengerjakan kuis.
 */
JP.saatSiap(function () {
  var botol = document.querySelector('#botol');
  var serpihan = document.querySelector('#serpihan');
  var bijiPlastik = document.querySelector('#biji-plastik');
  var etalase = document.querySelector('#etalase');
  var tombolTahap = document.querySelector('#tombol-tahap');
  var tombolKuis = document.querySelector('#tombol-kuis');
  var kuis = document.querySelector('#kuis');
  var akhir = document.querySelector('#akhir');

  JP.tampil(etalase, false);
  JP.tampil(tombolKuis, false);
  JP.tampil(kuis, false);
  JP.tampil(akhir, false);

  var warna = ['#CFEFFF', '#BDE6F7', '#E4F6FF'];

  // 1. Siapkan serpihan cacahan dan biji plastik (awalnya tersembunyi)
  for (var i = 0; i < 24; i++) {
    var s = document.createElement('a-box');
    s.setAttribute('width', 0.09); s.setAttribute('height', 0.02); s.setAttribute('depth', 0.07);
    s.setAttribute('position', JP.acak(-0.15, 0.15).toFixed(2) + ' 0 ' + JP.acak(-0.2, 0.2).toFixed(2));
    s.setAttribute('rotation', '0 ' + JP.acak(0, 180).toFixed(0) + ' 0');
    s.setAttribute('color', warna[i % warna.length]);
    serpihan.appendChild(s);
  }
  for (var j = 0; j < 40; j++) {
    var b = document.createElement('a-sphere');
    var r = JP.acak(0, 0.18);
    var sudut = JP.acak(0, Math.PI * 2);
    b.setAttribute('radius', 0.03);
    b.setAttribute('position', (Math.cos(sudut) * r).toFixed(3) + ' ' + ((0.18 - r) * 0.6).toFixed(3) + ' ' + (Math.sin(sudut) * r * 0.8).toFixed(3));
    b.setAttribute('color', warna[j % warna.length]);
    bijiPlastik.appendChild(b);
  }
  bijiPlastik.setAttribute('visible', false);

  // 2. Teks pembuka
  JP.setPanel('#panel', 'Pilihan tepat!',
    'Di bank sampah botolmu ditimbang dan dicatat sebagai tabungan, lalu dikirim ke tempat daur ulang. Ikuti tahap demi tahap bagaimana botol bekas diolah menjadi barang baru.');

  // 3. Urutan tahap pengolahan
  var tahap = [
    {
      umur: 'dipilah',
      judul: 'Tahap 1: Pilah',
      isi: 'Petugas memisahkan botol berdasarkan jenis plastik dan warnanya. Tutup dan label dilepas karena terbuat dari jenis plastik yang berbeda dengan badan botol.',
      tombol: 'Lanjut ke pencacahan',
      aksi: function () {
        botol.setAttribute('animation__geser', { property: 'position', to: '-2.4 0.92 -2.8', dur: 1500, easing: 'easeInOutSine' });
        // tutup biru dan label hijau "terbang" ke wadahnya masing-masing
        terbang('#1F5FD1', 'cylinder', '-2.4 1.4 -2.8', '-2.4 0.4 -2.2');
        terbang('#2DB37A', 'box', '-2.4 1.1 -2.8', '-2.0 0.4 -2.2');
      }
    },
    {
      umur: 'menjadi serpihan',
      judul: 'Tahap 2: Cacah dan cuci',
      isi: 'Botol dimasukkan ke mesin pencacah hingga menjadi serpihan kecil. Serpihan lalu dicuci untuk membuang sisa minuman, lem label, dan kotoran.',
      tombol: 'Lanjut ke pelelehan',
      aksi: function () {
        botol.setAttribute('animation__masuk', { property: 'position', to: '-0.8 0.92 -2.8', dur: 1500, easing: 'easeInOutSine' });
        botol.setAttribute('animation__hilang', { property: 'scale', to: '0.01 0.01 0.01', dur: 400, delay: 1300 });
        setTimeout(function () {
          serpihan.setAttribute('visible', true);
          serpihan.setAttribute('animation__keluar', { property: 'position', from: '-0.4 0.94 -2.8', to: '0.2 0.94 -2.8', dur: 1500 });
        }, 1800);
      }
    },
    {
      umur: 'menjadi biji plastik',
      judul: 'Tahap 3: Lelehkan',
      isi: 'Serpihan yang bersih dilelehkan dengan panas tinggi, lalu dicetak menjadi butiran kecil yang disebut biji plastik. Biji plastik inilah bahan baku untuk barang baru.',
      tombol: 'Lihat hasilnya',
      aksi: function () {
        serpihan.setAttribute('animation__masuk', { property: 'position', to: '0.8 0.94 -2.8', dur: 1200 });
        setTimeout(function () { serpihan.setAttribute('visible', false); }, 1200);
        var cahaya = document.querySelector('#cahaya-leleh');
        cahaya.setAttribute('animation__panas', {
          property: 'material.opacity', from: 0.4, to: 1, dir: 'alternate', loop: 4, dur: 300
        });
        setTimeout(function () {
          bijiPlastik.setAttribute('visible', true);
          bijiPlastik.setAttribute('animation__muncul', { property: 'scale', from: '0.1 0.1 0.1', to: '1 1 1', dur: 800, easing: 'easeOutBack' });
        }, 2200);
      }
    },
    {
      umur: 'hidup kembali sebagai barang baru',
      judul: 'Tahap 4: Menjadi barang baru',
      isi: 'Botolmu sekarang menjadi bahan untuk barang baru. Pilih setiap produk di meja depanmu untuk melihat apa saja yang bisa dibuat dari plastik daur ulang.',
      tombol: '',
      aksi: function () {
        JP.tampil(etalase, true);
        etalase.setAttribute('animation__naik', { property: 'position', from: '0 -0.7 -1.8', to: '0 0.3 -1.8', dur: 900, easing: 'easeOutQuad' });
      }
    }
  ];

  var nomorTahap = -1;

  function terbang(warnaObjek, bentuk, dari, ke) {
    var o = document.createElement('a-' + bentuk);
    if (bentuk === 'cylinder') { o.setAttribute('radius', 0.035); o.setAttribute('height', 0.045); }
    else { o.setAttribute('width', 0.15); o.setAttribute('height', 0.1); o.setAttribute('depth', 0.02); }
    o.setAttribute('color', warnaObjek);
    o.setAttribute('position', dari);
    o.setAttribute('animation', { property: 'position', to: ke, dur: 1000, delay: 1500, easing: 'easeInQuad' });
    document.querySelector('a-scene').appendChild(o);
  }

  tombolTahap.addEventListener('tekan', function () {
    nomorTahap++;
    var t = tahap[nomorTahap];
    JP.setUmur(t.umur);
    JP.setPanel('#panel', t.judul, t.isi);
    t.aksi();

    JP.tampil(tombolTahap, false);
    if (t.tombol) {
      // tombol muncul lagi setelah animasi tahap selesai
      setTimeout(function () {
        tombolTahap.setAttribute('tombol', 'teks', t.tombol);
        JP.tampil(tombolTahap, true);
      }, 3200);
    }
  });

  // 4. Info tiap produk hasil daur ulang
  var produk = {
    kaos: ['Kaos', 'Biji plastik dari botol PET bisa dipintal menjadi serat polyester. Serat ini ditenun menjadi kain untuk kaos, jaket, dan seragam olahraga.'],
    tas: ['Tas belanja', 'Kain dari serat plastik daur ulang juga dibuat menjadi tas belanja yang kuat dan bisa dipakai berkali-kali, pengganti kantong plastik sekali pakai.'],
    pot: ['Pot tanaman', 'Plastik daur ulang bisa dicetak ulang menjadi pot tanaman, ember, dan berbagai perabot rumah tangga.'],
    paving: ['Paving block', 'Sebagian sampah plastik dicampur dengan pasir lalu dicetak menjadi paving block untuk halaman, jalan setapak, dan trotoar.']
  };
  var sudahDilihat = {};

  Object.keys(produk).forEach(function (kunci) {
    JP.saatKlik(document.querySelector('#produk-' + kunci), function () {
      JP.setPanel('#panel', produk[kunci][0], produk[kunci][1]);
      sudahDilihat[kunci] = true;
      if (Object.keys(sudahDilihat).length === 4) JP.tampil(tombolKuis, true);
    });
  });
  JP.tampil(etalase, false); // produk ikut tidak bisa diklik sebelum tahap 4

  // 5. Kuis
  var soal = [
    {
      tanya: 'Mengapa tutup dan label dilepas sebelum botol didaur ulang?',
      pilihan: ['Supaya botol lebih ringan', 'Karena jenis plastiknya berbeda dengan badan botol', 'Karena tutup tidak bisa dipakai lagi'],
      benar: 1,
      bahas: 'Tutup, label, dan badan botol terbuat dari jenis plastik yang berbeda, jadi harus dipisahkan agar hasil daur ulangnya bagus.'
    },
    {
      tanya: 'Serpihan plastik yang dilelehkan lalu dicetak menjadi butiran kecil disebut apa?',
      pilihan: ['Biji plastik', 'Serat kain', 'Mikroplastik'],
      benar: 0,
      bahas: 'Butiran itu disebut biji plastik, bahan baku untuk membuat barang plastik baru.'
    },
    {
      tanya: 'Serat dari botol PET daur ulang bisa dibuat menjadi apa?',
      pilihan: ['Kaca jendela', 'Kertas buku', 'Kain untuk kaos dan tas'],
      benar: 2,
      bahas: 'Botol PET bisa diolah menjadi serat polyester yang ditenun menjadi kain untuk kaos, jaket, dan tas.'
    }
  ];

  var nomor = 0;
  var skor = 0;
  var sudahMenjawab = false;
  var tombolJawab = [0, 1, 2].map(function (n) { return document.querySelector('#jawaban-' + n); });
  var tombolBerikut = document.querySelector('#tombol-soal-berikut');

  function tampilkanSoal() {
    var s = soal[nomor];
    sudahMenjawab = false;
    JP.setPanel('#panel', 'Soal ' + (nomor + 1) + ' dari ' + soal.length, s.tanya);
    tombolJawab.forEach(function (t, idx) {
      t.setAttribute('tombol', { teks: s.pilihan[idx], warna: '' });
      JP.tampil(t, true);
    });
    JP.tampil(tombolBerikut, false);
  }

  tombolJawab.forEach(function (t, idx) {
    t.addEventListener('tekan', function () {
      if (sudahMenjawab) return;
      sudahMenjawab = true;
      var s = soal[nomor];
      var benar = idx === s.benar;
      if (benar) skor++;

      tombolJawab[s.benar].setAttribute('tombol', 'warna', JP.PALET.benar);
      if (!benar) t.setAttribute('tombol', 'warna', JP.PALET.salah);

      JP.setPanel('#panel', benar ? 'Benar!' : 'Belum tepat', s.bahas);
      tombolBerikut.setAttribute('tombol', 'teks', nomor === soal.length - 1 ? 'Lihat skor' : 'Soal berikutnya');
      JP.tampil(tombolBerikut, true);
    });
  });

  tombolBerikut.addEventListener('tekan', function () {
    nomor++;
    if (nomor < soal.length) tampilkanSoal();
    else selesaiKuis();
  });

  tombolKuis.addEventListener('tekan', function () {
    JP.tampil(etalase, false);
    JP.tampil(tombolKuis, false);
    JP.tampil(kuis, true);
    nomor = 0;
    skor = 0;
    tampilkanSoal();
  });

  function selesaiKuis() {
    JP.tampil(kuis, false);
    JP.tampil(akhir, true);
    JP.setUmur('tidak berakhir sebagai sampah');
    var pesan = skor === soal.length
      ? 'Sempurna! Botol yang dipilah dengan benar tidak berakhir di laut, tetapi kembali berguna. Sekarang giliranmu memilah sampah di rumah.'
      : 'Botol yang dipilah dengan benar tidak berakhir di laut, tetapi kembali berguna. Coba lihat juga apa yang terjadi kalau botol dibuang ke selokan.';
    JP.setPanel('#panel', 'Skor kamu ' + skor + ' dari ' + soal.length, pesan);
  }

  // 6. Lihat jalur selokan
  document.querySelector('#tombol-jalur-lain').addEventListener('tekan', function () {
    JP.pindah('sungai.html', { jalur: 'selokan' });
  });
});
