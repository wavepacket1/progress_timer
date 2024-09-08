enum AudioSingleton {
  INSTANCE = 'INSTANCE'
}

class AudioManager {
  private audio: HTMLAudioElement | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio('/sounds/menuettm.mp3');
    }
  }

  public static getInstance(): HTMLAudioElement {
    if (!(AudioSingleton.INSTANCE in AudioManager)) {
      (AudioManager as any)[AudioSingleton.INSTANCE] = new AudioManager();
    }
    return (AudioManager as any)[AudioSingleton.INSTANCE].audio;
  }
}

export default AudioManager;