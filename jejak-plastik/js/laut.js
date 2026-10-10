/*
 * Halaman 4 : Laut (laut.html)
 * Botol pecah menjadi mikroplastik, lalu dimakan ikan.
 */
JP.saatSiap(function () {
  var botol = document.querySelector('#botol');
  var wadahMikro = document.querySelector('#mikroplastik');
  var ikanLapar = document.querySelector('#ikan-lapar');
  var tombolPecah = document.querySelector('#tombol-pecah');
  var tombolLanjut = document.querySelector('#tombol-lanjut');

  JP.tampil(tombolLanjut, false);

  // 0. Teks pembuka menyesuaikan jalur (datang dari sungai atau dari TPA)
  if (JP.param('jalur', 'selokan') === 'tps') {
    JP.setPanel('#panel', 'Dari TPA ke laut',
      'Hujan dan angin membawa botolmu keluar dari TPA, masuk ke sungai, lalu sampai di laut. Lihat penyu di sebelah kiri, ada sesuatu yang melilit lehernya.');
  }

  // 1. Rumput laut bergoyang
  var rumput = document.querySelector('#rumput-laut');
  for (var i = 0; i < 40; i++) {
    var sudut = JP.acak(0, Math.PI * 2);
    var jarak = JP.acak(3, 10);
    // Jangan menanam rumput laut tepat di depan pengguna agar panel tidak tertutup
    if (Math.sin(sudut) < 0 && Math.abs(Math.cos(sudut) * jarak) < 3 && jarak < 6) jarak += 4;
    var r = document.createElement('a-cone');
    var tinggi = JP.acak(0.8, 2.2);
    r.setAttribute('radius-bottom', 0.08);
    r.setAttribute('radius-top', 0.01);
    r.setAttribute('height', tinggi);
    r.setAttribute('color', i % 3 === 0 ? '#3F7F4A' : '#2F6B3F');
    r.setAttribute('position', (Math.cos(sudut) * jarak).toFixed(2) + ' ' + (tinggi / 2).toFixed(2) + ' ' + (Math.sin(sudut) * jarak).toFixed(2));
    r.setAttribute('animation', {
      property: 'rotation', from: '0 0 -8', to: '0 0 8', dir: 'alternate', loop: true,
      dur: JP.acak(1800, 2800), easing: 'easeInOutSine'
    });
    rumput.appendChild(r);
  }

  // 2. Berkas cahaya matahari dari permukaan laut
  var cahaya = document.querySelector('#berkas-cahaya');
  for (var c = 0; c < 6; c++) {
    var p = document.createElement('a-plane');
    p.setAttribute('width', JP.acak(0.4, 1));
    p.setAttribute('height', 9);
    p.setAttribute('position', JP.acak(-5, 5).toFixed(2) + ' 4.5 ' + JP.acak(-8, -3).toFixed(2));
    p.setAttribute('rotation', '0 0 ' + JP.acak(-12, 12).toFixed(1));
    p.setAttribute('material', 'color: #BDEBFF; opacity: 0.07; transparent: true; shader: flat; side: double; fog: false');
    cahaya.appendChild(p);
  }

  // 3. Kawanan ikan (model 3D eksternal) berenang memutar
  var kawanan = document.querySelector('#kawanan');
  for (var k = 0; k < 4; k++) {
    var lintasan = document.createElement('a-entity');
    lintasan.setAttribute('rotation', '0 ' + (k * 90) + ' 0');
    lintasan.setAttribute('animation', {
      property: 'rotation', to: '0 ' + (k * 90 + 360) + ' 0', loop: true, dur: 16000 + k * 3000, easing: 'linear'
    });
    var ikan = document.createElement('a-entity');
    ikan.setAttribute('gltf-model', '#model-ikan');
    ikan.setAttribute('position', (3 + k * 0.6) + ' ' + JP.acak(0.8, 2.6).toFixed(2) + ' 0');
    ikan.setAttribute('rotation', '0 180 0');
    ikan.setAttribute('scale', '2 2 2');
    lintasan.appendChild(ikan);
    kawanan.appendChild(lintasan);
  }

  // 4. Penyu bisa diklik untuk info tambahan
  JP.saatKlik(document.querySelector('#penyu'), function () {
    JP.setPanel('#panel', 'Penyu yang terjerat',
      'Cincin dan tali plastik bisa melilit leher atau sirip hewan laut. Penyu juga sering mengira kantong plastik yang melayang adalah ubur-ubur, makanannya.');
  });

  // 5. Interaksi utama: botol pecah menjadi mikroplastik
  var warnaSerpihan = ['#CFEFFF', '#2DB37A', '#1F5FD1', '#FFFFFF', '#F2C230'];
  var sudahPecah = false;

  function pecahkanBotol() {
    if (sudahPecah) return;
    sudahPecah = true;
    JP.tampil(tombolPecah, false);
    JP.setUmur('20 tahun');

    // Botol mengecil lalu hilang
    botol.setAttribute('animation__hilang', { property: 'scale', to: '0.01 0.01 0.01', dur: 900, easing: 'easeInBack' });
    setTimeout(function () { JP.tampil(botol, false); }, 950);

    // Serpihan menyebar
    for (var i = 0; i < 70; i++) {
      var s = document.createElement('a-entity');
      s.setAttribute('geometry', i % 2
        ? 'primitive: box; width: 0.03; height: 0.03; depth: 0.03'
        : 'primitive: sphere; radius: 0.018');
      s.setAttribute('material', 'color: ' + warnaSerpihan[i % warnaSerpihan.length] + '; emissive: ' + warnaSerpihan[i % warnaSerpihan.length] + '; emissiveIntensity: 0.4');
      s.setAttribute('position', '0 0 0');
      var tujuan = JP.acak(-1.2, 1.2).toFixed(2) + ' ' + JP.acak(-0.6, 0.6).toFixed(2) + ' ' + JP.acak(-0.8, 0.8).toFixed(2);
      s.setAttribute('animation__sebar', { property: 'position', to: tujuan, dur: 2500, delay: 700, easing: 'easeOutCubic' });
      wadahMikro.appendChild(s);
    }

    JP.setPanel('#panel', 'Botolmu menjadi mikroplastik',
      'Sinar matahari dan ombak membuat plastik rapuh lalu pecah menjadi serpihan kecil yang disebut mikroplastik. ' +
      'Serpihan ini tidak hilang dan mudah tertelan karena ikan mengiranya makanan.');

    // Ikan berenang melewati serpihan
    setTimeout(function () {
      ikanLapar.setAttribute('animation__makan', {
        property: 'position', to: '1.5 1.1 -2.3', dur: 3500, easing: 'easeInOutSine'
      });
    }, 3200);

    ikanLapar.addEventListener('animationcomplete__makan', function () {
      // Serpihan "termakan": sebagian besar menghilang
      Array.prototype.forEach.call(wadahMikro.children, function (x, idx) {
        if (idx % 4 !== 0) x.setAttribute('visible', false);
      });
      JP.tampil(tombolLanjut, true);
    });
  }

  tombolPecah.addEventListener('tekan', pecahkanBotol);
  JP.saatKlik(botol, pecahkanBotol);

  // 6. Lanjut ke halaman piring
  tombolLanjut.addEventListener('tekan', function () {
    JP.pindah('piring.html');
  });
});