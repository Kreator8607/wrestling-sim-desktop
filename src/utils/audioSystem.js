/**
 * Audio System for Pro Wrestling Sim
 * Manages sound effects, background music, and audio settings
 */

export const AudioSystem = {
  // Audio contexts
  audioContext: null,
  backgroundMusic: null,
  soundEffects: new Map(),
  
  // Settings
  settings: {
    masterVolume: 0.7,
    musicVolume: 0.5,
    sfxVolume: 0.7,
    musicEnabled: true,
    sfxEnabled: true,
  },

  /**
   * Initialize audio system
   */
  init() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.loadSettings();
      console.log('Audio system initialized');
    } catch (e) {
      console.warn('Audio context not available:', e);
    }
  },

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('audioSettings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load audio settings:', e);
    }
  },

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem('audioSettings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save audio settings:', e);
    }
  },

  /**
   * Generate sine wave tone (for sound effects)
   */
  generateTone(frequency, duration, volume = 0.3) {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume * this.settings.masterVolume * this.settings.sfxVolume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  },

  /**
   * Play click sound
   */
  playClick() {
    if (!this.settings.sfxEnabled) return;
    this.generateTone(800, 0.1, 0.2);
  },

  /**
   * Play success sound
   */
  playSuccess() {
    if (!this.settings.sfxEnabled) return;
    this.generateTone(800, 0.1, 0.2);
    setTimeout(() => this.generateTone(1000, 0.1, 0.2), 100);
  },

  /**
   * Play error sound
   */
  playError() {
    if (!this.settings.sfxEnabled) return;
    this.generateTone(400, 0.15, 0.2);
    setTimeout(() => this.generateTone(300, 0.15, 0.2), 100);
  },

  /**
   * Play notification sound
   */
  playNotification() {
    if (!this.settings.sfxEnabled) return;
    this.generateTone(600, 0.08, 0.2);
    setTimeout(() => this.generateTone(800, 0.08, 0.2), 80);
  },

  /**
   * Play achievement sound
   */
  playAchievement() {
    if (!this.settings.sfxEnabled) return;
    const frequencies = [523, 659, 784, 1047]; // C, E, G, C (major chord)
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.generateTone(freq, 0.3, 0.25), index * 100);
    });
  },

  /**
   * Play match start sound
   */
  playMatchStart() {
    if (!this.settings.sfxEnabled) return;
    this.generateTone(1000, 0.2, 0.3);
    setTimeout(() => this.generateTone(1200, 0.2, 0.3), 150);
  },

  /**
   * Play match end sound
   */
  playMatchEnd() {
    if (!this.settings.sfxEnabled) return;
    const frequencies = [800, 600, 400];
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.generateTone(freq, 0.15, 0.25), index * 150);
    });
  },

  /**
   * Play victory sound
   */
  playVictory() {
    if (!this.settings.sfxEnabled) return;
    const frequencies = [523, 659, 784, 1047, 1047, 1047]; // Ascending then hold
    frequencies.forEach((freq, index) => {
      if (index < 3) {
        setTimeout(() => this.generateTone(freq, 0.15, 0.25), index * 100);
      } else {
        setTimeout(() => this.generateTone(freq, 0.3, 0.25), 300 + (index - 3) * 100);
      }
    });
  },

  /**
   * Play defeat sound
   */
  playDefeat() {
    if (!this.settings.sfxEnabled) return;
    const frequencies = [523, 440, 349, 262]; // Descending
    frequencies.forEach((freq, index) => {
      setTimeout(() => this.generateTone(freq, 0.2, 0.25), index * 150);
    });
  },

  /**
   * Play background music (simulated)
   */
  playBackgroundMusic() {
    if (!this.settings.musicEnabled) return;
    // In a real implementation, this would play actual audio files
    // For now, we'll use a simple oscillator pattern
    this.generateBackgroundMusicPattern();
  },

  /**
   * Generate background music pattern
   */
  generateBackgroundMusicPattern() {
    if (!this.audioContext) return;

    const frequencies = [
      { freq: 440, duration: 0.5 }, // A
      { freq: 494, duration: 0.5 }, // B
      { freq: 523, duration: 0.5 }, // C
      { freq: 587, duration: 0.5 }, // D
      { freq: 659, duration: 0.5 }, // E
      { freq: 587, duration: 0.5 }, // D
      { freq: 523, duration: 0.5 }, // C
      { freq: 494, duration: 0.5 }, // B
    ];

    let delay = 0;
    frequencies.forEach(({ freq, duration }) => {
      setTimeout(() => {
        this.generateTone(freq, duration, 0.1);
      }, delay * 1000);
      delay += duration;
    });
  },

  /**
   * Stop all audio
   */
  stopAll() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  },

  /**
   * Set master volume
   */
  setMasterVolume(volume) {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  },

  /**
   * Set music volume
   */
  setMusicVolume(volume) {
    this.settings.musicVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  },

  /**
   * Set SFX volume
   */
  setSFXVolume(volume) {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  },

  /**
   * Toggle music
   */
  toggleMusic() {
    this.settings.musicEnabled = !this.settings.musicEnabled;
    this.saveSettings();
  },

  /**
   * Toggle SFX
   */
  toggleSFX() {
    this.settings.sfxEnabled = !this.settings.sfxEnabled;
    this.saveSettings();
  },

  /**
   * Get settings
   */
  getSettings() {
    return { ...this.settings };
  },
};

