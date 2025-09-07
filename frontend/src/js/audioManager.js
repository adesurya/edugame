/**
 * Simple AudioManager for KidLearn Games
 */
class AudioManager {
  constructor() {
    this.masterVolume = 0.8;
    this.musicEnabled = true;
    this.soundEffectsEnabled = true;
    this.sounds = {};
    this.backgroundMusic = null;
    this.initialized = false;
    
    this.init();
  }
  
  init() {
    try {
      this.sounds = {
        click: this.createBeep(220, 0.1),
        correct: this.createBeep(440, 0.2),
        wrong: this.createBeep(150, 0.3),
        levelUp: this.createBeep(660, 0.4),
        gameStart: this.createBeep(330, 0.2),
        gameComplete: this.createBeep(880, 0.5)
      };
      
      this.initialized = true;
      console.log('Audio Manager initialized');
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }
  
  createBeep(frequency, duration) {
    return {
      play: () => {
        if (!this.soundEffectsEnabled) return;
        
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, audioContext.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
          // Fallback - do nothing if audio context fails
        }
      }
    };
  }
  
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
  
  toggleMusic(enabled) {
    this.musicEnabled = enabled;
  }
  
  toggleSoundEffects(enabled) {
    this.soundEffectsEnabled = enabled;
  }
  
  playSound(soundName) {
    if (this.sounds[soundName] && this.sounds[soundName].play) {
      this.sounds[soundName].play();
    }
  }
  
  playMusic() {
    // Placeholder for background music
  }
  
  stopMusic() {
    // Placeholder for background music
  }
}

window.AudioManager = AudioManager;