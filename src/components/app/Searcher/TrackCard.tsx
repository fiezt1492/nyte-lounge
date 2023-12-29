import { formatTime, getTrackThumbnail } from '@/lib/utils'
import React from 'react'

interface TrackCardProps {
    item: YouTubeTrack
    onClick: () => void
}

function TrackCard({ item, onClick }: TrackCardProps) {
    return (
        <div
            className="flex rounded-md border p-4 space-x-2 cursor-pointer hover:bg-accent"
            onClick={onClick}
            key={item.id}
        >
            <div
                className="w-24 h-24 rounded-sm bg-cover bg-center"
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
