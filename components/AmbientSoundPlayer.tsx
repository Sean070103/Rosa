'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export function AmbientSoundPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)

  const stopAudio = () => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.3)
      setTimeout(() => {
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.suspend()
        }
      }, 400)
    }
    setIsPlaying(false)
  }

  const startAudio = async () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx()
      }

      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume()
      }

      const ctx = audioCtxRef.current
      const master = ctx.createGain()
      master.gain.setValueAtTime(0.001, ctx.currentTime)
      master.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 1.0)
      master.connect(ctx.destination)
      masterGainRef.current = master

      // Gentle Lake Water Sound
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(320, ctx.currentTime)

      const lfo = ctx.createOscillator()
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime)
      const lfoGain = ctx.createGain()
      lfoGain.gain.setValueAtTime(160, ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(filter.frequency)
      lfo.start()

      const waveGain = ctx.createGain()
      waveGain.gain.setValueAtTime(0.12, ctx.currentTime)

      whiteNoise.connect(filter)
      filter.connect(waveGain)
      waveGain.connect(master)
      whiteNoise.start()

      // Soft 8-bit Rhodes / Ambient Chord (Dmaj9)
      const freqs = [146.83, 220.00, 277.18, 329.63]
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        const oscGain = ctx.createGain()
        oscGain.gain.setValueAtTime(0.01, ctx.currentTime)

        osc.connect(oscGain)
        oscGain.connect(master)
        osc.start()
      })

      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio()
    } else {
      startAudio()
    }
  }

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? 'MUTE AMBIANCE' : 'PLAY BAY AMBIANCE'}
      className="neo-btn flex items-center gap-1.5 bg-white px-2 py-1 font-arcade text-[8px] text-black hover:bg-[#FFE600]"
      aria-label="Toggle ambient waterfront audio"
    >
      {isPlaying ? (
        <>
          <span className="flex items-end gap-0.5 h-2.5">
            <span className="w-1 h-2.5 bg-black animate-pulse" />
            <span className="w-1 h-1.5 bg-black animate-pulse [animation-delay:150ms]" />
            <span className="w-1 h-3 bg-black animate-pulse [animation-delay:300ms]" />
          </span>
          <span>AUDIO: ON</span>
          <Volume2 className="size-3" />
        </>
      ) : (
        <>
          <span>AUDIO: OFF</span>
          <VolumeX className="size-3 opacity-60" />
        </>
      )}
    </button>
  )
}
