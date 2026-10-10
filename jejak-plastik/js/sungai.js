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
    var z = JP.acak(-8.5, -5.5).toFixed(2);
    h.setAttribute('position', JP.acak(-12, -5).toFixed(2) + ' -0.9 ' + z);
    h.setAttribute('animation', {
      property: 'position', to: '2.2 -0.9 ' + z, dur: JP.acak(14000, 22000), easing: 'linear', loop: true
    });
    document.querySelector('#arus').appendChild(h);
  }

  // 2b. Air sungai pada model lanskap dibuat keruh kehijauan agar terlihat tercemar
  document.querySelector('#lanskap').addEventListener('model-loaded', function (e) {
    e.detail.model.traverse(function (node) {
      if (node.isMesh && node.name.toLowerCase().indexOf('water') !== -1) {
        node.material = node.material.clone();
        node.material.color = new THREE.Color('#7FA096');
        node.material.emissive = new THREE.Color('#1E3A34');
        node.material.transparent = true;
        node.material.opacity = 0.9;
        node.material.roughness = 0.25;
        node.material.metalness = 0;
        node.material.depthWrite = true;
      }
    });
  });

  // 3. Permukiman di seberang sungai (model 3D eksternal: house.glb)
  for (var k = 0; k < 6; k++) {
    var r = document.createElement('a-entity');
    r.setAttribute('gltf-model', 'assets/models/house.glb');
    r.setAttribute('model-pas', 'ukuran: 2.3; sumbu: lebar');
    r.setAttribute('position', (-8 + k * 3.2).toFixed(2) + ' 0.1 ' + JP.acak(-15, -13.5).toFixed(2));
    document.querySelector('#permukiman').appendChild(r);
  }

  // 4. Botol hanyut dari pipa menuju tumpukan sampah
  botol.setAttribute('animation__hanyut', {
    property: 'position', to: '2.4 -0.85 -5.45', dur: 7000, easing: 'easeOutSine'
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

    banjir.setAttribute('visible', true);
    banjir.setAttribute('animation__naik', {
      property: 'position', to: '0 0.4 -7', dur: 4000, easing: 'easeInOutQuad'
    });
    // Botol ikut terangkat air banjir
    botol.setAttribute('animation__naik', {
      property: 'position', to: '2 0.5 -5.2', dur: 4000, easing: 'easeInOutQuad'
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
