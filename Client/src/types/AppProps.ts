import { NextComponentType, NextPageContext } from "next/types"
import { Page } from './Page'

export type AppProps = {
    Component: NextComponentType<NextPageContext, any, {}> & Page
    pageProps: any
}