import { ReactNode, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import apiService from '@/services/api.service'
import { setPlayer } from '@/redux/slices/player.slice'
import { toast } from 'sonner'

interface PlayerProviderProps {
    children: ReactNode
}

export let playerEl: HTMLAudioElement | null = null

export default function PlayerProvider({ children }: PlayerProviderProps) {
    const dispatch = useAppDispatch()
    const [playingTrack, setPlayingTrack] = useState<YouTubeTrack | null>(null)
    const { track, currentTime, shouldUpdateBySeek, volumeLevel, paused } =
        useAppSelector((state) => state.player)
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (audioRef && audioRef.current) {
            const el = audioRef.current
            playerEl = el
            el.onpause = () => {
                dispatch(
                    setPlayer({
                        paused: el.paused,
                    })
                )
            }
            el.ontimeupdate = () => {
                dispatch(
                    setPlayer({
                        currentTime: el.currentTime,
                    })
                )
            }
            el.onended = () => {
                dispatch(
                    setPlayer({
                        track: null,
                        paused: true,
                        currentTime: 0,
                    })
                )
            }
            el.onpause = () => dispatch(setPlayer({ paused: el.paused }))
            el.onplay = () => dispatch(setPlayer({ paused: el.paused }))
            el.onplaying = () => dispatch(setPlayer({ paused: el.paused }))
            el.onloadstart = () => dispatch(setPlayer({ loading: true }))
            el.oncanplay = () => dispatch(setPlayer({ loading: false }))
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
            dispatch(
                setPlayer({
                    shouldUpdateBySeek: false,
                })
            )
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
