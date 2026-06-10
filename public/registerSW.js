if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./src/sw.js', {
      type: 'module'
    }).then((reg) => {
      console.log('Service Worker registrato con successo:', reg.scope);
    }).catch((err) => {
      console.error('Errore registrazione Service Worker:', err);
    });
  });
}

self.addEventListener('activate', (event) => {
  console.log('Service Worker attivato!');
});