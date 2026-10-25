// ==UserScript==
// @name        GeoFS Video Player
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description GeoFS 视频播放器，支持本地文件。
// @author      哔哩哔哩-我是小猪05 小红书-起飞吧！凤凰牌飞机！ GitHub-zssszscnplane
// @match       https://www.geo-fs.com/*
// @match       https://geo-fs.com/*
// @grant       none
// ==/UserScript==

(function () {
  'use strict';

  const LANG_KEY = 'gf_vp_lang';
  const DEFAULT_LANG = 'zh';

  const I18N = {
    zh: {
      videoBtn: '视频',
      titleMain: 'GeoFS 视频播放器',
      titleSub: '由 哔哩哔哩-我是小猪05 小红书-起飞吧！凤凰牌飞机！ GitHub-zssszscnplane制作',
      loadUrl: '加载 URL',
      openFile: '选择文件',
      close: '关闭',
      playPause: '播放/暂停',
      prev: '上一个',
      next: '下一个',
      mute: '静音/取消',
      autoplay: '自动播放',
      drop: '将本地视频文件拖到此处以添加到列表',
      play: '播放',
      remove: '移除',
      languageLabel: 'Language',
    },
    en: {
      videoBtn: 'Video',
      titleMain: 'GeoFS Video Player',
      titleSub: 'Create by Bilibili-我是小猪05 Xiaohongshu-起飞吧！凤凰牌飞机！ GitHub-zssszscnplane',
      loadUrl: 'Load URL',
      openFile: 'Open File',
      close: 'Close',
      playPause: 'Play/Pause',
      prev: 'Prev',
      next: 'Next',
      mute: 'Mute/Unmute',
      autoplay: 'Autoplay',
      drop: 'Drop local video files here to add to playlist',
      play: 'Play',
      remove: 'Remove',
      languageLabel: 'Language',
      promptLabel: 'Enter video URL:'
    }
  };

  const css = `
  #gf-vp-btn {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 999999;
    background: rgba(0,0,0,0.6);
    color: #fff;
    border: none;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  #gf-vp-modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: min(700px, 70vw);
    height: min(450px, 70vh);
    background: rgba(18,18,18,0.98);
    color: #fff;
    z-index: 999998;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
    display: none;
    flex-direction: column;
    overflow: hidden;
    resize: both;
    padding-bottom: 72px;
  }

  #gf-vp-drag-zone {
    position: absolute;
    left: 0;
    top: 0;
    width: 18px;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0));
    border-right: 2px solid rgba(255,255,255,0.12);
    cursor: grab;
    z-index: 3;
  }

  #gf-vp-drag-zone:active {
    cursor: grabbing;
  }

  #gf-vp-title {
    padding: 8px 12px;
    text-align: center;
    font-size: 16px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    background: rgba(255,255,255,0.01);
    margin-left: 18px;
  }

  #gf-vp-lang-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255,255,255,0.01);
    border-bottom: 1px solid rgba(255,255,255,0.02);
    padding: 6px 0;
    margin-left: 18px;
  }

  #gf-vp-lang-btn {
    padding: 6px 10px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(0,0,0,0.25);
    color: #fff;
    cursor: pointer;
  }

  .gf-vp-lang-popup {
    position: absolute;
    left: calc(50% + 70px);
    top: 50%;
    transform: translateY(-50%);
    display: none;
    flex-direction: column;
    min-width: 140px;
    background: rgba(14,14,14,0.98);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 6px;
    box-shadow: 0 8px 22px rgba(0,0,0,0.5);
    z-index: 999999;
  }

  .gf-vp-lang-popup button {
    display: block;
    width: 100%;
    text-align: left;
    padding: 8px 10px;
    border: none;
    background: transparent;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
  }

  .gf-vp-lang-popup button:hover {
    background: rgba(255,255,255,0.04);
  }

  #gf-vp-header {
    display: flex;
    gap: 8px;
    padding: 8px;
    background: rgba(255,255,255,0.02);
    align-items: center;
    justify-content: center;
    margin-left: 18px;
  }

  #gf-vp-header button {
    padding: 6px 10px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    background: #2b7;
    color: #012;
    font-size: 12px;
  }

  #gf-vp-body {
    flex: 1;
    display: flex;
    background: #000;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-bottom: 8px;
    margin-left: 18px;
  }

  #gf-vp-body video, #gf-vp-body iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: #000;
    position: relative;
    z-index: 1;
  }

  #gf-vp-controls {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    gap: 8px;
    padding: 10px 12px;
    background: linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.28));
    align-items: center;
    z-index: 200000;
    box-sizing: border-box;
    margin-left: 18px;
  }

  #gf-vp-controls button {
    font-size: 12px;
    padding: 4px 8px;
  }

  #gf-vp-list {
    max-height: 120px;
    overflow: auto;
    background: rgba(255,255,255,0.02);
    padding: 6px;
    border-radius: 6px;
    width: 220px;
  }

  .gf-vp-item {
    padding: 6px;
    border-radius: 4px;
    margin-bottom: 6px;
    background: rgba(255,255,255,0.01);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
  }

  .gf-vp-item button {
    margin-left: 6px;
    font-size: 11px;
  }

  #gf-vp-drop {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.6);
    font-size: 16px;
    border: 2px dashed rgba(255,255,255,0.06);
    pointer-events: none;
    opacity: 0;
    transition: opacity .12s;
  }

  #gf-vp-modal.dragover #gf-vp-drop {
    pointer-events: auto;
    opacity: 1;
  }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  let currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  if (!['zh', 'en'].includes(currentLang)) currentLang = DEFAULT_LANG;

  const topBtn = document.createElement('button');
  topBtn.id = 'gf-vp-btn';
  topBtn.textContent = 'Video';
  document.body.appendChild(topBtn);

  const modal = document.createElement('div');
  modal.id = 'gf-vp-modal';
  modal.innerHTML = `
    <div id="gf-vp-drag-zone" title="拖动"></div>

    <div id="gf-vp-title">
      <span id="gf-vp-title-main">标题11</span><br>
      <span id="gf-vp-title-sub" style="font-size:12px;opacity:0.85">由 哔哩哔哩-我是小猪05 小红书-起飞吧！凤凰牌飞机！ GitHub-zssszscnplane制作</span>
    </div>

    <div id="gf-vp-lang-wrap">
      <button id="gf-vp-lang-btn" aria-expanded="false">Language</button>
      <div id="gf-vp-lang-popup" class="gf-vp-lang-popup" role="menu" aria-hidden="true">
        <button type="button" data-lang="zh">简体中文</button>
        <button type="button" data-lang="en">English</button>
      </div>
    </div>

    <div id="gf-vp-header">
      <button id="gf-vp-load-url">加载 URL</button>
      <button id="gf-vp-open-file">选择文件</button>
      <button id="gf-vp-close">关闭</button>
    </div>

    <div id="gf-vp-body">
      <div id="gf-vp-drop">将本地视频文件拖到此处以添加到列表</div>
    </div>

    <div id="gf-vp-controls">
      <button id="gf-vp-playpause">播放/暂停</button>
      <button id="gf-vp-prev">上一个</button>
      <button id="gf-vp-next">下一个</button>
      <button id="gf-vp-mute">静音/取消</button>
      <label style="margin-left:8px; font-size:12px;">
        <span id="gf-vp-autoplay-label">自动播放</span>
        <input id="gf-vp-autoplay" type="checkbox" checked />
      </label>
      <div style="flex:1"></div>
      <div id="gf-vp-list"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const body = modal.querySelector('#gf-vp-body');
  const dragZone = modal.querySelector('#gf-vp-drag-zone');
  const loadUrlBtn = modal.querySelector('#gf-vp-load-url');
  const openFileBtn = modal.querySelector('#gf-vp-open-file');
  const closeBtn = modal.querySelector('#gf-vp-close');
  const playPauseBtn = modal.querySelector('#gf-vp-playpause');
  const prevBtn = modal.querySelector('#gf-vp-prev');
  const nextBtn = modal.querySelector('#gf-vp-next');
  const muteBtn = modal.querySelector('#gf-vp-mute');
  const autoplayCheckbox = modal.querySelector('#gf-vp-autoplay');
  const autoplayLabel = modal.querySelector('#gf-vp-autoplay-label');
  const listEl = modal.querySelector('#gf-vp-list');
  const dropEl = modal.querySelector('#gf-vp-drop');
  const titleMain = modal.querySelector('#gf-vp-title-main');
  const titleSub = modal.querySelector('#gf-vp-title-sub');
  const langBtn = modal.querySelector('#gf-vp-lang-btn');
  const langPopup = modal.querySelector('#gf-vp-lang-popup');

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'video/*,audio/*';
  fileInput.multiple = true;
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  let playlist = [];
  let current = -1;
  let videoEl = null;
  let iframeEl = null;
  let lastObjectUrl = null;
  let dragState = null;

  function setLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'zh';
    localStorage.setItem(LANG_KEY, currentLang);

    const t = I18N[currentLang];

    topBtn.textContent = t.videoBtn;
    titleMain.textContent = t.titleMain;
    titleSub.textContent = t.titleSub;
    loadUrlBtn.textContent = t.loadUrl;
    openFileBtn.textContent = t.openFile;
    closeBtn.textContent = t.close;
    playPauseBtn.textContent = t.playPause;
    prevBtn.textContent = t.prev;
    nextBtn.textContent = t.next;
    muteBtn.textContent = t.mute;
    autoplayLabel.textContent = t.autoplay;
    dropEl.textContent = t.drop;
    langBtn.textContent = t.languageLabel;

    updateListUI();
  }

  function closeLangPopup() {
    langPopup.style.display = 'none';
    langBtn.setAttribute('aria-expanded', 'false');
    langPopup.setAttribute('aria-hidden', 'true');
  }

  function openLangPopup() {
    langPopup.style.display = 'flex';
    langBtn.setAttribute('aria-expanded', 'true');
    langPopup.setAttribute('aria-hidden', 'false');
  }

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langPopup.style.display === 'flex';
    if (isOpen) closeLangPopup();
    else openLangPopup();
  });

  langPopup.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  Array.from(langPopup.querySelectorAll('button[data-lang]')).forEach((btn) => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
      closeLangPopup();
    });
  });

  document.addEventListener('click', () => {
    closeLangPopup();
  });

  function isYouTube(url) {
    return /youtube\.com|youtu\.be/.test(url);
  }

  function toYouTubeEmbed(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=${autoplayCheckbox.checked ? 1 : 0}&rel=0`;
      }
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v) {
          return `https://www.youtube.com/embed/${v}?autoplay=${autoplayCheckbox.checked ? 1 : 0}&rel=0`;
        }
      }
    } catch (e) {}
    return url;
  }

  function clearPlayer() {
    if (videoEl) {
      try { videoEl.pause(); } catch (e) {}
      if (lastObjectUrl) {
        URL.revokeObjectURL(lastObjectUrl);
        lastObjectUrl = null;
      }
      videoEl.remove();
      videoEl = null;
    }
    if (iframeEl) {
      iframeEl.remove();
      iframeEl = null;
    }
  }

  function renderPlayerFor(item) {
    clearPlayer();
    if (!item) return;

    if (item.type === 'youtube') {
      iframeEl = document.createElement('iframe');
      iframeEl.src = toYouTubeEmbed(item.src);
      iframeEl.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframeEl.allowFullscreen = true;
      iframeEl.style.position = 'relative';
      iframeEl.style.zIndex = '1';
      body.appendChild(iframeEl);
    } else {
      videoEl = document.createElement('video');
      videoEl.controls = true;
      videoEl.style.background = '#000';
      videoEl.src = item.src;
      videoEl.preload = 'metadata';
      videoEl.style.position = 'relative';
      videoEl.style.zIndex = '1';

      if (autoplayCheckbox.checked) {
        videoEl.autoplay = true;
        videoEl.muted = true;
        const p = videoEl.play();
        if (p && p.catch) p.catch(() => { videoEl.muted = false; });
      }

      videoEl.addEventListener('ended', () => playNext());
      body.appendChild(videoEl);
    }

    updateListUI();
  }

  function addUrlToPlaylist(url) {
    const item = {
      type: isYouTube(url) ? 'youtube' : 'url',
      src: url,
      name: url.split('?')[0].split('/').pop() || url
    };
    playlist.push(item);

    if (current === -1) current = playlist.length - 1;
    renderPlayerFor(playlist[current]);
    updateListUI();
  }

  function addFileToPlaylist(file) {
    const objectUrl = URL.createObjectURL(file);
    const item = {
      type: 'local',
      src: objectUrl,
      name: file.name,
      objectUrl
    };
    playlist.push(item);

    if (current === -1) current = playlist.length - 1;
    renderPlayerFor(playlist[current]);
    lastObjectUrl = objectUrl;
    updateListUI();
  }

  function updateListUI() {
    listEl.innerHTML = '';
    const t = I18N[currentLang];

    playlist.forEach((it, idx) => {
      const div = document.createElement('div');
      div.className = 'gf-vp-item';

      const label = document.createElement('div');
      label.style.flex = '1';
      label.style.overflow = 'hidden';
      label.style.textOverflow = 'ellipsis';
      label.style.whiteSpace = 'nowrap';
      label.style.paddingRight = '8px';
      label.textContent = `${idx === current ? '▶ ' : ''}${it.name}`;

      const btns = document.createElement('div');

      const playBtn = document.createElement('button');
      playBtn.textContent = t.play;
      playBtn.addEventListener('click', () => {
        current = idx;
        renderPlayerFor(playlist[current]);
      });

      const removeBtn = document.createElement('button');
      removeBtn.textContent = t.remove;
      removeBtn.addEventListener('click', () => {
        if (playlist[idx].objectUrl) URL.revokeObjectURL(playlist[idx].objectUrl);
        playlist.splice(idx, 1);

        if (playlist.length === 0) {
          current = -1;
          clearPlayer();
          updateListUI();
          return;
        }

        if (idx <= current) current = Math.max(0, current - 1);
        renderPlayerFor(playlist[current]);
        updateListUI();
      });

      btns.appendChild(playBtn);
      btns.appendChild(removeBtn);

      div.appendChild(label);
      div.appendChild(btns);
      listEl.appendChild(div);
    });
  }

  function playNext() {
    if (playlist.length === 0) return;
    current = (current + 1) % playlist.length;
    renderPlayerFor(playlist[current]);
  }

  function playPrev() {
    if (playlist.length === 0) return;
    current = (current - 1 + playlist.length) % playlist.length;
    renderPlayerFor(playlist[current]);
  }

  // 只允许在左侧 18px 区域拖动
  function startDrag(e) {
    const rect = modal.getBoundingClientRect();
    if (e.clientX > rect.left + 18) return;

    dragState = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    modal.setPointerCapture && modal.setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
  }

  function stopDrag() {
    dragState = null;
    document.body.style.userSelect = '';
  }

  dragZone.addEventListener('pointerdown', startDrag);

  window.addEventListener('pointermove', (e) => {
    if (!dragState) return;

    const x = e.clientX - dragState.x;
    const y = e.clientY - dragState.y;

    modal.style.left = x + 'px';
    modal.style.top = y + 'px';
    modal.style.transform = 'none';
  });

  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);

  topBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    clearPlayer();
    closeLangPopup();
  });

  loadUrlBtn.addEventListener('click', () => {
    const text = I18N[currentLang].promptLabel;
    const url = window.prompt(text, '');
    if (!url) return;
    addUrlToPlaylist(url.trim());
  });

  openFileBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    files.forEach(file => addFileToPlaylist(file));
    fileInput.value = '';
  });

  ['dragenter', 'dragover'].forEach((ev) => {
    modal.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      modal.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((ev) => {
    modal.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (ev !== 'drop') modal.classList.remove('dragover');
    });
  });

  modal.addEventListener('drop', (e) => {
    modal.classList.remove('dragover');
    const dt = e.dataTransfer;
    if (!dt) return;

    const files = Array.from(dt.files || []);
    if (files.length) {
      files.forEach(file => addFileToPlaylist(file));
    }

    const text = dt.getData && (dt.getData('text') || dt.getData('text/uri-list'));
    if (text && text.startsWith('http')) {
      addUrlToPlaylist(text);
    }
  });

  playPauseBtn.addEventListener('click', () => {
    if (videoEl) {
      if (videoEl.paused) videoEl.play();
      else videoEl.pause();
    } else if (iframeEl) {
      alert(I18N[currentLang].iframeAlert);
    }
  });

  prevBtn.addEventListener('click', playPrev);
  nextBtn.addEventListener('click', playNext);

  muteBtn.addEventListener('click', () => {
    if (videoEl) {
      videoEl.muted = !videoEl.muted;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;

    if (e.key === ' ' && !/input|textarea/i.test(document.activeElement && document.activeElement.tagName)) {
      e.preventDefault();
      if (videoEl) {
        if (videoEl.paused) videoEl.play();
        else videoEl.pause();
      }
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      fileInput.click();
    }

    if (e.key === 'Escape') {
      modal.style.display = 'none';
      clearPlayer();
      closeLangPopup();
    }
  });

  window.addEventListener('beforeunload', () => {
    try {
      const serial = playlist.map(item => ({
        type: item.type,
        src: item.type === 'local' ? null : item.src,
        name: item.name
      }));
      sessionStorage.setItem('gf_vp_playlist_meta', JSON.stringify(serial));
      sessionStorage.setItem('gf_vp_autoplay', autoplayCheckbox.checked ? '1' : '0');
    } catch (e) {}
  });

  try {
    const meta = JSON.parse(sessionStorage.getItem('gf_vp_playlist_meta') || '[]');
    const auto = sessionStorage.getItem('gf_vp_autoplay');
    if (auto !== null) autoplayCheckbox.checked = auto === '1';

    if (meta && meta.length) {
      meta.forEach(m => {
        if (m.type !== 'local' && m.src) {
          playlist.push({
            type: m.type,
            src: m.src,
            name: m.name
          });
        }
      });

      if (playlist.length) {
        current = 0;
        renderPlayerFor(playlist[0]);
        updateListUI();
      }
    }
  } catch (e) {}

  setLanguage(currentLang);
})();
// @match       https://www.geo-fs.com/*
// @match       https://geo-fs.com/*
// @grant       none
// ==/UserScript==

