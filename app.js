/* NVDA TradingView — bootstrap minimal pour petit écran tactile */
(function () {
  const host = document.getElementById('tvHost');
  const btnRefresh = document.getElementById('btnRefresh');

  // Fix 100vh mobile (barres d’UI)
  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVH();
  window.addEventListener('resize', setVH);

  // Charge (ou recharge) le widget TradingView proprement
  function loadTradingView() {
    // purge
    host.innerHTML = '';

    // conteneur requis par TV
    const container = document.createElement('div');
    container.className = 'tradingview-widget-container';
    container.style.position = 'relative';
    container.style.display = 'grid';
    container.style.gridTemplateRows = '1fr auto';
    container.style.minHeight = '0';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.minHeight = '0'; // laisse s’étendre à 100%
    container.appendChild(widgetDiv);

    const small = document.createElement('div');
    small.className = 'tradingview-widget-copyright';
    small.innerHTML =
      '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">NVDA quotes by TradingView</span></a>';
    small.style.justifySelf = 'end';
    small.style.padding = '6px 8px';
    container.appendChild(small);

    host.appendChild(container);

    // Script TV + payload JSON inline
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';

    // IMPORTANT : payload doit être contenu en texte à l’intérieur du <script> pour TradingView
    // On force la transparence + thème dark + NVDA uniquement + autosize
    const payload = {
      lineWidth: 2,
      lineType: 0,
      chartType: "area",
      /* L’iframe ne prend pas notre police custom. On reste sur la charte TV côté widget. */
      fontColor: "rgb(106, 109, 120)",
      gridLineColor: "rgba(0, 0, 0, 0.06)",
      /* Couleurs bourse par défaut (vert/rouge) */
      upColor: "#22ab94",
      downColor: "#f7525f",
      borderUpColor: "#22ab94",
      borderDownColor: "#f7525f",
      wickUpColor: "#22ab94",
      wickDownColor: "#f7525f",
      volumeUpColor: "rgba(34, 171, 148, 0.5)",
      volumeDownColor: "rgba(247, 82, 95, 0.5)",
      widgetFontColor: "#DBDBDB",
      colorTheme: "dark",
      isTransparent: true,                 // ← fond iframe transparent
      backgroundColor: "rgba(0,0,0,0)",    // ← défense supplémentaire
      locale: "en",
      chartOnly: false,
      scalePosition: "right",
      scaleMode: "Normal",
      valuesTracking: "1",
      changeMode: "price-and-percent",
      symbols: [["NASDAQ:NVDA|1D"]],
      dateRanges: ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
      fontSize: "10",
      headerFontSize: "small",
      autosize: true,     // ← s’adapte au conteneur
      width: "100%",
      height: "100%",
      noTimeScale: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: true
      // Note: fontFamily custom n’affectera pas l’iframe TradingView
    };

    // Le script TradingView exige que son JSON soit *texte* du tag <script>
    script.text = JSON.stringify(payload);

    // Injection après avoir append le container
    container.appendChild(script);
  }

  btnRefresh.addEventListener('click', loadTradingView);

  // Gesture simple: double-tap pour refresh (utile en tactile)
  let lastTap = 0;
  host.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      loadTradingView();
    }
    lastTap = now;
  });

  // Charge initiale
  loadTradingView();
})();
