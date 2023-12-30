import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setPlayer } from '@/redux/slices/player.slice'

function VolumeControl() {
    const dispatch = useAppDispatch()
    const { volumeLevel } = useAppSelector((state) => state.player)

    const VolumeIcon =
        volumeLevel > 75
            ? Volume2
            : volumeLevel > 25
            ? Volume1
            : volumeLevel > 0
            ? Volume
            : VolumeX

    return (
        <Drawer>
            <DrawerTrigger>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size={'icon'}>
                            <VolumeIcon />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Adjust audio volume</p>
                    </TooltipContent>
                </Tooltip>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Audio Volume Level</DrawerTitle>
                    <DrawerDescription>
                        Current volume level: {volumeLevel}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-8 py-6">
                    <Slider
                        value={[volumeLevel]}
                        step={1}
                        min={0}
                        max={100}
                        onValueChange={([value]) => {
                            dispatch(
                                setPlayer({
                                    volumeLevel: value,
                                })
                            )
                        }}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default VolumeControl
