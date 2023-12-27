import AppLayout from '@/components/layouts/AppLayout'
import PlayerLayout from '@/components/layouts/PlayerLayout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <RecoilRoot>
            <AppLayout>
                <PlayerLayout>
                    <Component {...pageProps} />
                </PlayerLayout>
            </AppLayout>
        </RecoilRoot>
    )
}
