/*
 * Halaman Solusi 3R (solusi.html)
 * Akhir jalur selokan dan jalur tempat sampah: pengguna belajar cara mencegah
 * perjalanan tadi, lalu mengerjakan kuis.
 */
JP.saatSiap(function () {
  var pos3R = document.querySelector('#pos-3r');
  var kuis = document.querySelector('#kuis');
  var akhir = document.querySelector('#akhir');
  var tombolKuis = document.querySelector('#tombol-kuis');

  JP.tampil(kuis, false);
  JP.tampil(akhir, false);
  JP.tampil(tombolKuis, false);

  // 1. Teks pembuka menyesuaikan jalur sebelumnya
  var jalur = JP.param('jalur', 'selokan');
  if (jalur === 'tps') {
    JP.setPanel('#panel', 'Kita bisa mencegahnya',
      'Botolmu memang tidak sampai ke laut, tetapi tertimbun ratusan tahun dan membuat TPA makin penuh. Kabar baiknya, sampah yang menumpuk di TPA bisa dikurangi dari rumah. Pilih ketiga langkah di depanmu.');
  } else {
    JP.setPanel('#panel', 'Kita bisa mencegahnya',
      'Botol tadi sampai ke piringmu karena satu keputusan kecil, yaitu dibuang ke selokan. Kabar baiknya, keputusan kecil juga bisa menghentikannya. Pilih ketiga langkah di depanmu.');
  }

  // Model botol isi ulang terlihat terlalu gelap karena bahan metalik, jadi diterangkan
  document.querySelector('#obj-kurangi').addEventListener('model-loaded', function (e) {
    e.detail.model.traverse(function (node) {
      if (node.isMesh && node.material) {
        node.material.metalness = 0.15;
        node.material.roughness = 0.45;
      }
    });
  });

  // 2. Biji plastik hasil daur ulang
  var objDaur = document.querySelector('#obj-daur');
  var warna = ['#1F5FD1', '#2DB37A', '#F2C230', '#FFFFFF', '#E8562A'];
  for (var i = 0; i < 45; i++) {
    var b = document.createElement('a-sphere');
    var r = JP.acak(0, 0.18);
    var sudut = JP.acak(0, Math.PI * 2);
    b.setAttribute('radius', 0.025);
    b.setAttribute('position', (Math.cos(sudut) * r).toFixed(3) + ' ' + ((0.18 - r) * 0.8 + 0.02).toFixed(3) + ' ' + (Math.sin(sudut) * r).toFixed(3));
    b.setAttribute('color', warna[i % warna.length]);
    objDaur.appendChild(b);
  }

  // 3. Info tiap pos 3R
  var info = {
    kurangi: ['Kurangi',
      'Sampah terbaik adalah sampah yang tidak pernah ada. Bawa botol minum sendiri dan tolak kantong plastik sekali pakai, maka botol seperti tadi tidak perlu dibuat.'],
    ulang: ['Gunakan ulang',
      'Sebelum dibuang, beri botol kesempatan kedua. Botol bekas bisa menjadi pot tanaman, tempat alat tulis, atau wadah di dapur.'],
    daur: ['Daur ulang',
      'Kalau memang harus dibuang, pilah lalu setor ke bank sampah. Botolmu tidak lagi berakhir di laut, tetapi berubah menjadi barang baru sekaligus tabungan.']
  };
  var sudahDilihat = {};

  function lihatPos(kunci) {
    JP.setPanel('#panel', info[kunci][0], info[kunci][1]);
    sudahDilihat[kunci] = true;
    if (Object.keys(sudahDilihat).length === 3) JP.tampil(tombolKuis, true);
  }

  ['kurangi', 'ulang', 'daur'].forEach(function (kunci) {
    document.querySelector('#tombol-' + kunci).addEventListener('tekan', function () { lihatPos(kunci); });
    JP.saatKlik(document.querySelector('#obj-' + kunci), function () { lihatPos(kunci); });
  });

  // 4. Kuis
  var soal = [
    {
      tanya: 'Berapa lama perkiraan waktu yang dibutuhkan botol plastik untuk terurai?',
      pilihan: ['Sekitar 1 tahun', 'Sekitar 50 tahun', 'Sekitar 450 tahun'],
      benar: 2,
      bahas: 'Botol plastik diperkirakan butuh sekitar 450 tahun untuk terurai, jauh lebih lama dari umur manusia.'
    },
    {
      tanya: 'Apa yang dimaksud dengan mikroplastik?',
      pilihan: ['Plastik khusus untuk microwave', 'Serpihan plastik sangat kecil hasil pecahan sampah plastik', 'Plastik yang cepat terurai di alam'],
      benar: 1,
      bahas: 'Mikroplastik adalah serpihan plastik sangat kecil. Ia mudah tertelan hewan laut dan bisa masuk ke rantai makanan manusia.'
    },
    {
      tanya: 'Mana cara paling efektif untuk mengurangi sampah botol plastik?',
      pilihan: ['Membakarnya di halaman rumah', 'Membawa botol minum isi ulang', 'Membuangnya ke sungai agar terbawa arus'],
      benar: 1,
      bahas: 'Membawa botol isi ulang mencegah sampah muncul sejak awal. Membakar plastik justru menghasilkan asap berbahaya.'
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

      // Tandai jawaban benar (hijau) dan jawaban salah yang dipilih (merah)
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

  function selesaiKuis() {
    JP.tampil(kuis, false);
    JP.tampil(akhir, true);
    JP.setUmur('kini ada di tanganmu');
    var pesan = skor === soal.length
      ? 'Sempurna! Botol tadi hanyalah satu dari sekian banyak. Perjalanannya berakhir di sini, tetapi perubahan dimulai dari tanganmu.'
      : 'Botol tadi hanyalah satu dari sekian banyak. Perjalanannya berakhir di sini, tetapi perubahan dimulai dari tanganmu. Coba lihat juga jalur bank sampah.';
    JP.setPanel('#panel', 'Skor kamu ' + skor + ' dari ' + soal.length, pesan);
  }

  tombolKuis.addEventListener('tekan', function () {
    JP.tampil(pos3R, false);
    JP.tampil(kuis, true);
    nomor = 0;
    skor = 0;
    tampilkanSoal();
  });

  // 5. Lihat jalur bank sampah yang berakhir di pabrik daur ulang
  document.querySelector('#tombol-jalur-lain').addEventListener('tekan', function () {
    JP.pindah('daurulang.html', { jalur: 'bank' });
  });
});
