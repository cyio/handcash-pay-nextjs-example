import Link from "next/link";
import Head from "next/head";

export default function Layout({children}) {
    return (
        <div className="flex flex-col items-center bg-darkBackground-null min-h-screen">
            <div className="grow flex border-t border-white/10 w-full">
                {children}
            </div>
            <footer
                className="w-full flex grow-0 p-6 border-t border-white/10 hidden md:block items-center justify-center">
                {/* <p className="text-xs tracking-wider text-center">© HandCash Labs, S.L. {new Date().getFullYear()}</p> */}
            </footer>
        </div>
    )
}
