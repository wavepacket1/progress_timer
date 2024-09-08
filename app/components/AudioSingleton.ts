class AudioSingleton {
    private static instance: HTMLAudioElement;
  
    private constructor() {}
  
    public static getInstance(): HTMLAudioElement {
      if (!AudioSingleton.instance) {
        AudioSingleton.instance = new Audio('/sounds/menuettm.mp3');
      }
      return AudioSingleton.instance;
    }
  }
  
  export default AudioSingleton;