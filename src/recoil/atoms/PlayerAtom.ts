import { atom } from 'recoil'

export type PlayerStates = {
    track: YouTubeTrack | null
    paused: boolean
    currentTime: number
    shouldUpdateBySeek: boolean
    loading: boolean
    volumeLevel: number
}

const initialStates: PlayerStates = {
    track: null,
    paused: false,
    currentTime: 0,
    shouldUpdateBySeek: false,
    loading: true,
    volumeLevel: 100,
}

export const playerStates = atom({
    key: 'AudioPlayerStates',
    default: initialStates,
})
