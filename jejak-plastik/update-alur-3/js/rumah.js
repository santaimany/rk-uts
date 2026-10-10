/*
 * Halaman 1 : Rumah (index.html)
 * Pengguna memilih ke mana botol dibuang. Pilihan menentukan jalur cerita.
 */
JP.saatSiap(function () {
  var pengantar = document.querySelector('#pengantar');
  var pilihan = document.querySelector('#pilihan');
  var botol = document.querySelector('#botol');

  // Tahap 1 -> Tahap 2
  document.querySelector('#tombol-mulai').addEventListener('tekan', function () {
    JP.tampil(pengantar, false);
    JP.tampil(pilihan, true);
  });

  // Daftar pilihan: [id tombol, id objek tujuan, halaman berikutnya, jalur]
  var daftar = [
    ['#pilih-selokan', '#obj-selokan', 'sungai.html', 'selokan'],
    ['#pilih-tempat-sampah', '#obj-tempat-sampah', 'tpa.html', 'tps'],
    ['#pilih-bank-sampah', '#obj-bank-sampah', 'solusi.html', 'bank']
  ];

  var sudahMemilih = false;

  function pilih(objTujuan, halaman, jalur) {
    if (sudahMemilih) return;
    sudahMemilih = true;

    // Matikan semua tombol agar tidak terpilih dua kali
    daftar.forEach(function (d) { JP.tampil(document.querySelector(d[0]), false); });

    // Botol "terbang" ke tujuan yang dipilih
    var tujuan = document.querySelector(objTujuan).object3D.position;
    botol.setAttribute('animation__lempar', {
      property: 'position',
      to: tujuan.x + ' 0.4 ' + tujuan.z,
      dur: 1200,
      easing: 'easeInOutQuad'
    });
    botol.setAttribute('animation__putar', { property: 'rotation', to: '0 0 200', dur: 1200 });

    setTimeout(function () { JP.pindah(halaman, { jalur: jalur }); }, 1500);
  }

  daftar.forEach(function (d) {
    document.querySelector(d[0]).addEventListener('tekan', function () { pilih(d[1], d[2], d[3]); });
    // Objeknya sendiri juga bisa diklik
    JP.saatKlik(document.querySelector(d[1]), function () { pilih(d[1], d[2], d[3]); });
  });

  // Sembunyikan tahap 2 di awal (tombol dan objeknya ikut tidak bisa diklik)
  JP.tampil(pilihan, false);
});
