/*
 * Jejak Plastik VR
 * common.js : komponen dan fungsi bantu yang dipakai SEMUA halaman.
 * File ini wajib dimuat setelah aframe.min.js dan sebelum script halaman.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------
  // 1. Palet warna bersama (ubah di sini, semua halaman ikut berubah)
  // ---------------------------------------------------------------
  var PALET = {
    panel: '#E4F2EF',       // latar panel info (warna plastik bening)
    teks: '#0E3B43',        // teks utama
    tombol: '#1F5FD1',      // biru tutup botol
    tombolSorot: '#3E7CF2', // warna tombol saat disorot
    teksTombol: '#FFFFFF',
    benar: '#2E9E5B',
    salah: '#C8432B',
    hud: '#F2C230'          // kuning penanda umur botol
  };

  var JP = (window.JP = {});
  JP.PALET = PALET;

  // ---------------------------------------------------------------
  // 2. Fungsi bantu umum
  // ---------------------------------------------------------------

  /** Ambil parameter dari URL, misal ?jalur=selokan */
  JP.param = function (nama, bawaan) {
    var nilai = new URLSearchParams(window.location.search).get(nama);
    return nilai === null ? bawaan : nilai;
  };

  /** Jalankan fn setelah scene A-Frame selesai dimuat */
  JP.saatSiap = function (fn) {
    document.addEventListener('DOMContentLoaded', function () {
      var scene = document.querySelector('a-scene');
      if (scene.hasLoaded) fn(scene);
      else scene.addEventListener('loaded', function () { fn(scene); });
    });
  };

  /** Pindah halaman dengan efek layar gelap, sambil membawa parameter jalur */
  JP.pindah = function (url, paramTambahan) {
    var params = new URLSearchParams();
    params.set('jalur', JP.param('jalur', 'selokan'));
    if (paramTambahan) {
      Object.keys(paramTambahan).forEach(function (k) { params.set(k, paramTambahan[k]); });
    }
    var tujuan = url + (url.indexOf('?') === -1 ? '?' : '&') + params.toString();

    var tirai = document.querySelector('#jp-tirai');
    if (!tirai) { window.location.href = tujuan; return; }
    tirai.setAttribute('visible', true);
    tirai.setAttribute('animation__tutup', {
      property: 'material.opacity', from: 0, to: 1, dur: 450, easing: 'easeInQuad'
    });
    setTimeout(function () { window.location.href = tujuan; }, 500);
  };

  /** Segarkan daftar objek yang bisa diklik pada semua raycaster */
  JP.segarkanKlik = function () {
    document.querySelectorAll('[raycaster]').forEach(function (el) {
      var r = el.components.raycaster;
      if (!r) return;
      if (typeof r.setDirty === 'function') r.setDirty();
      else { try { r.refreshObjects(); } catch (e) { /* raycaster belum siap */ } }
    });
  };

  /**
   * Tampilkan atau sembunyikan entitas.
   * Objek yang disembunyikan juga dibuat tidak bisa diklik,
   * supaya kursor tidak "menabrak" tombol yang tidak terlihat.
   */
  JP.tampil = function (el, tampilkan) {
    if (!el) return;
    el.setAttribute('visible', tampilkan);
    var daftar = [el].concat(Array.prototype.slice.call(el.querySelectorAll('.klik, .klik-mati')));
    daftar.forEach(function (x) {
      if (tampilkan && x.classList.contains('klik-mati')) {
        x.classList.remove('klik-mati'); x.classList.add('klik');
      } else if (!tampilkan && x.classList.contains('klik')) {
        x.classList.remove('klik'); x.classList.add('klik-mati');
      }
    });
    JP.segarkanKlik();
  };

  /** Pasang aksi klik dengan jeda, agar satu tatapan tidak terhitung dua kali */
  JP.saatKlik = function (el, fn) {
    var terkunci = false;
    el.classList.add('klik');
    el.addEventListener('click', function (e) {
      if (terkunci) return;
      terkunci = true;
      setTimeout(function () { terkunci = false; }, 700);
      fn(e);
    });
    JP.segarkanKlik();
  };

  /** Ubah teks penanda umur botol di bagian bawah pandangan */
  JP.setUmur = function (teks) {
    var t = document.querySelector('#jp-hud-teks');
    if (!t) return;
    var isi = 'Umur botol: ' + teks;
    // Teks panjang otomatis diperkecil agar tetap muat dalam satu baris
    t.setAttribute('text', { value: isi, wrapCount: Math.max(40, isi.length + 2) });
  };

  /** Ubah isi panel info */
  JP.setPanel = function (selector, judul, isi) {
    var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    el.setAttribute('panel-info', { judul: judul, isi: isi });
  };

  /** Acak angka di antara min dan max */
  JP.acak = function (min, max) { return min + Math.random() * (max - min); };

  // ---------------------------------------------------------------
  // 3. Komponen jp-setup : dipasang di <a-scene>
  //    Mengatur kursor, HUD umur botol, dan tirai transisi.
  // ---------------------------------------------------------------
  AFRAME.registerComponent('jp-setup', {
    schema: {
      umur: { default: '' }
    },

    init: function () {
      var scene = this.el;
      var kamera = scene.querySelector('[camera]');
      var diHP = AFRAME.utils.device.isMobile();

      if (diHP) {
        // HP dan Cardboard: pilih dengan menatap tombol selama 1,5 detik
        var kursor = document.createElement('a-entity');
        kursor.setAttribute('raycaster', 'objects: .klik; far: 40');
        kursor.setAttribute('cursor', 'fuse: true; fuseTimeout: 1500');
        kursor.setAttribute('position', '0 0 -1');
        kursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.012; radiusOuter: 0.019');
        kursor.setAttribute('material', 'color: #FFFFFF; shader: flat');
        kursor.setAttribute('animation__isi', 'property: scale; startEvents: fusing; easing: linear; dur: 1500; from: 1 1 1; to: 0.35 0.35 0.35');
        kursor.setAttribute('animation__lepas', 'property: scale; startEvents: mouseleave; dur: 150; to: 1 1 1');
        kursor.setAttribute('animation__klik', 'property: scale; startEvents: click; dur: 150; to: 1 1 1');
        kamera.appendChild(kursor);
      } else {
        // Laptop: klik pakai mouse
        scene.setAttribute('raycaster', 'objects: .klik; far: 40');
        scene.setAttribute('cursor', 'rayOrigin: mouse');
      }

      // Headset VR (misalnya Quest): pakai laser controller
      var laser = document.createElement('a-entity');
      laser.setAttribute('laser-controls', 'hand: right');
      laser.setAttribute('raycaster', 'objects: .klik; far: 40; lineColor: #F2C230');
      scene.appendChild(laser);

      // HUD umur botol (menempel di kamera)
      var hud = document.createElement('a-entity');
      hud.setAttribute('id', 'jp-hud');
      hud.setAttribute('position', '0 -0.21 -0.5');
      hud.setAttribute('geometry', 'primitive: plane; width: 0.52; height: 0.044');
      hud.setAttribute('material', 'color: ' + PALET.teks + '; shader: flat');
      var hudTeks = document.createElement('a-entity');
      hudTeks.setAttribute('id', 'jp-hud-teks');
      hudTeks.setAttribute('position', '0 0 0.001');
      var isiHud = 'Umur botol: ' + this.data.umur;
      hudTeks.setAttribute('text', {
        value: isiHud,
        align: 'center', color: PALET.hud, width: 0.5, wrapCount: Math.max(40, isiHud.length + 2), font: 'exo2bold'
      });
      hud.appendChild(hudTeks);
      if (!this.data.umur) hud.setAttribute('visible', false);
      kamera.appendChild(hud);

      // Tirai hitam untuk transisi antar halaman
      var tirai = document.createElement('a-entity');
      tirai.setAttribute('id', 'jp-tirai');
      tirai.setAttribute('position', '0 0 -0.15');
      tirai.setAttribute('geometry', 'primitive: plane; width: 2; height: 2');
      tirai.setAttribute('material', 'color: #000000; shader: flat; transparent: true; opacity: 1; depthTest: false');
      tirai.setAttribute('animation__buka', 'property: material.opacity; from: 1; to: 0; dur: 700; delay: 150; easing: easeOutQuad');
      tirai.addEventListener('animationcomplete__buka', function () { tirai.setAttribute('visible', false); });
      kamera.appendChild(tirai);
    }
  });

  // ---------------------------------------------------------------
  // 4. Komponen tombol : <a-entity tombol="teks: Lanjut; ke: laut.html">
  // ---------------------------------------------------------------
  AFRAME.registerComponent('tombol', {
    schema: {
      teks: { default: 'Lanjut' },
      lebar: { default: 1.3 },
      tinggi: { default: 0.3 },
      ke: { default: '' },          // jika diisi, klik langsung pindah halaman
      warna: { default: '' },
      hurufPerBaris: { default: 20 }
    },

    init: function () {
      var el = this.el;
      var self = this;
      el.classList.add('klik');

      this.label = document.createElement('a-entity');
      this.label.setAttribute('position', '0 0 0.01');
      el.appendChild(this.label);

      el.addEventListener('mouseenter', function () {
        el.setAttribute('material', 'color', PALET.tombolSorot);
        el.object3D.scale.set(1.06, 1.06, 1.06);
      });
      el.addEventListener('mouseleave', function () {
        el.setAttribute('material', 'color', self.data.warna || PALET.tombol);
        el.object3D.scale.set(1, 1, 1);
      });

      var terkunci = false;
      el.addEventListener('click', function () {
        if (terkunci || !el.getAttribute('visible')) return;
        terkunci = true;
        setTimeout(function () { terkunci = false; }, 700);
        el.emit('tekan');
        if (self.data.ke) JP.pindah(self.data.ke);
      });
    },

    update: function () {
      var d = this.data;
      this.el.setAttribute('geometry', { primitive: 'plane', width: d.lebar, height: d.tinggi });
      this.el.setAttribute('material', { color: d.warna || PALET.tombol, shader: 'flat' });
      this.label.setAttribute('text', {
        value: d.teks, align: 'center', color: PALET.teksTombol,
        width: d.lebar * 0.92, wrapCount: d.hurufPerBaris, font: 'exo2bold'
      });
    }
  });

  // ---------------------------------------------------------------
  // 5. Komponen panel-info : panel judul + isi singkat
  // ---------------------------------------------------------------
  AFRAME.registerComponent('panel-info', {
    schema: {
      judul: { default: '' },
      isi: { default: '' },
      lebar: { default: 2 },
      hurufPerBaris: { default: 38 }
    },

    init: function () {
      this.latar = document.createElement('a-entity');
      this.judulEl = document.createElement('a-entity');
      this.isiEl = document.createElement('a-entity');
      this.el.appendChild(this.latar);
      this.el.appendChild(this.judulEl);
      this.el.appendChild(this.isiEl);
    },

    update: function () {
      var d = this.data;
      // Perkiraan jumlah baris agar tinggi panel menyesuaikan isi
      var baris = Math.max(1, Math.ceil((d.isi.length * 1.25) / d.hurufPerBaris));
      var tinggiBaris = ((d.lebar - 0.2) / d.hurufPerBaris) * 1.7;
      var barisJudul = d.judul ? Math.ceil(d.judul.length / 28) : 0;
      var tinggiJudul = d.judul ? 0.08 + barisJudul * ((d.lebar - 0.2) / 24) * 1.7 : 0;
      var tinggi = 0.22 + tinggiJudul + baris * tinggiBaris;

      this.latar.setAttribute('geometry', { primitive: 'plane', width: d.lebar, height: tinggi });
      this.latar.setAttribute('material', { color: PALET.panel, opacity: 0.94, transparent: true, shader: 'flat' });

      var atas = tinggi / 2 - 0.11;
      this.judulEl.setAttribute('position', { x: 0, y: atas, z: 0.01 });
      this.judulEl.setAttribute('text', {
        value: d.judul, align: 'left', anchor: 'center', baseline: 'top',
        color: PALET.tombol, width: d.lebar - 0.2, wrapCount: 24, font: 'exo2bold'
      });

      this.isiEl.setAttribute('position', { x: 0, y: atas - tinggiJudul, z: 0.01 });
      this.isiEl.setAttribute('text', {
        value: d.isi, align: 'left', anchor: 'center', baseline: 'top',
        color: PALET.teks, width: d.lebar - 0.2, wrapCount: d.hurufPerBaris, font: 'exo2semibold'
      });
    }
  });

  // ---------------------------------------------------------------
  // 6. Komponen botol-plastik : botol PET dibuat dari objek primitif
  //    Botol ini "tokoh utama" yang diikuti di semua halaman.
  // ---------------------------------------------------------------
  AFRAME.registerComponent('botol-plastik', {
    schema: {
      warnaTutup: { default: '#1F5FD1' },
      warnaLabel: { default: '#2DB37A' },
      bersinar: { default: true }
    },

    init: function () {
      var d = this.data;
      var el = this.el;
      var bening = 'color: #CFEFFF; opacity: 0.55; transparent: true; roughness: 0.15; metalness: 0.1';

      var bagian = [
        // [geometri, material, posisi]
        ['primitive: cylinder; radius: 0.035; height: 0.15', bening, '0 0.075 0'],
        ['primitive: cone; radiusBottom: 0.035; radiusTop: 0.014; height: 0.05', bening, '0 0.175 0'],
        ['primitive: cylinder; radius: 0.014; height: 0.02', bening, '0 0.21 0'],
        ['primitive: cylinder; radius: 0.016; height: 0.02', 'color: ' + d.warnaTutup + '; roughness: 0.5', '0 0.229 0'],
        ['primitive: cylinder; radius: 0.0356; height: 0.05; openEnded: true', 'color: ' + d.warnaLabel + '; side: double', '0 0.085 0']
      ];

      bagian.forEach(function (b) {
        var p = document.createElement('a-entity');
        p.setAttribute('geometry', b[0]);
        p.setAttribute('material', b[1]);
        p.setAttribute('position', b[2]);
        el.appendChild(p);
      });

      if (d.bersinar) {
        // Lingkaran cahaya agar mata pengguna selalu tertuju ke botol
        var cahaya = document.createElement('a-entity');
        cahaya.setAttribute('geometry', 'primitive: sphere; radius: 0.12');
        cahaya.setAttribute('position', '0 0.12 0');
        cahaya.setAttribute('material', 'color: ' + PALET.hud + '; opacity: 0.13; transparent: true; shader: flat; side: back');
        cahaya.setAttribute('animation', 'property: scale; dir: alternate; loop: true; dur: 1100; easing: easeInOutSine; from: 0.9 0.9 0.9; to: 1.15 1.15 1.15');
        el.appendChild(cahaya);
      }
    }
  });

  // ---------------------------------------------------------------
  // 7. Komponen sorot : objek membesar sedikit saat ditatap/disorot
  // ---------------------------------------------------------------
  AFRAME.registerComponent('sorot', {
    schema: { skala: { default: 1.08 } },
    init: function () {
      var obj = this.el.object3D;
      var k = this.data.skala;
      var asli = null;
      this.el.addEventListener('mouseenter', function () {
        if (!asli) asli = obj.scale.clone();
        obj.scale.set(asli.x * k, asli.y * k, asli.z * k);
      });
      this.el.addEventListener('mouseleave', function () { if (asli) obj.scale.copy(asli); });
    }
  });
})();