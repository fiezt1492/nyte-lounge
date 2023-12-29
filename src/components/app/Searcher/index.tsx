import { Button } from '@/components/ui/button'
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { peerStates } from '@/lib/atoms/PeerAtom'
import { playerStates } from '@/lib/atoms/PlayerAtom'
import apiService from '@/lib/services/api.service'
import { formatTime, getTrackThumbnail } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { toast } from 'sonner'
import TrackCard from './TrackCard'

type BasicOptionType = { label: string; value: string }

function Searcher() {
    const [inputValue, setInputValue] = useState('')
    const [options, setOptions] = useState<BasicOptionType[]>([])
    const [isShowResults, setIsShowResults] = useState(false)
    const [results, setResults] = useState<YouTubeTrack[]>([])
    const [playerStatesValue, setPlayerStates] = useRecoilState(playerStates)
    const peerStatesValue = useRecoilValue(peerStates)

    const playTrack = useCallback(
        (data: YouTubeTrack) => {
            if (
                peerStatesValue.roomConnected &&
                !peerStatesValue.isHost &&
                peerStatesValue.mode === 'broadcast'
            ) {
                toast.error(
                    `You're in a broadcast room so you cannot play a track`
                )
                return
            }
            if (
                playerStatesValue.track &&
                playerStatesValue.track.id === data.id
            ) {
                toast.error('This track is playing...')
                return
            }
            setPlayerStates((state) => ({ ...state, track: data }))
        },
        [peerStatesValue, playerStatesValue]
    )

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (inputValue.trim() === '') return setOptions([])
            if (!isShowResults)
                apiService.searchSuggestion(inputValue).then((response) => {
                    if (response) {
                        setOptions(
                            response.map((r: string) => {
                                return {
                                    value: r,
                                    label: r,
                                }
                            })
                        )
                    }
                })
        }, 1500)

        return () => clearTimeout(delayDebounceFn)
    }, [inputValue])

    useEffect(() => {
        ;(async () => {
            if (!isShowResults) return
            if (inputValue)
                apiService.search(inputValue).then((r) => {
                    setResults(
                        r.results.filter((item: any) => item.type === 'Video')
                    )
                })
        })()
    }, [isShowResults, inputValue])

    if (
        peerStatesValue.roomConnected &&
        !peerStatesValue.isHost &&
        peerStatesValue.mode === 'broadcast'
    )
        return (
            <div className="flex flex-col h-full p-6 max-h-screen w-full">
                <div className="font-semibold">
                    {`You cannot control the queue (seek or navigate), however you still can pause the music.`}
                </div>
                <div
                    className="aspect-square bg-cover bg-center w-full"
                    style={{
                        backgroundImage: `url('https://www.icegif.com/wp-content/uploads/2023/09/icegif-504.gif')`,
                    }}
                ></div>
            </div>
        )

    return (
        <div className="flex h-full p-6 max-h-screen">
            {!isShowResults && (
                <div className="w-full">
                    <Command>
                        <div className="flex w-full space-x-2 items-center">
                            <div className="flex-1">
                                <CommandInput
                                    placeholder="type a song name..."
                                    value={inputValue}
                                    onValueChange={(search) =>
                                        setInputValue(search)
                                    }
                                />
                            </div>
                            <Button
                                size="icon"
                                onClick={() => {
                                    if (!inputValue)
                                        toast.error("You didn't type anything")
                                    else setIsShowResults(true)
                                }}
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                        {/* <CommandEmpty>No song found.</CommandEmpty> */}
                        <CommandGroup>
                            {options.map((v) => (
                                <CommandItem
                                    key={v.value}
                                    value={v.label}
                                    onSelect={() => setInputValue(v.value)}
                                >
                                    {v.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </div>
            )}
            {isShowResults && (
                <div className="flex flex-col w-full h-full">
                    <Button
                        className="w-full"
                        onClick={() => setIsShowResults(false)}
                    >
                        Back
                    </Button>
                    <ScrollArea className="flex-1 w-full mt-4">
                        <ul className="space-y-2">
                            {results.map((item) => (
                                <li key={item.id}>
                                    <TrackCard
                                        item={item}
                                        onClick={() => playTrack(item)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </div>
            )}
        </div>
    )
}

export default Searcher
