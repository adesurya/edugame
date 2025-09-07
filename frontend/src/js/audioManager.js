/**
 * Fixed AudioManager untuk mengatasi WebAudio Context errors
 */
class AudioManager {
  constructor() {
    this.masterVolume = 0.8;
    this.musicEnabled = true;
    this.soundEffectsEnabled = true;
    this.sounds = {};
    this.backgroundMusic = null;
    this.initialized = false;
    this.audioContext = null;
    this.audioContextState = 'suspended';
    
    // Throttle audio context creation to prevent flooding
    this.lastContextCreation = 0;
    this.contextCreationThrottle = 1000; // 1 second
    
    this.init();
  }
  
  init() {
    try {
      // Create simple sound effects without Web Audio API initially
      this.sounds = {
        click: this.createSimpleBeep(220, 0.1),
        correct: this.createSimpleBeep(440, 0.2), 
        wrong: this.createSimpleBeep(150, 0.3),
        levelUp: this.createSimpleBeep(660, 0.4),
        gameStart: this.createSimpleBeep(330, 0.2),
        gameComplete: this.createSimpleBeep(880, 0.5)
      };
      
      this.initialized = true;
      console.log('Audio Manager initialized (simple mode)');
      
      // Try to initialize Web Audio API with user interaction
      this.setupUserActivatedAudio();
      
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      this.setupFallbackAudio();
    }
  }
  
