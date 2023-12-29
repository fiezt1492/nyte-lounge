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

function AudioControl() {
    // const ref = useRef<ReactPlayer>(null)
    const [peerStatesValue, setPeerStates] = useRecoilState(peerStates)
    const [playerStatesValue, setPlayerStates] = useRecoilState(playerStates)
    const [seekTime, setSeekTime] = useState(0)
    const [seeking, setSeeking] = useState(false)
    const { track, currentTime, paused, loading } = playerStatesValue
    const { connected, roomConnected, isHost, mode } = peerStatesValue

    useEffect(() => {
        if (!seeking) setSeekTime(currentTime || 0)
    }, [currentTime])

    // if (!track) return
    return (
        <div className="w-full h-full flex flex-col justify-between">
            <TooltipProvider>
                <div className="flex w-full mb-6 flex-1 min-h-0 min-w-0">
                    <div
                        className="bg-muted h-full bg-cover bg-center shadow-md aspect-square"
                        style={{
                            backgroundImage: `url('${getTrackThumbnail(
                                track
                            )}')`,
                        }}
                    />
                    <div className="flex-1 w-full ml-6">
                        <div className="font-bold">
                            {track?.title.text || (
                                <Skeleton className="h-8 w-[250px]" />
                            )}
                        </div>
                        <div className="">
                            {track?.author.name || (
                                <Skeleton className="h-6 w-[200px] mt-2" />
                            )}
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
                                const peerService = (
                                    await import('@/lib/services/peer.service')
                                ).default
                                if (
                                    roomConnected &&
                                    ((mode === 'broadcast' && isHost) ||
                                        mode === 'group')
                                ) {
                                    peerService.sendAll({
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
                                            currentTime: state.currentTime - 10,
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
                            className={'bg-black text-lg font-bold text-white'}
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
                                            currentTime: state.currentTime + 10,
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
                    </div>
                </div>
            </TooltipProvider>
        </div>
    )
}

export default AudioControl
