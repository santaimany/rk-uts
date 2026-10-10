/*
 * Halaman 2 : Sungai (sungai.html)
 * Botol hanyut, menumpuk di gorong-gorong, lalu pengguna melihat banjir terjadi.
 */
JP.saatSiap(function () {
  var botol = document.querySelector('#botol');
  var tumpukan = document.querySelector('#tumpukan');
  var banjir = document.querySelector('#banjir');
  var tombolSumbat = document.querySelector('#tombol-sumbat');
  var tombolLanjut = document.querySelector('#tombol-lanjut');

  JP.tampil(tombolSumbat, false);
  JP.tampil(tombolLanjut, false);

  // 1. Buat tumpukan sampah plastik berwarna-warni dari objek primitif
  var warnaSampah = ['#E8562A', '#F2C230', '#FFFFFF', '#3E7CF2', '#D94F8C', '#2DB37A', '#222222'];
  var bentuk = ['box', 'cylinder', 'sphere'];
  for (var i = 0; i < 26; i++) {
    var s = document.createElement('a-entity');
    var jenis = bentuk[i % bentuk.length];
    if (jenis === 'box') s.setAttribute('geometry', 'primitive: box; width: 0.25; height: 0.08; depth: 0.18');
    if (jenis === 'cylinder') s.setAttribute('geometry', 'primitive: cylinder; radius: 0.05; height: 0.3');
    if (jenis === 'sphere') s.setAttribute('geometry', 'primitive: sphere; radius: 0.12');
    s.setAttribute('material', 'color: ' + warnaSampah[i % warnaSampah.length] + '; roughness: 0.7');
    s.setAttribute('position', JP.acak(-0.9, 0.3) + ' ' + JP.acak(0, 0.25) + ' ' + JP.acak(-1.2, 1.2));
    s.setAttribute('rotation', JP.acak(0, 180) + ' ' + JP.acak(0, 180) + ' ' + JP.acak(0, 180));
    if (jenis === 'sphere') s.setAttribute('scale', '1 0.5 1'); // kantong plastik pipih
    tumpukan.appendChild(s);
  }

  // 2. Sampah lain yang ikut hanyut di sepanjang sungai
  for (var j = 0; j < 8; j++) {
    var h = document.createElement('a-entity');
    h.setAttribute('geometry', 'primitive: box; width: 0.2; height: 0.06; depth: 0.15');
    h.setAttribute('material', 'color: ' + warnaSampah[j % warnaSampah.length]);
    var z = JP.acak(-4.6, -2.4).toFixed(2);
    h.setAttribute('position', JP.acak(-12, -5).toFixed(2) + ' 0.07 ' + z);
    h.setAttribute('animation', {
      property: 'position', to: '2.2 0.07 ' + z, dur: JP.acak(14000, 22000), easing: 'linear', loop: true
    });
    document.querySelector('#arus').appendChild(h);
  }

  // 3. Permukiman di seberang sungai (rumah sederhana dari primitif)
  var warnaDinding = ['#E9C9A0', '#CFE3D2', '#F1E1B0', '#D9C7E6'];
  for (var k = 0; k < 6; k++) {
    var r = document.createElement('a-entity');
    r.setAttribute('position', (-7.5 + k * 3).toFixed(2) + ' 0 ' + JP.acak(-9.5, -8).toFixed(2));
    var dinding = document.createElement('a-box');
    dinding.setAttribute('width', 2); dinding.setAttribute('height', 1.8); dinding.setAttribute('depth', 2);
    dinding.setAttribute('position', '0 0.9 0');
    dinding.setAttribute('color', warnaDinding[k % warnaDinding.length]);
    var atap = document.createElement('a-cone');
    atap.setAttribute('radius-bottom', 1.7); atap.setAttribute('radius-top', 0);
    atap.setAttribute('height', 1); atap.setAttribute('segments-radial', 4);
    atap.setAttribute('rotation', '0 45 0'); atap.setAttribute('position', '0 2.3 0');
    atap.setAttribute('color', '#A9502E');
    r.appendChild(dinding); r.appendChild(atap);
    document.querySelector('#permukiman').appendChild(r);
  }

  // 4. Botol hanyut dari pipa menuju tumpukan sampah
  botol.setAttribute('animation__hanyut', {
    property: 'position', to: '2.4 0.2 -3.4', dur: 7000, easing: 'easeOutSine'
  });
  botol.addEventListener('animationcomplete__hanyut', function () {
    JP.tampil(tombolSumbat, true);
  });

  // 5. Interaksi utama: lihat penyumbatan dan banjir
  var sudahBanjir = false;
  function mulaiBanjir() {
    if (sudahBanjir) return;
    sudahBanjir = true;
    JP.tampil(tombolSumbat, false);

    banjir.setAttribute('animation__naik', {
      property: 'position', to: '0 0.5 -6', dur: 4000, easing: 'easeInOutQuad'
    });
    // Botol ikut terangkat air banjir
    botol.setAttribute('animation__naik', {
      property: 'position', to: '1.6 0.65 -2.9', dur: 4000, easing: 'easeInOutQuad'
    });

    JP.setPanel('#panel', 'Saluran tersumbat, air meluap',
      'Tumpukan sampah plastik menutup gorong-gorong sehingga air tidak bisa mengalir dan meluap ke permukiman. ' +
      'Sampah yang menyumbat saluran air menjadi salah satu penyebab banjir di kota.');

    setTimeout(function () { JP.tampil(tombolLanjut, true); }, 4200);
  }

  tombolSumbat.addEventListener('tekan', mulaiBanjir);
  JP.saatKlik(tumpukan, function () {
    if (tombolSumbat.getAttribute('visible')) mulaiBanjir();
  });

  // 6. Lanjut ke halaman laut
  tombolLanjut.addEventListener('tekan', function () {
    JP.pindah('laut.html');
  });
});