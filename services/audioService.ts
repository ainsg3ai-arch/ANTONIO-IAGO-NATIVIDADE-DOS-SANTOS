
export const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a Portuguese Brazil voice
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR')) || voices.find(v => v.lang.includes('pt'));
    
    if (ptVoice) {
        utterance.voice = ptVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
};

// Initialize voices (sometimes they load asynchronously)
if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
}

// --- Sound Effects System (Oscillators) ---

let audioCtx: AudioContext | null = null;

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
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        osc.start(now);
        osc.stop(now + 0.15); // Short burst
    } else if (type === 'start') {
        // Rising tone
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'success') {
        // Major Chord Arpeggio
        const plays = [523.25, 659.25, 783.99, 1046.50]; // C Major
        plays.forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            
            o.type = 'sine';
            o.frequency.value = freq;
            g.gain.setValueAtTime(0.05, now + i * 0.1);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
            
            o.start(now + i * 0.1);
            o.stop(now + i * 0.1 + 0.6);
        });
    }
};
