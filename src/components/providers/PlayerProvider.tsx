import { ReactNode, useEffect, useRef, useState } from 'react'
import apiService from '@/lib/services/api.service'
import { useRecoilState } from 'recoil'
import { playerStates } from '@/lib/atoms/PlayerAtom'
import { toast } from 'sonner'

interface PlayerProviderProps {
    children: ReactNode
}

export let playerEl: HTMLAudioElement | null = null

export default function PlayerProvider({ children }: PlayerProviderProps) {
    const [playingTrack, setPlayingTrack] = useState<YouTubeTrack | null>(null)
    const [playerStatesValue, setPlayerStates] = useRecoilState(playerStates)

    const { track, currentTime, shouldUpdateBySeek, volumeLevel, paused } =
        playerStatesValue
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (audioRef && audioRef.current) {
            const el = audioRef.current
            playerEl = el
            el.onpause = () => {
                setPlayerStates((state) => ({ ...state, paused: el.paused }))
            }
            el.ontimeupdate = () => {
                setPlayerStates((state) => ({
                    ...state,
                    currentTime: el.currentTime,
                }))
            }
            el.onended = () => {
                setPlayerStates((state) => ({
                    ...state,
                    url: '',
                    paused: true,
                    currentTime: 0,
                }))
            }
            el.onpause = () =>
                setPlayerStates((state) => ({ ...state, paused: el.paused }))
            el.onplay = () =>
                setPlayerStates((state) => ({ ...state, paused: el.paused }))
            el.onplaying = () =>
                setPlayerStates((state) => ({ ...state, paused: el.paused }))
            el.onloadstart = () =>
                setPlayerStates((state) => ({ ...state, loading: true }))
            el.oncanplay = () =>
                setPlayerStates((state) => ({ ...state, loading: false }))
            el.onerror = (event: any) => {
                if (event.target.error && event.target.error.code === 4) {
                    return toast.error(
                        'Seems like we got trouble while loading audio. Please try another track.'
                    )
                    // Handle the error here
                }
            }
        }
    }, [audioRef.current])

    useEffect(() => {
        const el = audioRef.current
        if (track && track.id !== playingTrack?.id && el) {
            el.pause()
            const currentTrack = track
            apiService.getPlayableUrl(currentTrack.id).then((response) => {
                const track = response.data[0]
                const url = track.url
                if (!audioRef.current) return
                audioRef.current.src = url
                audioRef.current.play().then(() => {
                    setPlayingTrack(track)
                })
            })
        }
    }, [track])

    useEffect(() => {
        if (!audioRef.current) return
        console.log('paused', paused)
        if (paused && !audioRef.current.paused) audioRef.current.pause()
    }, [paused])

    useEffect(() => {
        const el = audioRef.current
        if (shouldUpdateBySeek && el && el.currentTime !== currentTime) {
            el.currentTime = currentTime
            setPlayerStates((state) => ({
                ...state,
                shouldUpdateBySeek: false,
            }))
        }
    }, [shouldUpdateBySeek])

    useEffect(() => {
        if (!audioRef.current) return
        if (volumeLevel !== audioRef.current.volume) {
            audioRef.current.volume = volumeLevel / 100
        }
    }, [volumeLevel])

    return (
        <>
            <audio ref={audioRef} />
            {children}
        </>
    )
}
