
let audioCtx: AudioContext | null = null;
let voicesLoaded = false;
let preferredVoice: SpeechSynthesisVoice | null = null;

const loadVoices = () => {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        // Tenta pegar Google Portugues, depois qualquer pt-BR, depois qualquer pt
        preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('pt-BR')) || 
                         voices.find(v => v.lang.includes('pt-BR')) || 
                         voices.find(v => v.lang.includes('pt'));
        voicesLoaded = true;
    }
};

if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

export const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any current speech to avoid queue buildup
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    } else if (!voicesLoaded) {
        // Tenta carregar novamente se ainda não carregou
        loadVoices();
        if (preferredVoice) utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.1; // Levemente mais rápido para treino
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
};


export const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

export const playTone = (type: 'beep' | 'start' | 'success') => {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'beep') {
        // High pitch beep for countdown
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.15); 
    } else if (type === 'start') {
        // Rising tone (Sci-fi style)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'success') {
        // Victory Chord
        const plays = [440, 554, 659]; // A Major
        plays.forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            
            o.type = 'square'; // Mais "gamey"
            o.frequency.value = freq;
            
            // Envelope ADSR simples
            g.gain.setValueAtTime(0, now + i * 0.1);
            g.gain.linearRampToValueAtTime(0.05, now + i * 0.1 + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
            
            o.start(now + i * 0.1);
            o.stop(now + i * 0.1 + 0.6);
        });
    }
};
