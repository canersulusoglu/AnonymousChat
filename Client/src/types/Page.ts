import type { NextPage } from "next"
import type { AuthRoles } from './AuthRoles'

type Layout = "Home" | "Chat";

export type PageAuth = {
    role: AuthRoles,
    redirect: string
};

export type Page<P = {}, IP = P> = NextPage<P, IP> & {
    Layout: Layout,
    Auth?: PageAuth
};