import React, { lazy, ReactNode, useEffect, useState } from 'react'

interface PlayerLayoutProps {
    children: ReactNode
}

const PeerProvider = lazy(() => import('@/components/providers/PeerProvider'))

export default function PlayerLayout({ children }: PlayerLayoutProps) {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])
    return (
        <>
            <div>
                <div>{children}</div>
                {isClient && <PeerProvider />}
            </div>
        </>
    )
}
