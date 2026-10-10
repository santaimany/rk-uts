/*
 * Halaman TPA (tpa.html)
 * Jalur tempat sampah: sampah dipadatkan, ditimbun tanah, lalu pengguna
 * memutar waktu untuk melihat botol tetap utuh di bawah tanah.
 */
JP.saatSiap(function () {
  var gunungan = document.querySelector('#gunungan');
  var botol = document.querySelector('#botol');
  var teksTahun = document.querySelector('#teks-tahun');
  var matahari = document.querySelector('#matahari');
  var tombolLanjut = document.querySelector('#tombol-lanjut');

  JP.tampil(tombolLanjut, false);

  // 1. Gunungan sampah: beberapa bukit besar + serpihan warna-warni
  var bukit = [
    // [x, z, radius, tinggi]
    [-3.5, -8, 3.2, 2.6], [1.5, -9.5, 4, 3.4], [5.5, -7, 2.8, 2.2], [-6.5, -5.5, 2.2, 1.6], [3.8, -4.6, 1.6, 1]
  ];
  bukit.forEach(function (b) {
    var g = document.createElement('a-sphere');
    g.setAttribute('radius', b[2]);
    g.setAttribute('scale', '1 ' + (b[3] / b[2]).toFixed(2) + ' 1');
    g.setAttribute('position', b[0] + ' 0 ' + b[1]);
    g.setAttribute('color', '#7B6E58');
    g.setAttribute('segments-width', 10);
    g.setAttribute('segments-height', 8);
    g.setAttribute('material', 'flatShading: true; roughness: 1');
    gunungan.appendChild(g);
  });

  var warnaSampah = ['#E8562A', '#F2C230', '#FFFFFF', '#3E7CF2', '#D94F8C', '#2DB37A', '#2B2B2B'];
  for (var i = 0; i < 70; i++) {
    var b = bukit[i % bukit.length];
    var sudut = JP.acak(0, Math.PI * 2);
    var jarak = JP.acak(0, b[2] * 0.85);
    var x = b[0] + Math.cos(sudut) * jarak;
    var z = b[1] + Math.sin(sudut) * jarak;
    // tinggi permukaan bukit (elips) di titik tersebut
    var y = b[3] * Math.sqrt(Math.max(0, 1 - Math.pow(jarak / b[2], 2)));
    var s = document.createElement('a-box');
    s.setAttribute('width', JP.acak(0.15, 0.45));
    s.setAttribute('height', 0.06);
    s.setAttribute('depth', JP.acak(0.15, 0.35));
    s.setAttribute('position', x.toFixed(2) + ' ' + y.toFixed(2) + ' ' + z.toFixed(2));
    s.setAttribute('rotation', JP.acak(-30, 30) + ' ' + JP.acak(0, 180) + ' ' + JP.acak(-30, 30));
    s.setAttribute('color', warnaSampah[i % warnaSampah.length]);
    gunungan.appendChild(s);
  }

  // 2. Truk datang membawa sampah
  document.querySelector('#truk').setAttribute('animation__datang', {
    property: 'position', to: '-4.6 0 -5.8', dur: 5000, easing: 'easeOutQuad'
  });

  // 3. Interaksi utama: tiga langkah berurutan dengan satu tombol
  var tombolAksi = document.querySelector('#tombol-aksi');
  var gundukan = document.querySelector('#gundukan-depan');
  var alatBerat = document.querySelector('#alat-berat');
  var tanah = document.querySelector('#tanah-penutup');
  var langkah = 0;

  function padatkan() {
    JP.setUmur('1 minggu');
    alatBerat.setAttribute('visible', true);
    alatBerat.setAttribute('animation__maju', {
      property: 'position', to: '4.6 0 -3.2', dur: 3500, easing: 'easeInOutSine'
    });
    // tumpukan menjadi lebih rata dan botol ikut tertekan
    gundukan.setAttribute('animation__rata', {
      property: 'scale', to: '1.15 0.58 1.15', dur: 1500, delay: 1800
    });
    botol.setAttribute('animation__tekan', {
      property: 'position', to: '1.4 0.52 -2.8', dur: 1500, delay: 1800
    });
    JP.setPanel('#panel', 'Dipadatkan',
      'Alat berat meratakan dan memadatkan tumpukan sampah agar tidak longsor dan muat lebih banyak. Botolmu ikut tertekan di antara sampah lain.');
    return { tombol: 'Timbun dengan tanah', jeda: 3800 };
  }

  function timbun() {
    JP.setUmur('tertimbun');
    tanah.setAttribute('animation__naik', {
      property: 'position', to: '1.4 0.5 -2.9', dur: 2500, easing: 'easeOutQuad'
    });
    // setelah tertutup tanah, botol tidak terlihat lagi dari permukaan
    setTimeout(function () { botol.setAttribute('visible', false); }, 2400);
    JP.setPanel('#panel', 'Ditimbun tanah',
      'Secara berkala sampah ditutup lapisan tanah untuk mengurangi bau, lalat, dan pencemaran. Dasar TPA juga diberi lapisan kedap agar air sampah tidak meresap ke dalam tanah.');
    return { tombol: 'Putar waktu 450 tahun', jeda: 2800 };
  }

  function putarWaktu() {
    matahari.setAttribute('animation__siangmalam', {
      property: 'light.intensity', from: 1.2, to: 0.1, dir: 'alternate', loop: true, dur: 250
    });
    var tahun = 0;
    var hitung = setInterval(function () {
      tahun = Math.min(tahun + 5, 450);
      teksTahun.setAttribute('value', 'Tahun ke-' + tahun);
      JP.setUmur(tahun + ' tahun di bawah tanah');
      if (tahun >= 450) {
        clearInterval(hitung);
        selesai();
      }
    }, 60);
    return null; // tombol lanjut muncul dari fungsi selesai()
  }

  function selesai() {
    matahari.removeAttribute('animation__siangmalam');
    matahari.setAttribute('light', 'intensity', 1);
    teksTahun.setAttribute('value', 'Masih utuh!');
    JP.setPanel('#panel', 'Tertimbun, tapi tidak hilang',
      'Plastik tidak membusuk seperti sisa makanan, jadi 450 tahun kemudian botolmu masih ada di bawah tanah. ' +
      'Sementara itu sampah baru datang setiap hari, TPA makin penuh, dan kota harus mencari lahan baru.');
    setTimeout(function () { JP.tampil(tombolLanjut, true); }, 2500);
  }

  var urutan = [padatkan, timbun, putarWaktu];

  tombolAksi.addEventListener('tekan', function () {
    JP.tampil(tombolAksi, false);
    var hasil = urutan[langkah]();
    langkah++;
    if (hasil) {
      setTimeout(function () {
        tombolAksi.setAttribute('tombol', 'teks', hasil.tombol);
        JP.tampil(tombolAksi, true);
      }, hasil.jeda);
    }
  });

  // 4. Lanjut ke halaman solusi
  tombolLanjut.addEventListener('tekan', function () {
    JP.pindah('solusi.html');
  });
});