/**
 * React Hook for Audio System
 */
export function useAudio() {
  const [audioReady, setAudioReady] = React.useState(false);
  const [settings, setSettings] = React.useState(AudioSystem.getSettings());

  React.useEffect(() => {
    AudioSystem.init();
    setAudioReady(true);

    return () => {
      AudioSystem.stopAll();
    };
  }, []);

  const updateSettings = (newSettings) => {
    AudioSystem.settings = { ...AudioSystem.settings, ...newSettings };
    AudioSystem.saveSettings();
    setSettings(AudioSystem.getSettings());
  };

  return {
    audioReady,
    settings,
    updateSettings,
    playClick: () => AudioSystem.playClick(),
    playSuccess: () => AudioSystem.playSuccess(),
    playError: () => AudioSystem.playError(),
    playNotification: () => AudioSystem.playNotification(),
    playAchievement: () => AudioSystem.playAchievement(),
    playMatchStart: () => AudioSystem.playMatchStart(),
    playMatchEnd: () => AudioSystem.playMatchEnd(),
    playVictory: () => AudioSystem.playVictory(),
    playDefeat: () => AudioSystem.playDefeat(),
  };
}

/**
 * Sound effect triggers
 */
export const SoundEffects = {
  /**
   * Trigger sound on button click
   */
  onButtonClick(element) {
    element?.addEventListener('click', () => {
      AudioSystem.playClick();
    });
  },

  /**
   * Trigger sound on form submit
   */
  onFormSubmit(element) {
    element?.addEventListener('submit', () => {
      AudioSystem.playSuccess();
    });
  },

  /**
   * Trigger sound on error
   */
  onError() {
    AudioSystem.playError();
  },

  /**
   * Trigger sound on success
   */
  onSuccess() {
    AudioSystem.playSuccess();
  },

  /**
   * Trigger sound on notification
   */
  onNotification() {
    AudioSystem.playNotification();
  },

  /**
   * Trigger sound on achievement unlock
   */
  onAchievementUnlock() {
    AudioSystem.playAchievement();
  },

  /**
   * Trigger sound on match start
   */
  onMatchStart() {
    AudioSystem.playMatchStart();
  },

  /**
   * Trigger sound on match end
   */
  onMatchEnd() {
    AudioSystem.playMatchEnd();
  },

  /**
   * Trigger sound on victory
   */
  onVictory() {
    AudioSystem.playVictory();
  },

  /**
   * Trigger sound on defeat
   */
  onDefeat() {
    AudioSystem.playDefeat();
  },
};