  setupUserActivatedAudio() {
    // Wait for user interaction before creating AudioContext
    const enableAudio = () => {
      if (!this.audioContext && this.canCreateAudioContext()) {
        this.initializeWebAudio();
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };
    
    // Add listeners for user interaction
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    document.addEventListener('keydown', enableAudio);
  }
  
  canCreateAudioContext() {
    const now = Date.now();
    return (now - this.lastContextCreation) > this.contextCreationThrottle;
  }
  
  initializeWebAudio() {
    try {
      this.lastContextCreation = Date.now();
      
      // Create AudioContext with error handling
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported');
        return;
      }
      
      this.audioContext = new AudioContextClass();
      this.audioContextState = this.audioContext.state;
      
      // Handle audio context state changes
      this.audioContext.addEventListener('statechange', () => {
        this.audioContextState = this.audioContext.state;
        console.log('Audio context state changed to:', this.audioContextState);
      });
      
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          console.log('Audio context resumed');
        }).catch(error => {
          console.warn('Failed to resume audio context:', error);
        });
      }
      
      // Recreate sounds with Web Audio API
      this.createWebAudioSounds();
      
      console.log('Web Audio API initialized successfully');
      
    } catch (error) {
      console.warn('Web Audio API initialization failed:', error);
      this.audioContext = null;
    }
  }
  
  createWebAudioSounds() {
    if (!this.audioContext) return;
    
    try {
      this.sounds = {
        click: this.createWebAudioBeep(220, 0.1),
        correct: this.createWebAudioBeep(440, 0.2),
        wrong: this.createWebAudioBeep(150, 0.3),
        levelUp: this.createWebAudioBeep(660, 0.4),
        gameStart: this.createWebAudioBeep(330, 0.2),
        gameComplete: this.createWebAudioBeep(880, 0.5)
      };
    } catch (error) {
      console.warn('Failed to create Web Audio sounds:', error);
    }
  }
  
  createSimpleBeep(frequency, duration) {
    return {
      play: () => {
        if (!this.soundEffectsEnabled) return;
        
        // Simple fallback using HTML5 Audio or silent operation
        console.log(`Playing simple beep: ${frequency}Hz for ${duration}s`);
        
        // You could implement HTML5 Audio beeps here if needed
        // For now, we'll just log the action
      }
    };
  }
  
  createWebAudioBeep(frequency, duration) {
    return {
      play: () => {
        if (!this.soundEffectsEnabled || !this.audioContext) {
          return;
        }
        
        try {
          // Check if audio context is in a valid state
          if (this.audioContext.state === 'closed') {
            console.warn('Audio context is closed');
            return;
          }
          
          // Resume context if suspended
          if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(error => {
              console.warn('Failed to resume audio context:', error);
            });
            return;
          }
          
          // Create oscillator and gain nodes
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          // Set up volume envelope
          const now = this.audioContext.currentTime;
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, now + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
          
          oscillator.start(now);
          oscillator.stop(now + duration);
          
        } catch (error) {
          console.warn('Failed to play Web Audio beep:', error);
          // Fallback to simple beep
          this.createSimpleBeep(frequency, duration).play();
        }
      }
    };
  }
  
  setupFallbackAudio() {
    console.log('Setting up fallback audio system');
    
    this.sounds = {
      click: { play: () => console.log('♪ Click sound') },
      correct: { play: () => console.log('♪ Correct sound') },
      wrong: { play: () => console.log('♪ Wrong sound') },
      levelUp: { play: () => console.log('♪ Level up sound') },
      gameStart: { play: () => console.log('♪ Game start sound') },
      gameComplete: { play: () => console.log('♪ Game complete sound') }
    };
    
    this.initialized = true;
  }
  
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    console.log(`Master volume set to: ${this.masterVolume * 100}%`);
  }
  
  toggleMusic(enabled) {
    this.musicEnabled = enabled;
    console.log(`Background music ${enabled ? 'enabled' : 'disabled'}`);
    
    if (!enabled && this.backgroundMusic) {
      this.stopMusic();
    }
  }
  
  toggleSoundEffects(enabled) {
    this.soundEffectsEnabled = enabled;
    console.log(`Sound effects ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  playSound(soundName) {
    if (!this.soundEffectsEnabled || !this.initialized) {
      return;
    }
    
    try {
      if (this.sounds[soundName] && this.sounds[soundName].play) {
        this.sounds[soundName].play();
      } else {
        console.warn(`Sound "${soundName}" not found`);
      }
    } catch (error) {
      console.warn(`Failed to play sound "${soundName}":`, error);
    }
  }
  
  playMusic(musicUrl) {
    if (!this.musicEnabled) {
      return;
    }
    
    try {
      // Placeholder for background music implementation
      console.log(`Playing background music: ${musicUrl}`);
      
      // You could implement HTML5 Audio for background music here
      // this.backgroundMusic = new Audio(musicUrl);
      // this.backgroundMusic.loop = true;
      // this.backgroundMusic.volume = this.masterVolume * 0.5;
      // this.backgroundMusic.play();
      
    } catch (error) {
      console.warn('Failed to play background music:', error);
    }
  }
  
  stopMusic() {
    try {
      if (this.backgroundMusic) {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
        this.backgroundMusic = null;
      }
      console.log('Background music stopped');
    } catch (error) {
      console.warn('Failed to stop background music:', error);
    }
  }
  
  pauseMusic() {
    try {
      if (this.backgroundMusic && !this.backgroundMusic.paused) {
        this.backgroundMusic.pause();
        console.log('Background music paused');
      }
    } catch (error) {
      console.warn('Failed to pause background music:', error);
    }
  }
  
  resumeMusic() {
    try {
      if (this.backgroundMusic && this.backgroundMusic.paused && this.musicEnabled) {
        this.backgroundMusic.play();
        console.log('Background music resumed');
      }
    } catch (error) {
      console.warn('Failed to resume background music:', error);
    }
  }
  
  destroy() {
    try {
      // Stop all audio
      this.stopMusic();
      
      // Close audio context if it exists
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close().then(() => {
          console.log('Audio context closed');
        }).catch(error => {
          console.warn('Failed to close audio context:', error);
        });
      }
      
      // Clear references
      this.sounds = {};
      this.audioContext = null;
      this.backgroundMusic = null;
      this.initialized = false;
      
      console.log('Audio Manager destroyed');
      
    } catch (error) {
      console.warn('Error during audio manager destruction:', error);
    }
  }
  
  // Get audio context state for debugging
  getAudioContextState() {
    return {
      hasContext: !!this.audioContext,
      state: this.audioContext ? this.audioContext.state : 'none',
      initialized: this.initialized,
      masterVolume: this.masterVolume,
      musicEnabled: this.musicEnabled,
      soundEffectsEnabled: this.soundEffectsEnabled
    };
  }
  
  // Test audio functionality
  testAudio() {
    console.log('Testing audio system...');
    console.log('Audio context state:', this.getAudioContextState());
    
    if (this.soundEffectsEnabled) {
      console.log('Playing test sounds...');
      setTimeout(() => this.playSound('click'), 100);
      setTimeout(() => this.playSound('correct'), 600);
      setTimeout(() => this.playSound('levelUp'), 1100);
    }
  }
}

window.AudioManager = AudioManager;