(function () {
  'use strict';

  const LANG_KEY = 'gf_vp_lang';
  const DEFAULT_LANG = 'zh';

  const I18N = {
    zh: {
      videoBtn: '视频',
      titleMain: 'GeoFS 视频播放器',
      titleSub: '由 哔哩哔哩-我是小猪05 小红书-起飞吧！凤凰牌飞机！ GitHub-zssszscnplane制作',
      loadUrl: '加载 URL',
      openFile: '选择文件',
      close: '关闭',
      playPause: '播放/暂停',
      prev: '上一个',
      next: '下一个',
      mute: '静音/取消',
      autoplay: '自动播放',
      drop: '将本地视频文件拖到此处以添加到列表',
      play: '播放',
      remove: '移除',
      languageLabel: 'Language',
    },
    en: {
      videoBtn: 'Video',
      titleMain: 'GeoFS Video Player',
      titleSub: 'Create by Bilibili-我是小猪05 Xiaohongshu-起飞吧！凤凰牌飞机！ GitHub-zssszscnplane',
      loadUrl: 'Load URL',
      openFile: 'Open File',
      close: 'Close',
      playPause: 'Play/Pause',
      prev: 'Prev',
      next: 'Next',
      mute: 'Mute/Unmute',
      autoplay: 'Autoplay',
      drop: 'Drop local video files here to add to playlist',
      play: 'Play',
      remove: 'Remove',
      languageLabel: 'Language',
      promptLabel: 'Enter video URL:'
    }
  };

  const css = `
  #gf-vp-btn {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 999999;
    background: rgba(0,0,0,0.6);
    color: #fff;
    border: none;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  #gf-vp-modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: min(700px, 70vw);
    height: min(450px, 70vh);
    background: rgba(18,18,18,0.98);
    color: #fff;
    z-index: 999998;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
    display: none;
    flex-direction: column;
    overflow: hidden;
    resize: both;
    padding-bottom: 72px;
  }

  #gf-vp-drag-zone {
    position: absolute;
    left: 0;
    top: 0;
    width: 18px;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0));
    border-right: 2px solid rgba(255,255,255,0.12);
    cursor: grab;
    z-index: 3;
  }

  #gf-vp-drag-zone:active {
    cursor: grabbing;
  }

  #gf-vp-title {
    padding: 8px 12px;
    text-align: center;
    font-size: 16px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    background: rgba(255,255,255,0.01);
    margin-left: 18px;
  }

  #gf-vp-lang-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255,255,255,0.01);
    border-bottom: 1px solid rgba(255,255,255,0.02);
    padding: 6px 0;
    margin-left: 18px;
  }

  #gf-vp-lang-btn {
    padding: 6px 10px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(0,0,0,0.25);
    color: #fff;
    cursor: pointer;
  }

  .gf-vp-lang-popup {
    position: absolute;
    left: calc(50% + 70px);
    top: 50%;
    transform: translateY(-50%);
    display: none;
    flex-direction: column;
    min-width: 140px;
    background: rgba(14,14,14,0.98);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 6px;
    box-shadow: 0 8px 22px rgba(0,0,0,0.5);
    z-index: 999999;
  }

  .gf-vp-lang-popup button {
    display: block;
    width: 100%;
    text-align: left;
    padding: 8px 10px;
    border: none;
    background: transparent;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
  }

  .gf-vp-lang-popup button:hover {
    background: rgba(255,255,255,0.04);
  }

  #gf-vp-header {
    display: flex;
    gap: 8px;
    padding: 8px;
    background: rgba(255,255,255,0.02);
    align-items: center;
    justify-content: center;
    margin-left: 18px;
  }

  #gf-vp-header button {
    padding: 6px 10px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    background: #2b7;
    color: #012;
    font-size: 12px;
  }

  #gf-vp-body {
    flex: 1;
    display: flex;
    background: #000;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-bottom: 8px;
    margin-left: 18px;
  }

  #gf-vp-body video, #gf-vp-body iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: #000;
    position: relative;
    z-index: 1;
  }

  #gf-vp-controls {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    gap: 8px;
    padding: 10px 12px;
    background: linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.28));
    align-items: center;
    z-index: 200000;
    box-sizing: border-box;
    margin-left: 18px;
  }

  #gf-vp-controls button {
    font-size: 12px;
    padding: 4px 8px;
  }

  #gf-vp-list {
    max-height: 120px;
    overflow: auto;
    background: rgba(255,255,255,0.02);
    padding: 6px;
    border-radius: 6px;
    width: 220px;
  }

  .gf-vp-item {
    padding: 6px;
    border-radius: 4px;
    margin-bottom: 6px;
    background: rgba(255,255,255,0.01);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
  }

  .gf-vp-item button {
    margin-left: 6px;
    font-size: 11px;
  }

  #gf-vp-drop {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.6);
    font-size: 16px;
    border: 2px dashed rgba(255,255,255,0.06);
    pointer-events: none;
    opacity: 0;
    transition: opacity .12s;
  }

  #gf-vp-modal.dragover #gf-vp-drop {
    pointer-events: auto;
    opacity: 1;
  }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  let currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  if (!['zh', 'en'].includes(currentLang)) currentLang = DEFAULT_LANG;

  const topBtn = document.createElement('button');
  topBtn.id = 'gf-vp-btn';
  topBtn.textContent = 'Video';
  document.body.appendChild(topBtn);

  const modal = document.createElement('div');
  modal.id = 'gf-vp-modal';
  modal.innerHTML = `
    <div id="gf-vp-drag-zone" title="拖动"></div>

    <div id="gf-vp-title">
      <span id="gf-vp-title-main">标题11</span><br>
      <span id="gf-vp-title-sub" style="font-size:12px;opacity:0.85">由 哔哩哔哩-我是小猪05 小红书-起飞吧！凤凰牌飞机！ GitHub-zssszscnplane制作</span>
    </div>

    <div id="gf-vp-lang-wrap">
      <button id="gf-vp-lang-btn" aria-expanded="false">Language</button>
      <div id="gf-vp-lang-popup" class="gf-vp-lang-popup" role="menu" aria-hidden="true">
        <button type="button" data-lang="zh">简体中文</button>
        <button type="button" data-lang="en">English</button>
      </div>
    </div>

    <div id="gf-vp-header">
      <button id="gf-vp-load-url">加载 URL</button>
      <button id="gf-vp-open-file">选择文件</button>
      <button id="gf-vp-close">关闭</button>
    </div>

    <div id="gf-vp-body">
      <div id="gf-vp-drop">将本地视频文件拖到此处以添加到列表</div>
    </div>

    <div id="gf-vp-controls">
      <button id="gf-vp-playpause">播放/暂停</button>
      <button id="gf-vp-prev">上一个</button>
      <button id="gf-vp-next">下一个</button>
      <button id="gf-vp-mute">静音/取消</button>
      <label style="margin-left:8px; font-size:12px;">
        <span id="gf-vp-autoplay-label">自动播放</span>
        <input id="gf-vp-autoplay" type="checkbox" checked />
      </label>
      <div style="flex:1"></div>
      <div id="gf-vp-list"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const body = modal.querySelector('#gf-vp-body');
  const dragZone = modal.querySelector('#gf-vp-drag-zone');
  const loadUrlBtn = modal.querySelector('#gf-vp-load-url');
  const openFileBtn = modal.querySelector('#gf-vp-open-file');
  const closeBtn = modal.querySelector('#gf-vp-close');
  const playPauseBtn = modal.querySelector('#gf-vp-playpause');
  const prevBtn = modal.querySelector('#gf-vp-prev');
  const nextBtn = modal.querySelector('#gf-vp-next');
  const muteBtn = modal.querySelector('#gf-vp-mute');
  const autoplayCheckbox = modal.querySelector('#gf-vp-autoplay');
  const autoplayLabel = modal.querySelector('#gf-vp-autoplay-label');
  const listEl = modal.querySelector('#gf-vp-list');
  const dropEl = modal.querySelector('#gf-vp-drop');
  const titleMain = modal.querySelector('#gf-vp-title-main');
  const titleSub = modal.querySelector('#gf-vp-title-sub');
  const langBtn = modal.querySelector('#gf-vp-lang-btn');
  const langPopup = modal.querySelector('#gf-vp-lang-popup');

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'video/*,audio/*';
  fileInput.multiple = true;
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  let playlist = [];
  let current = -1;
  let videoEl = null;
  let iframeEl = null;
  let lastObjectUrl = null;
  let dragState = null;

  function setLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'zh';
    localStorage.setItem(LANG_KEY, currentLang);

    const t = I18N[currentLang];

    topBtn.textContent = t.videoBtn;
    titleMain.textContent = t.titleMain;
    titleSub.textContent = t.titleSub;
    loadUrlBtn.textContent = t.loadUrl;
    openFileBtn.textContent = t.openFile;
    closeBtn.textContent = t.close;
    playPauseBtn.textContent = t.playPause;
    prevBtn.textContent = t.prev;
    nextBtn.textContent = t.next;
    muteBtn.textContent = t.mute;
    autoplayLabel.textContent = t.autoplay;
    dropEl.textContent = t.drop;
    langBtn.textContent = t.languageLabel;

    updateListUI();
  }

  function closeLangPopup() {
    langPopup.style.display = 'none';
    langBtn.setAttribute('aria-expanded', 'false');
    langPopup.setAttribute('aria-hidden', 'true');
  }

  function openLangPopup() {
    langPopup.style.display = 'flex';
    langBtn.setAttribute('aria-expanded', 'true');
    langPopup.setAttribute('aria-hidden', 'false');
  }

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langPopup.style.display === 'flex';
    if (isOpen) closeLangPopup();
    else openLangPopup();
  });

  langPopup.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  Array.from(langPopup.querySelectorAll('button[data-lang]')).forEach((btn) => {
    btn.addEventListener('click', () => {
      setLanguage(btn.getAttribute('data-lang'));
      closeLangPopup();
    });
  });

  document.addEventListener('click', () => {
    closeLangPopup();
  });

  function isYouTube(url) {
    return /youtube\.com|youtu\.be/.test(url);
  }

  function toYouTubeEmbed(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=${autoplayCheckbox.checked ? 1 : 0}&rel=0`;
      }
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v) {
          return `https://www.youtube.com/embed/${v}?autoplay=${autoplayCheckbox.checked ? 1 : 0}&rel=0`;
        }
      }
    } catch (e) {}
    return url;
  }

  function clearPlayer() {
    if (videoEl) {
      try { videoEl.pause(); } catch (e) {}
      if (lastObjectUrl) {
        URL.revokeObjectURL(lastObjectUrl);
        lastObjectUrl = null;
      }
      videoEl.remove();
      videoEl = null;
    }
    if (iframeEl) {
      iframeEl.remove();
      iframeEl = null;
    }
  }

  function renderPlayerFor(item) {
    clearPlayer();
    if (!item) return;

    if (item.type === 'youtube') {
      iframeEl = document.createElement('iframe');
      iframeEl.src = toYouTubeEmbed(item.src);
      iframeEl.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframeEl.allowFullscreen = true;
      iframeEl.style.position = 'relative';
      iframeEl.style.zIndex = '1';
      body.appendChild(iframeEl);
    } else {
      videoEl = document.createElement('video');
      videoEl.controls = true;
      videoEl.style.background = '#000';
      videoEl.src = item.src;
      videoEl.preload = 'metadata';
      videoEl.style.position = 'relative';
      videoEl.style.zIndex = '1';

      if (autoplayCheckbox.checked) {
        videoEl.autoplay = true;
        videoEl.muted = true;
        const p = videoEl.play();
        if (p && p.catch) p.catch(() => { videoEl.muted = false; });
      }

      videoEl.addEventListener('ended', () => playNext());
      body.appendChild(videoEl);
    }

    updateListUI();
  }

  function addUrlToPlaylist(url) {
    const item = {
      type: isYouTube(url) ? 'youtube' : 'url',
      src: url,
      name: url.split('?')[0].split('/').pop() || url
    };
    playlist.push(item);

    if (current === -1) current = playlist.length - 1;
    renderPlayerFor(playlist[current]);
    updateListUI();
  }

  function addFileToPlaylist(file) {
    const objectUrl = URL.createObjectURL(file);
    const item = {
      type: 'local',
      src: objectUrl,
      name: file.name,
      objectUrl
    };
    playlist.push(item);

    if (current === -1) current = playlist.length - 1;
    renderPlayerFor(playlist[current]);
    lastObjectUrl = objectUrl;
    updateListUI();
  }

  function updateListUI() {
    listEl.innerHTML = '';
    const t = I18N[currentLang];

    playlist.forEach((it, idx) => {
      const div = document.createElement('div');
      div.className = 'gf-vp-item';

      const label = document.createElement('div');
      label.style.flex = '1';
      label.style.overflow = 'hidden';
      label.style.textOverflow = 'ellipsis';
      label.style.whiteSpace = 'nowrap';
      label.style.paddingRight = '8px';
      label.textContent = `${idx === current ? '▶ ' : ''}${it.name}`;

      const btns = document.createElement('div');

      const playBtn = document.createElement('button');
      playBtn.textContent = t.play;
      playBtn.addEventListener('click', () => {
        current = idx;
        renderPlayerFor(playlist[current]);
      });

      const removeBtn = document.createElement('button');
      removeBtn.textContent = t.remove;
      removeBtn.addEventListener('click', () => {
        if (playlist[idx].objectUrl) URL.revokeObjectURL(playlist[idx].objectUrl);
        playlist.splice(idx, 1);

        if (playlist.length === 0) {
          current = -1;
          clearPlayer();
          updateListUI();
          return;
        }

        if (idx <= current) current = Math.max(0, current - 1);
        renderPlayerFor(playlist[current]);
        updateListUI();
      });

      btns.appendChild(playBtn);
      btns.appendChild(removeBtn);

      div.appendChild(label);
      div.appendChild(btns);
      listEl.appendChild(div);
    });
  }

  function playNext() {
    if (playlist.length === 0) return;
    current = (current + 1) % playlist.length;
    renderPlayerFor(playlist[current]);
  }

  function playPrev() {
    if (playlist.length === 0) return;
    current = (current - 1 + playlist.length) % playlist.length;
    renderPlayerFor(playlist[current]);
  }

  // 只允许在左侧 18px 区域拖动
  function startDrag(e) {
    const rect = modal.getBoundingClientRect();
    if (e.clientX > rect.left + 18) return;

    dragState = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    modal.setPointerCapture && modal.setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
  }

  function stopDrag() {
    dragState = null;
    document.body.style.userSelect = '';
  }

  dragZone.addEventListener('pointerdown', startDrag);

  window.addEventListener('pointermove', (e) => {
    if (!dragState) return;

    const x = e.clientX - dragState.x;
    const y = e.clientY - dragState.y;

    modal.style.left = x + 'px';
    modal.style.top = y + 'px';
    modal.style.transform = 'none';
  });

  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);

  topBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    clearPlayer();
    closeLangPopup();
  });

  loadUrlBtn.addEventListener('click', () => {
    const text = I18N[currentLang].promptLabel;
    const url = window.prompt(text, '');
    if (!url) return;
    addUrlToPlaylist(url.trim());
  });

  openFileBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    files.forEach(file => addFileToPlaylist(file));
    fileInput.value = '';
  });

  ['dragenter', 'dragover'].forEach((ev) => {
    modal.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      modal.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((ev) => {
    modal.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (ev !== 'drop') modal.classList.remove('dragover');
    });
  });

  modal.addEventListener('drop', (e) => {
    modal.classList.remove('dragover');
    const dt = e.dataTransfer;
    if (!dt) return;

    const files = Array.from(dt.files || []);
    if (files.length) {
      files.forEach(file => addFileToPlaylist(file));
    }

    const text = dt.getData && (dt.getData('text') || dt.getData('text/uri-list'));
    if (text && text.startsWith('http')) {
      addUrlToPlaylist(text);
    }
  });

  playPauseBtn.addEventListener('click', () => {
    if (videoEl) {
      if (videoEl.paused) videoEl.play();
      else videoEl.pause();
    } else if (iframeEl) {
      alert(I18N[currentLang].iframeAlert);
    }
  });

  prevBtn.addEventListener('click', playPrev);
  nextBtn.addEventListener('click', playNext);

  muteBtn.addEventListener('click', () => {
    if (videoEl) {
      videoEl.muted = !videoEl.muted;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;

    if (e.key === ' ' && !/input|textarea/i.test(document.activeElement && document.activeElement.tagName)) {
      e.preventDefault();
      if (videoEl) {
        if (videoEl.paused) videoEl.play();
        else videoEl.pause();
      }
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      fileInput.click();
    }

    if (e.key === 'Escape') {
      modal.style.display = 'none';
      clearPlayer();
      closeLangPopup();
    }
  });

  window.addEventListener('beforeunload', () => {
    try {
      const serial = playlist.map(item => ({
        type: item.type,
        src: item.type === 'local' ? null : item.src,
        name: item.name
      }));
      sessionStorage.setItem('gf_vp_playlist_meta', JSON.stringify(serial));
      sessionStorage.setItem('gf_vp_autoplay', autoplayCheckbox.checked ? '1' : '0');
    } catch (e) {}
  });

  try {
    const meta = JSON.parse(sessionStorage.getItem('gf_vp_playlist_meta') || '[]');
    const auto = sessionStorage.getItem('gf_vp_autoplay');
    if (auto !== null) autoplayCheckbox.checked = auto === '1';

    if (meta && meta.length) {
      meta.forEach(m => {
        if (m.type !== 'local' && m.src) {
          playlist.push({
            type: m.type,
            src: m.src,
            name: m.name
          });
        }
      });

      if (playlist.length) {
        current = 0;
        renderPlayerFor(playlist[0]);
        updateListUI();
      }
    }
  } catch (e) {}

  setLanguage(currentLang);
})();
