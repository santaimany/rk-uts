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
    [-3.5, -8, 3.2, 2.6], [1.5, -9.5, 4, 3.4], [5.5, -7, 2.8, 2.2], [-6.5, -5.5, 2.2, 1.6], [6.6, -4.2, 1.6, 1]
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

  // 3. Timbunan sampah di depan: serpihan warna-warni di permukaan bukit kecil
  var scene = document.querySelector('a-scene');
  var timbunan = document.querySelector('#timbunan');
  var timbunanDasar = document.querySelector('#timbunan-dasar');
  var serpihanTimbunan = [];
  for (var k = 0; k < 45; k++) {
    var sdt = JP.acak(0, Math.PI * 2);
    var jrk = JP.acak(0, 1.0);
    var yDasar = 0.55 * Math.sqrt(Math.max(0, 1 - Math.pow(jrk / 1.1, 2)));
    var p = document.createElement('a-entity');
    var jenis = k % 3;
    if (jenis === 0) p.setAttribute('geometry', 'primitive: box; width: 0.22; height: 0.06; depth: 0.16');
    if (jenis === 1) p.setAttribute('geometry', 'primitive: cylinder; radius: 0.045; height: 0.22');
    if (jenis === 2) p.setAttribute('geometry', 'primitive: sphere; radius: 0.1');
    p.setAttribute('material', 'color: ' + warnaSampah[k % warnaSampah.length] + '; roughness: 0.8');
    p.setAttribute('position', (Math.cos(sdt) * jrk).toFixed(2) + ' ' + yDasar.toFixed(2) + ' ' + (Math.sin(sdt) * jrk).toFixed(2));
    p.setAttribute('rotation', JP.acak(-40, 40).toFixed(0) + ' ' + JP.acak(0, 180).toFixed(0) + ' ' + JP.acak(-40, 40).toFixed(0));
    if (jenis === 2) p.setAttribute('scale', '1 0.55 1'); // kantong plastik
    p.dataset.yDasar = yDasar;
    timbunan.appendChild(p);
    serpihanTimbunan.push(p);
  }

  // 4. Roda di dalam rantai bulldozer
  var roda = document.querySelector('#roda-alat');
  [-0.6, -0.2, 0.2, 0.6].forEach(function (x) {
    [0.4, -0.4].forEach(function (z) {
      var r = document.createElement('a-cylinder');
      r.setAttribute('radius', 0.12);
      r.setAttribute('height', 0.28);
      r.setAttribute('rotation', '90 0 0');
      r.setAttribute('position', x + ' 0.16 ' + z);
      r.setAttribute('color', '#4F4F4B');
      roda.appendChild(r);
    });
  });

  // Gumpalan tanah di permukaan lapisan penutup agar tidak terlihat mulus
  var tanahPenutupEl = document.querySelector('#tanah-penutup');
  var warnaTanah = ['#6B4C31', '#86643F', '#715236'];
  for (var g = 0; g < 18; g++) {
    var sg = JP.acak(0, Math.PI * 2);
    var jg = JP.acak(0, 1.1);
    var yg = 0.55 * Math.sqrt(Math.max(0, 1 - Math.pow(jg / 1.28, 2)));
    var gumpal = document.createElement('a-sphere');
    gumpal.setAttribute('radius', JP.acak(0.08, 0.16).toFixed(2));
    gumpal.setAttribute('scale', '1 0.5 1');
    gumpal.setAttribute('position', (1.25 + Math.cos(sg) * jg).toFixed(2) + ' ' + yg.toFixed(2) + ' ' + (Math.sin(sg) * jg).toFixed(2));
    gumpal.setAttribute('material', 'color: ' + warnaTanah[g % 3] + '; flatShading: true; roughness: 1');
    gumpal.setAttribute('segments-width', 6);
    gumpal.setAttribute('segments-height', 4);
    tanahPenutupEl.appendChild(gumpal);
  }

  // 5. Fungsi bantu animasi
  var alatBerat = document.querySelector('#alat-berat');
  var badanAlat = document.querySelector('#badan-alat');
  var nomorAnimasi = 0;

  /** Gerakkan entitas melewati beberapa titik berurutan: [x, y, kemiringan, durasi] */
  function lintasi(el, titik, selesai) {
    var i = 0;
    function berikut() {
      if (i >= titik.length) { if (selesai) selesai(); return; }
      var t = titik[i++];
      var z = el.object3D.position.z;
      nomorAnimasi++;
      el.setAttribute('animation__p' + nomorAnimasi, {
        property: 'position', to: t[0] + ' ' + t[1] + ' ' + z, dur: t[3], easing: 'linear'
      });
      el.setAttribute('animation__r' + nomorAnimasi, {
        property: 'rotation', to: '0 0 ' + t[2], dur: Math.min(450, t[3]), easing: 'easeInOutSine'
      });
      setTimeout(berikut, t[3]);
    }
    berikut();
  }

  /** Kepulan asap atau debu yang membesar lalu memudar */
  function kepulan(x, y, z, warna, naik) {
    var a = document.createElement('a-sphere');
    a.setAttribute('radius', 0.11);
    a.setAttribute('position', x + ' ' + y + ' ' + z);
    a.setAttribute('material', { color: warna, opacity: 0.7, transparent: true, roughness: 1, depthWrite: false });
    a.setAttribute('animation__besar', { property: 'scale', from: '0.6 0.6 0.6', to: '2.8 2.8 2.8', dur: 1400, easing: 'easeOutQuad' });
    a.setAttribute('animation__pudar', { property: 'material.opacity', from: 0.7, to: 0, dur: 1400 });
    a.setAttribute('animation__naik', { property: 'position', to: x + ' ' + (y + naik) + ' ' + z, dur: 1400 });
    scene.appendChild(a);
    setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); }, 1500);
  }

  // Mesin menyala: badan bergetar, knalpot berasap, rantai menerbangkan debu
  var asapMesin = null;
  function nyalakanMesin() {
    alatBerat.setAttribute('visible', true);
    badanAlat.setAttribute('animation__getar', {
      property: 'position', from: '0 0 0', to: '0 0.02 0', dir: 'alternate', loop: true, dur: 90
    });
    asapMesin = setInterval(function () {
      var pos = alatBerat.object3D.position;
      kepulan(pos.x - 0.55, pos.y + 1.4, pos.z + 0.18, '#4A4A4A', 0.7);
      kepulan(pos.x - 0.7, pos.y + 0.1, pos.z + (Math.random() > 0.5 ? 0.4 : -0.4), '#B5A386', 0.3);
    }, 260);
  }
  function matikanMesin() {
    clearInterval(asapMesin);
    badanAlat.removeAttribute('animation__getar');
    badanAlat.setAttribute('position', '0 0 0');
  }

  /** Padatkan timbunan: serpihan turun dan merebah, bukit makin rendah */
  function tekanTimbunan(faktor, skalaDasar, dur) {
    serpihanTimbunan.forEach(function (p, idx) {
      var yBaru = (parseFloat(p.dataset.yDasar) * faktor).toFixed(3);
      var pos = p.getAttribute('position');
      nomorAnimasi++;
      p.setAttribute('animation__t' + nomorAnimasi, {
        property: 'position', to: pos.x + ' ' + yBaru + ' ' + pos.z, dur: dur, delay: idx * 15, easing: 'easeInQuad'
      });
      var rot = p.getAttribute('rotation');
      p.setAttribute('animation__rb' + nomorAnimasi, {
        property: 'rotation', to: (rot.x * 0.3).toFixed(0) + ' ' + rot.y + ' ' + (rot.z * 0.3).toFixed(0), dur: dur
      });
    });
    timbunanDasar.setAttribute('animation__tekan' + faktor, {
      property: 'scale', to: '1.05 ' + skalaDasar + ' 1.05', dur: dur, easing: 'easeInQuad'
    });
  }

  // 6. Interaksi utama: tiga langkah berurutan dengan satu tombol
  var tombolAksi = document.querySelector('#tombol-aksi');
  var tanahGundukan = document.querySelector('#tanah-gundukan');
  var tanahPenutup = document.querySelector('#tanah-penutup');
  var langkah = 0;

  function padatkan() {
    JP.setUmur('1 minggu');
    JP.setPanel('#panel', 'Dipadatkan',
      'Alat berat bolak-balik melindas tumpukan sampah sampai padat dan rata. Sampah yang padat tidak mudah longsor dan TPA bisa menampung lebih banyak.');
    nyalakanMesin();

    // Lintasan pertama: maju menaiki timbunan
    lintasi(alatBerat, [
      [0.3, 0, 0, 900], [0.8, 0.3, 10, 600], [2.4, 0.3, 0, 1500], [2.9, 0, -10, 600], [3.6, 0, 0, 700]
    ], function () {
      // Lintasan kedua: mundur, timbunan makin rendah
      lintasi(alatBerat, [
        [2.9, 0, 0, 700], [2.4, 0.2, -8, 600], [0.8, 0.2, 0, 1500], [0.3, 0, 8, 600], [-0.6, 0, 0, 900]
      ], matikanMesin);
    });

    // Timbunan tertekan saat alat berat lewat di atasnya
    setTimeout(function () { tekanTimbunan(0.7, 0.38, 1400); }, 1500);
    setTimeout(function () { tekanTimbunan(0.5, 0.28, 1400); }, 5800);
    botol.setAttribute('animation__tekan1', { property: 'position', to: '1.6 0.4 -4.5', dur: 1000, delay: 2000 });
    botol.setAttribute('animation__rebah', { property: 'rotation', to: '0 30 90', dur: 1000, delay: 2000 });
    botol.setAttribute('animation__tekan2', { property: 'position', to: '1.6 0.3 -4.5', dur: 1000, delay: 6300 });
    botol.setAttribute('animation__pipih', { property: 'scale', to: '2.2 2.2 1.4', dur: 1000, delay: 6300 });

    return { tombol: 'Timbun dengan tanah', jeda: 8800 };
  }

  function timbun() {
    JP.setUmur('mulai tertimbun');
    JP.setPanel('#panel', 'Ditimbun tanah',
      'Truk menuangkan tanah, lalu alat berat meratakannya menutupi sampah. Lapisan tanah penutup diberikan berkala untuk mengurangi bau, lalat, dan pencemaran. Dasar TPA juga diberi lapisan kedap agar air sampah tidak meresap ke tanah.');
    nyalakanMesin();

    // Alat berat mundur memberi ruang
    lintasi(alatBerat, [[-1.6, 0, 0, 1000]]);

    // Tanah dituang dari atas
    setTimeout(function () {
      tanahGundukan.setAttribute('visible', true);
      tanahGundukan.setAttribute('animation__jatuh', {
        property: 'position', from: '0.2 2.5 -4.5', to: '0.2 0 -4.5', dur: 700, easing: 'easeInQuad'
      });
      // tanah mendarat lalu melebar menjadi gundukan
      tanahGundukan.setAttribute('animation__mekar', {
        property: 'scale', from: '0.5 0.9 0.5', to: '1.1 0.7 1.1', dur: 500, delay: 650, easing: 'easeOutQuad'
      });
      setTimeout(function () {
        for (var i = 0; i < 8; i++) {
          kepulan((0.2 + JP.acak(-0.6, 0.6)).toFixed(2), 0.15, (-4.5 + JP.acak(-0.6, 0.6)).toFixed(2), '#9C7E5A', 0.4);
        }
      }, 650);
    }, 900);

    // Alat berat mendorong dan meratakan tanah ke atas timbunan
    setTimeout(function () {
      lintasi(alatBerat, [
        [-0.9, 0, 0, 700], [-0.3, 0.4, 10, 600], [1.9, 0.45, 0, 2200], [2.6, 0, -10, 600], [3.6, 0, 0, 700]
      ], matikanMesin);

      // gundukan tanah ikut terdorong di depan pisau lalu habis tersebar
      tanahGundukan.setAttribute('animation__dorong', {
        property: 'position', to: '2.9 0.2 -4.5', dur: 3500, delay: 700, easing: 'linear'
      });
      tanahGundukan.setAttribute('animation__habis', {
        property: 'scale', to: '0.05 0.05 0.05', dur: 3500, delay: 700
      });
      // lapisan tanah tumbuh dari kiri ke kanan mengikuti alat berat
      setTimeout(function () {
        tanahPenutup.setAttribute('visible', true);
        tanahPenutup.setAttribute('animation__rata', {
          property: 'scale', from: '0.05 0.3 0.7', to: '1 1 1', dur: 3000, easing: 'linear'
        });
      }, 900);
      setTimeout(function () { botol.setAttribute('visible', false); }, 2400);
    }, 1900);

    return { tombol: 'Putar waktu 450 tahun', jeda: 7600 };
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