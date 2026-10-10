/*
 * Halaman 5 : Meja makan (piring.html)
 * Twist cerita: mikroplastik dari botol kembali ke piring manusia.
 */
JP.saatSiap(function () {
  var ikan = document.querySelector('#ikan');
  var isiIkan = document.querySelector('#isi-ikan');
  var tombolLihat = document.querySelector('#tombol-lihat');
  var tombolLanjut = document.querySelector('#tombol-lanjut');

  JP.tampil(tombolLanjut, false);

  // 1. Siapkan serpihan mikroplastik di dalam tubuh ikan
  var warna = ['#CFEFFF', '#2DB37A', '#1F5FD1', '#F2C230'];
  for (var i = 0; i < 28; i++) {
    var s = document.createElement('a-sphere');
    s.setAttribute('radius', 0.008);
    s.setAttribute('position', JP.acak(-0.2, 0.2).toFixed(3) + ' ' + JP.acak(-0.02, 0.03).toFixed(3) + ' ' + JP.acak(-0.03, 0.03).toFixed(3));
    s.setAttribute('material', 'shader: flat; color: ' + warna[i % warna.length]);
    s.setAttribute('animation', {
      property: 'scale', from: '1 1 1', to: '1.8 1.8 1.8', dir: 'alternate', loop: true, dur: JP.acak(500, 900)
    });
    isiIkan.appendChild(s);
  }

  // 2. Fungsi membuat model ikan menjadi tembus pandang
  function buatTembusPandang(el, opacity) {
    var model = el.getObject3D('mesh');
    if (!model) return;
    model.traverse(function (node) {
      if (node.isMesh) {
        node.material = node.material.clone();
        node.material.transparent = true;
        node.material.opacity = opacity;
        node.material.depthWrite = false;
      }
    });
  }

  // 3. Interaksi utama: lihat isi ikan
  var sudahDilihat = false;
  function lihatIsi() {
    if (sudahDilihat) return;
    sudahDilihat = true;
    JP.tampil(tombolLihat, false);

    buatTembusPandang(ikan, 0.5);
    isiIkan.setAttribute('visible', true);
    JP.setUmur('kini di piringmu');

    JP.setPanel('#panel', 'Botolmu kembali kepadamu',
      'Ikan yang menelan mikroplastik bisa berakhir di meja makan. Peneliti sudah menemukan mikroplastik di ikan, garam dapur, air minum, ' +
      'bahkan di dalam tubuh manusia. Sampah yang kita buang tidak pernah benar-benar pergi.');

    setTimeout(function () { JP.tampil(tombolLanjut, true); }, 2500);
  }

  tombolLihat.addEventListener('tekan', lihatIsi);
  JP.saatKlik(ikan, lihatIsi);

  // 4. Lanjut ke solusi
  tombolLanjut.addEventListener('tekan', function () {
    JP.pindah('solusi.html');
  });
});
