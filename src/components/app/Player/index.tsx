import React from 'react'
import { playerEl } from '@/components/providers/PlayerProvider'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import {
    TooltipProvider,
    TooltipTrigger,
    Tooltip,
    TooltipContent,
} from '@/components/ui/tooltip'
import { peerStates } from '@/lib/atoms/PeerAtom'
import { playerStates } from '@/lib/atoms/PlayerAtom'
import { formatTime, getTrackThumbnail } from '@/lib/utils'
import { FastForward, Pause, Play, Rewind } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import VolumeControl from './VolumeControl'
import { usePeerService } from '@/components/providers/PeerProvider'

function Player() {
    // const ref = useRef<ReactPlayer>(null)
    const peerService = usePeerService()
    const [peerStatesValue, setPeerStates] = useRecoilState(peerStates)
    const [playerStatesValue, setPlayerStates] = useRecoilState(playerStates)
    const [seekTime, setSeekTime] = useState(0)
    const [seeking, setSeeking] = useState(false)
    const { track, currentTime, paused, loading } = playerStatesValue
    const { connected, roomConnected, isHost, mode } = peerStatesValue

    useEffect(() => {
        if (!seeking) setSeekTime(currentTime || 0)
    }, [currentTime])
    return (
        <div className="flex h-full p-6 justify-center items-center bg-muted">
            <div className="w-full h-full flex flex-col justify-between max-w-2xl border rounded-sm px-8 shadow-lg bg-card">
                <TooltipProvider>
                    <div className="=w-full mb-6 flex-1 min-h-0 min-w-0">
                        <div className="flex flex-col space-y-8 items-center justify-center">
                            <div className="flex w-full items-center justify-center p-16 min-w-0">
                                <div
                                    className="rounded-sm bg-muted w-full bg-cover bg-center shadow-md aspect-square max-w-md z-50 backdrop-blur-sm drop-shadow-2xl"
                                    style={{
                                        backgroundImage: `url('${getTrackThumbnail(
                                            track
                                        )}')`,
                                    }}
                                />
                            </div>
                            <div className="w-full min-w-0">
                                <div className="font-bold h-8 drop-shadow-lg truncate">
                                    {track?.title.text || (
                                        <Skeleton className="h-8 w-[250px]" />
                                    )}
                                </div>
                                <div className="h-8 drop-shadow-md truncate">
                                    {track?.author.name || (
                                        <Skeleton className="h-6 w-[200px] mt-2" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <Slider
                                max={track?.duration.seconds ?? 0}
                                min={0}
                                value={[seekTime]}
                                onValueChange={([v]) => {
                                    setSeeking(true)
                                    setSeekTime(v)
                                }}
                                step={1}
                                disabled={
                                    connected &&
                                    roomConnected &&
                                    mode === 'broadcast' &&
                                    !isHost
                                }
                                onValueCommit={async ([value]) => {
                                    setSeeking(false)
                                    setPlayerStates((state) => ({
                                        ...state,
                                        currentTime: value,
                                        shouldUpdateBySeek: true,
                                    }))
                                    if (
                                        roomConnected &&
                                        ((mode === 'broadcast' && isHost) ||
                                            mode === 'group')
                                    ) {
                                        peerService?.sendAll({
                                            action: 'seek',
                                            data: value,
                                        })
                                    }
                                }}
                            />
                        </div>
                        <div className="flex justify-between pt-4">
                            <div className="text-sm text-muted-foreground">
                                {formatTime(currentTime)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {formatTime(track?.duration.seconds ?? 0)}
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <div className="flex items-center justify-between p-6 w-full max-w-sm">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size={'icon'}
                                        onClick={() => {
                                            setPlayerStates((state) => ({
                                                ...state,
                                                currentTime:
                                                    state.currentTime - 10,
                                                shouldUpdateBySeek: true,
                                            }))
                                        }}
                                        disabled={currentTime <= 10}
                                    >
                                        <Rewind />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Backward 10 seconds</p>
                                </TooltipContent>
                            </Tooltip>
                            <Button
                                size={'icon'}
                                onClick={() => {
                                    if (!playerEl || loading) return
                                    if (playerEl.paused) {
                                        return playerEl.play()
                                    } else return playerEl.pause()
                                }}
                                disabled={loading}
                            >
                                {paused ? <Play /> : <Pause />}
                            </Button>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size={'icon'}
                                        onClick={() => {
                                            setPlayerStates((state) => ({
                                                ...state,
                                                currentTime:
                                                    state.currentTime + 10,
                                                shouldUpdateBySeek: true,
                                            }))
                                        }}
                                        disabled={
                                            currentTime >=
                                            (track?.duration.seconds || 0) - 10
                                        }
                                    >
                                        <FastForward />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Forward 10 seconds</p>
                                </TooltipContent>
                            </Tooltip>
                            <VolumeControl />
                        </div>
                    </div>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default Player
