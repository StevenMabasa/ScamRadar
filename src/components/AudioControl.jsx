import { Music2, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const sequence = [
  { bass: 49, chime: 196 },
  { bass: 55, chime: 246.94 },
  { bass: 65.41, chime: 293.66 },
  { bass: 55, chime: 220 },
  { bass: 73.42, chime: 329.63 },
  { bass: 65.41, chime: 277.18 },
  { bass: 55, chime: 261.63 },
  { bass: 49, chime: 196 },
];

function createTone(ctx, destination, { frequency, duration, type, gainValue, attack = 0.08, when = ctx.currentTime }) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, when);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(gainValue, when + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(when);
  oscillator.stop(when + duration + 0.08);
}

function createSoftChord(ctx, destination, rootFrequency, when = ctx.currentTime) {
  [1, 1.5, 2].forEach((ratio, index) => {
    createTone(ctx, destination, {
      frequency: rootFrequency * ratio,
      duration: 3.2,
      type: index === 0 ? 'sine' : 'triangle',
      gainValue: index === 0 ? 0.016 : 0.009,
      attack: 0.55,
      when: when + index * 0.04,
    });
  });
}

export default function AudioControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.12);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef({
    ctx: null,
    master: null,
    delay: null,
    feedback: null,
    pad: null,
    padTwo: null,
    padGain: null,
    lfo: null,
    interval: null,
    step: 0,
  });

  useEffect(() => {
    const savedVolume = Number(window.localStorage.getItem('scamradar-volume'));
    if (!Number.isNaN(savedVolume) && savedVolume >= 0 && savedVolume <= 0.3) {
      setVolume(savedVolume);
    }

    return () => {
      const audio = audioRef.current;
      if (audio.interval) window.clearInterval(audio.interval);
      if (audio.pad) audio.pad.stop();
      if (audio.padTwo) audio.padTwo.stop();
      if (audio.lfo) audio.lfo.stop();
      if (audio.ctx) audio.ctx.close();
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem('scamradar-volume', String(volume));
    if (audioRef.current.master) {
      audioRef.current.master.gain.setTargetAtTime(volume, audioRef.current.ctx.currentTime, 0.08);
    }
  }, [volume]);

  const scheduleStep = () => {
    const audio = audioRef.current;
    const ctx = audio.ctx;
    const destination = audio.delay;
    const item = sequence[audio.step % sequence.length];
    const now = ctx.currentTime;

    createTone(ctx, destination, {
      frequency: item.bass,
      duration: 1.45,
      type: 'sine',
      gainValue: 0.036,
      attack: 0.18,
      when: now,
    });

    if (audio.step % 2 === 0) {
      createTone(ctx, destination, {
        frequency: item.chime,
        duration: 1.15,
        type: 'triangle',
        gainValue: 0.014,
        attack: 0.22,
        when: now + 0.18,
      });
    }

    if (audio.step % 4 === 0) {
      createSoftChord(ctx, destination, item.bass, now + 0.08);
    }

    audio.step += 1;
  };

  const startAudio = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audio = audioRef.current;

    if (!audio.ctx) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const delay = ctx.createDelay();
      const feedback = ctx.createGain();
      const pad = ctx.createOscillator();
      const padTwo = ctx.createOscillator();
      const padGain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      master.gain.setValueAtTime(volume, ctx.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(980, ctx.currentTime);
      filter.Q.setValueAtTime(0.7, ctx.currentTime);
      delay.delayTime.setValueAtTime(0.42, ctx.currentTime);
      feedback.gain.setValueAtTime(0.28, ctx.currentTime);

      pad.type = 'sine';
      pad.frequency.setValueAtTime(110, ctx.currentTime);
      padTwo.type = 'triangle';
      padTwo.frequency.setValueAtTime(164.81, ctx.currentTime);
      padGain.gain.setValueAtTime(0.014, ctx.currentTime);
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.045, ctx.currentTime);
      lfoGain.gain.setValueAtTime(180, ctx.currentTime);

      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(filter);
      pad.connect(padGain);
      padTwo.connect(padGain);
      padGain.connect(filter);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      filter.connect(master);
      master.connect(ctx.destination);
      pad.start();
      padTwo.start();
      lfo.start();

      audio.ctx = ctx;
      audio.master = master;
      audio.delay = delay;
      audio.feedback = feedback;
      audio.pad = pad;
      audio.padTwo = padTwo;
      audio.padGain = padGain;
      audio.lfo = lfo;
    }

    await audio.ctx.resume();
    audio.master.gain.setTargetAtTime(volume, audio.ctx.currentTime, 0.08);
    scheduleStep();
    audio.interval = window.setInterval(scheduleStep, 1450);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (audio.interval) {
      window.clearInterval(audio.interval);
      audio.interval = null;
    }

    if (audio.master && audio.ctx) {
      audio.master.gain.setTargetAtTime(0.0001, audio.ctx.currentTime, 0.05);
    }

    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    startAudio();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="hud-card rounded-lg border border-cyber-cyan/30 bg-cyber-panel/95 p-3 shadow-glow backdrop-blur"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="flex items-center gap-3">
          <button
            aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
            className={`flex h-11 w-11 items-center justify-center rounded-lg border transition hover:-translate-y-0.5 ${
              isPlaying
                ? 'border-cyber-green/60 bg-cyber-green/15 text-cyber-green shadow-success'
                : 'border-cyber-line bg-slate-950 text-slate-300 hover:border-cyber-cyan hover:text-cyber-cyan'
            }`}
            onClick={toggleAudio}
            type="button"
          >
            {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>

          <div className="hidden sm:block">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
              <Music2 className="h-3.5 w-3.5 text-cyber-cyan" />
              Audio
            </p>
            <p className="text-sm font-bold text-white">{isPlaying ? 'Stealth ambience active' : 'Click to start'}</p>
          </div>
        </div>

        <div
          className={`${
            expanded || isPlaying ? 'mt-3 max-h-16 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden transition-all`}
        >
          <label className="block">
            <span className="sr-only">Background music volume</span>
            <input
              className="h-2 w-44 accent-cyber-cyan"
              max="0.3"
              min="0"
              onChange={(event) => setVolume(Number(event.target.value))}
              step="0.01"
              type="range"
              value={volume}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
