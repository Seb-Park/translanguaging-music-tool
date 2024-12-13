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

  //   async playSoundForTime(name, time) {
  //     if (this.sounds[name]) {
  //       this.sounds[name].currentTime = 0;
  //       await this.sounds[name].play();
  //       this.playing[name] = true;
  //       await this.wait(time);
  //       await this.sounds[name].pause();
  //       console.log(this.sounds[name].currentTime);
  //       this.sounds[name].currentTime = 0;
  //       this.playing[name] = false;
  //     }
  //   }

  async playSoundForTime(name, time) {
    if (this.sounds[name]) {
      if (time < 0) {
        await this.playSoundThrough(name);
      } else {
        this.sounds[name].currentTime = 0;
        const startTime = Date.now();
        await this.waitForPlaying(this.sounds[name]);
        // Attempt at fixing the fact that the sound doesn't always play right
        // away when it's first played so the first one gets timed and then gets
        // cut off too early because it didn't start as soon as it got timed.
        // Doesn't work.
        this.playing[name] = true;
        await this.wait(time);
        //   await this.wait(time + (Date.now() - startTime) * 10);
        await this.sounds[name].pause();
        //   console.log(this.sounds[name].currentTime);
        this.sounds[name].currentTime = 0;
        this.playing[name] = false;
      }
    }
  }

  waitForPlaying(audio) {
    return new Promise((resolve, reject) => {
      const startedPlaying = Date.now();

      const onPlaying = () => {
        // console.log(Date.now() - startedPlaying);
        audio.removeEventListener("playing", onPlaying);
        resolve();
      };

      const onError = (error) => {
        audio.removeEventListener("playing", onPlaying);
        reject(error);
      };

      audio.addEventListener("playing", onPlaying);
      audio.addEventListener("error", onError);

      audio.play().catch((err) => {
        audio.removeEventListener("playing", onPlaying);
        audio.removeEventListener("error", onError);
        reject(err);
      });
    });
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

        // this.playSound(clipName);
        // await this.wait(time);
        // this.stopSound(clipName);
        await this.playSoundForTime(clipName, time);
      }
    } else if (Number.isInteger(times)) {
      for (let i = 0; i < clips.length; i++) {
        const clipName = clips[i];
        const time = times;

        // this.playSound(clipName);
        // await this.wait(time);
        // this.stopSound(clipName);
        await this.playSoundForTime(clipName, time);
      }
    }
  }

  stopAll() {
    for (const sound of this.soundNames) {
      this.stopSound(sound); // Doesn't work for pattern because the promise
      // just keeps going
      // Idea: Instead just have some "hash" and if the "hash"
      // doesn't match what's being played then break out
      // of the loop
    }
  }
}

const defaultSoundManager = new SoundManager();

export default defaultSoundManager;
