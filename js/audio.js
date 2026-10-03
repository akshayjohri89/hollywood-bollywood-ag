/**
 * Audio Engine using Web Audio API
 * Generates all cinema sound effects dynamically without external audio files.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem("bh_sound_muted") === "true";
    this.masterGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.6, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    } else if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("bh_sound_muted", this.muted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.6, this.ctx.currentTime);
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Soft key click
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(480, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Correct letter revealed - pleasant chime
  playCorrect() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.001, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.3);
    });
  }

  // Strike letter from BOLLYWOOD / HOLLYWOOD - dramatic strike / low thud + buzz
  playStrike() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Heavy slate clapper / thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.2);

    // Dissonant sharp buzz
    const buzz = this.ctx.createOscillator();
    const buzzGain = this.ctx.createGain();
    buzz.type = "square";
    buzz.frequency.setValueAtTime(180, now + 0.03);
    buzz.frequency.setValueAtTime(160, now + 0.08);

    buzzGain.gain.setValueAtTime(0.15, now + 0.03);
    buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    buzz.connect(buzzGain);
    buzzGain.connect(this.masterGain);

    buzz.start(now + 0.03);
    buzz.stop(now + 0.25);
  }

  // Hint sound (sparkle)
  playHint() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [880, 1174.66, 1479.98].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.07);

      gain.gain.setValueAtTime(0.15, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.22);
    });
  }

  // Level cleared fanfare
  playLevelComplete() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Fanfare chords: G4 -> C5 -> E5 -> G5
    const notes = [
      { f: 392.00, t: 0.00, d: 0.12 },
      { f: 523.25, t: 0.12, d: 0.14 },
      { f: 659.25, t: 0.26, d: 0.16 },
      { f: 783.99, t: 0.42, d: 0.45 }
    ];

    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.01, now + n.t);
      gain.gain.linearRampToValueAtTime(0.3, now + n.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  }

  // Game over dramatic descent
  playGameOver() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [311.13, 293.66, 277.18, 246.94]; // Minor sad notes

    notes.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, now + idx * 0.22);

      gain.gain.setValueAtTime(0.25, now + idx * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.22 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.22);
      osc.stop(now + idx * 0.22 + 0.38);
    });
  }

  // 20 Levels Complete! Grand Finale
  playGrandVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      [523.25, 659.25, 783.99],          // C Maj
      [587.33, 739.99, 880.00],          // D Maj
      [659.25, 830.61, 987.77],          // E Maj
      [783.99, 1046.50, 1318.51, 1567.98] // C Maj Epic High
    ];

    chords.forEach((chord, i) => {
      const startTime = now + i * 0.28;
      chord.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, startTime);

        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + (i === 3 ? 1.4 : 0.4));

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + (i === 3 ? 1.5 : 0.45));
      });
    });
  }
}

// Global sound instance
window.soundEngine = new SoundEngine();
