import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const defaultThumbnail =
    'https://mixkit.imgix.net/static/home/home-item-type-showcase-music-pop.jpg'

export const getTrackThumbnail = (track: YouTubeTrack) => {
    if (!track) return defaultThumbnail
    return (track.thumbnails || track.thumbnail)[0].url
}

export function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    // Ensure the minutes and seconds are displayed with two digits (e.g., 02:05)
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}
