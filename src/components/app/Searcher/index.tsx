import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import React, { useEffect, useState } from 'react'
import apiService from '@/lib/services/api.service'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { formatTime, getTrackThumbnail } from '@/lib/utils'
import { appStatesValue } from '@/lib/atoms/AppValueSelector'
import { playerStates } from '@/lib/atoms/PlayerAtom'
import { getRecoilStore } from 'recoil-toolkit'

type BasicOptionType = { label: string; value: string }

function Searcher() {
    const [inputValue, setInputValue] = useState('')
    const [options, setOptions] = useState<BasicOptionType[]>([])
    const [isShowResults, setIsShowResults] = useState(false)
    const [results, setResults] = useState<YouTubeTrack[]>([])

    const playTrack = async (data: YouTubeTrack) => {
        const recoilStore = await getRecoilStore()
        const {
            peer,
            player: { track },
        } = await recoilStore.getPromise(appStatesValue)
        if (peer.roomConnected && !peer.isHost && peer.mode === 'broadcast') {
            toast.error(
                `You're in a broadcast room so you cannot modify the queue`
            )
            return
        }
        if (track && track.id === data.id) {
            toast.error('This track is playing...')
            return
        }
        recoilStore.set(playerStates, (state) => ({ ...state, track: data }))
    }

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
                                <li
                                    className="flex rounded-md border p-4 space-x-2 cursor-pointer hover:bg-accent"
                                    onClick={() => playTrack(item)}
                                    key={item.id}
                                >
                                    <div
                                        className="w-24 h-24 rounded-sm bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${getTrackThumbnail(
                                                item
                                            )})`,
                                        }}
                                    />
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <div className="text-md font-semibold">
                                            {item.title?.text}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatTime(
                                                item.duration.seconds || 0
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Button>Play</Button>
                                    </div>
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
