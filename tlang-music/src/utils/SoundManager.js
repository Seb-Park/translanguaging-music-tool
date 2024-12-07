class SoundManager {
  constructor() {
    this.sounds = {};
    this.playing = {};
    this.soundNames = [];
  }

  loadSound(name, url) {
    const audio = new Audio(url);
    this.sounds[name] = audio;
    this.sounds[name].loop = false;
    this.playing[name] = false;
    this.soundNames.push(name);
  }

  playSoundThrough(name) {
    if (this.sounds[name]) {
      this.playSound(name);
      return new Promise((resolve) => {
        this.sounds[name].addEventListener("ended", resolve);
        this.playSound(name);
      });
    } else {
      console.warn(`Sound ${name} not found.`);
      return;
    }
  }

  playSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play();
      this.playing[name] = true;
    }
  }

  stopSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].pause();
      this.sounds[name].currentTime = 0;
      this.playing[name] = false;
    }
  }

  wait(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  async playSequence(seq) {
    for (const name of seq) {
      if (this.sounds[name]) {
        await this.playSoundThrough(name);
      }
    }
  }

  async playSequenceTimed(clips, times) {
    if (Array.isArray(times) && clips.length === times.length) {
      for (let i = 0; i < clips.length; i++) {
        const clipName = clips[i];
        const time = times[i];
        const sound = this.sounds[clipName];

        this.playSound(clipName);
        await this.wait(time);
        this.stopSound(clipName);
      }
    } else if (Number.isInteger(times)) {
      for (let i = 0; i < clips.length; i++) {
        const clipName = clips[i];
        const time = times;
        const sound = this.sounds[clipName];
        console.log(clipName, i);

        this.playSound(clipName);
        await this.wait(time);
        this.stopSound(clipName);
      }
    }
  }

  stopAll() {
    for (const sound of this.soundNames) {
      this.stopSound(sound); // Doesn't work for pattern because the promise
                             // just keeps going
    }
  }
}

const defaultSoundManager = new SoundManager();

export default defaultSoundManager;
