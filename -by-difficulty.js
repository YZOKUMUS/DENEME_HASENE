[33m8604c3f[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m Refactor game progress saving logic: Update saveCurrentGameProgress function to improve conditions for saving game state, enhance logging for better tracking, and replace currentGameMode with a more flexible gameModeKey for statistics updates. Ensure accurate tracking of game statistics and progress.
M	js/game-core.js
[33m86bab3d[m Add equal distribution shuffling for answer options: Implement shuffleWithEqualDistribution function in utils.js to ensure correct answers are evenly distributed across positions. Update game logic in game-core.js to utilize this new function for question loading and answer checking, enhancing gameplay fairness.
M	js/game-core.js
M	js/utils.js
[33mc20cd77[m Update game interface and logic: Change button text for review mode in index.html, enhance CSS styles for better readability, and improve handling of struggling words in game-core.js to ensure smoother gameplay experience.
M	index.html
M	js/game-core.js
M	style.css
[33m7abc308[m Implement intelligent word selection algorithm for game questions, enhancing question selection logic in startKelimeCevirGame and startDinleBulGame functions. Update comments for clarity.
M	js/game-core.js
[33ma0a697c[m Update service worker and data loading logic for improved caching and performance. Introduce separate cache for JSON data, enhance error handling, and implement non-blocking data preloading in the background.
M	js/data-loader.js
M	js/game-core.js
M	sw.js
[33mb742d78[m Add PWA install banner and functionality to index.html and style.css
M	index.html
M	style.css
[33m5afa76d[m Enhance PWA support by updating meta tags in index.html, modifying service worker registration in sw.js, and adjusting paths in manifest.json for improved caching and app functionality.
M	index.html
M	manifest.json
M	sw.js
[33mb9c2c43[m Initial commit: Hasene Arapça Dersi oyunu
A	.gitignore
A	HASENE_OYUN_TAM_DOKUMANTASYON.md
A	README.md
A	assets/badges/rozet1.png
A	assets/badges/rozet10.png
A	assets/badges/rozet11.png
A	assets/badges/rozet12.png
A	assets/badges/rozet14.png
A	assets/badges/rozet15.png
A	assets/badges/rozet16.png
A	assets/badges/rozet17.png
A	assets/badges/rozet18.png
A	assets/badges/rozet19.png
A	assets/badges/rozet2.png
A	assets/badges/rozet20.png
A	assets/badges/rozet21.png
A	assets/badges/rozet22.png
A	assets/badges/rozet23.png
A	assets/badges/rozet24.png
A	assets/badges/rozet25.png
A	assets/badges/rozet26.png
A	assets/badges/rozet27.png
A	assets/badges/rozet28.png
A	assets/badges/rozet29.png
A	assets/badges/rozet3.png
A	assets/badges/rozet30.png
A	assets/badges/rozet32.png
A	assets/badges/rozet33.png
A	assets/badges/rozet34.png
A	assets/badges/rozet35.png
A	assets/badges/rozet36.png
A	assets/badges/rozet4.png
A	assets/badges/rozet42.png
A	assets/badges/rozet5.png
A	assets/badges/rozet6.png
A	assets/badges/rozet7.png
A	assets/badges/rozet8.png
A	assets/badges/rozet9.png
A	assets/fonts/KFGQPC Uthmanic Script HAFS Regular.otf
A	assets/game-icons/ayet-oku.png
A	assets/game-icons/bosluk-doldur.png
A	assets/game-icons/dinle-bul.png
A	assets/game-icons/dua-et.png
A	assets/game-icons/hadis-oku.png
A	assets/game-icons/kelime-cevir.png
A	assets/images/clue.png
A	assets/images/hasene_hat.png
A	assets/images/hoparlor.png
A	assets/images/hoparlor.webp
A	assets/images/icon-192-v4-RED-MUSHAF.png
A	assets/images/icon-192.png
A	assets/images/icon-512-v4-RED-MUSHAF.png
A	assets/images/icon-512.png
A	assets/images/kapak.png
A	assets/images/yenilogo.png
A	check-difficulty-distribution.js
A	data/ayetoku.json
A	data/duaet.json
A	data/hadisoku.json
A	data/kelimebul.json
A	index.html
A	js/badge-visualization.js
A	js/config.js
A	js/constants.js
A	js/data-loader.js
A	js/detailed-stats.js
A	js/error-handler.js
A	js/game-core.js
A	js/indexeddb-cache.js
A	js/notifications.js
A	js/onboarding.js
A	js/utils.js
A	manifest.json
A	style.css
A	sw.js
