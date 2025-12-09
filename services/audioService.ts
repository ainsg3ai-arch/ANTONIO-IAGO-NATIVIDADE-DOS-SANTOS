
// SINGLETON PATTERN PARA AUDIO CONTEXT
// Corrige erro crítico onde múltiplos contextos travavam o navegador (limite de 6-32 contextos).

let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;
let voicesLoaded = false;
let preferredVoice: SpeechSynthesisVoice | null = null;

const loadVoices = () => {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
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
    
    // Cancela imediatamente para evitar fila e lag
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (preferredVoice) utterance.voice = preferredVoice;
    else if (!voicesLoaded) {
        loadVoices();
        if (preferredVoice) utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.2; // Mais dinâmico
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Pequeno delay para garantir que o cancel funcionou
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 50);
};

export const initAudio = () => {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
            // Cria um GainNode global para controle mestre
            gainNode = audioCtx.createGain();
            gainNode.connect(audioCtx.destination);
        }
    }
    
    // Mobile browsers require resume on user interaction to unlock audio
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(e => console.error("Audio resume failed", e));
    }
    return audioCtx;
}

export const playTone = (type: 'beep' | 'start' | 'success') => {
    // Sempre reutiliza o contexto existente
    const ctx = initAudio();
    if (!ctx || !gainNode) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain(); // Ganho local para envelope

    osc.connect(gain);
    gain.connect(gainNode); // Conecta ao mestre

    if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.15); 
    } else if (type === 'start') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'success') {
        // Acorde simples para evitar criar muitos nós
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554, now + 0.1); // C#
        osc.frequency.setValueAtTime(659, now + 0.2); // E
        
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        
        osc.start(now);
        osc.stop(now + 0.4);
    }
    
    // Garbage collection manual para os nós
    osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
    };
};
