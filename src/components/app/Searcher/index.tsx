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

type BasicOptionType = { label: string; value: string }

function Searcher() {
    const [inputValue, setInputValue] = useState('')
    const [options, setOptions] = useState<BasicOptionType[]>([])
    const [isShowResults, setIsShowResults] = useState(false)
    const [results, setResults] = useState<YouTubeTrack[]>([])

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
        }, 3000)

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
        <div className="flex h-full p-6">
            {!isShowResults && (
                <div className="w-full">
                    <Command>
                        <div className="flex w-full space-x-2">
                            <CommandInput
                                placeholder="type a song name..."
                                value={inputValue}
                                onValueChange={(search) =>
                                    setInputValue(search)
                                }
                            />
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
                            {results.map((v) => (
                                <li
                                    className="rounded-md border p-4"
                                    key={v.id}
                                >
                                    {v.title?.text}
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
