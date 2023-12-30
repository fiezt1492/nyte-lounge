import { formatTime, getTrackThumbnail } from '@/lib/utils'
import { enqueueTrack } from '@/redux/actions/player.actions'
import { useAppDispatch } from '@/redux/hooks'
import React from 'react'

interface TrackCardProps {
    item: YouTubeTrack
}

function TrackCard({ item }: TrackCardProps) {
    const dispatch = useAppDispatch()

    return (
        <div
            className="flex rounded-md border p-4 space-x-2 cursor-pointer bg-card shadow-md hover:bg-gradient-to-r hover:from-accent"
            onClick={() =>
                dispatch(
                    enqueueTrack({
                        track: item,
                        playNow: true,
                    })
                )
            }
            key={item.id}
        >
            <div
                className="w-24 h-24 rounded-sm bg-cover bg-center shadow-md"
                style={{
                    backgroundImage: `url(${getTrackThumbnail(item)})`,
                }}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <div className="text-md font-semibold">{item.title?.text}</div>
                <div className="text-sm text-muted-foreground">
                    {formatTime(item.duration.seconds || 0)}
                </div>
            </div>
        </div>
    )
}

export default TrackCard
