import { registerSW } from 'virtual:pwa-register';

registerSW({
    immediate: true,
    onRegistered(r) {
        console.log('PWA registrata:', r);
    },
    onRegisterError(err) {
        console.error('Errore nella registrazione PWA:', err);
    },
});
