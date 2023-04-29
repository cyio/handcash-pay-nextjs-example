import Link from "next/link";
import Head from "next/head";

export default function Layout({children}) {
    return (
        <div className="flex flex-col items-center bg-darkBackground-null min-h-screen">
            <Head>
                <title>HandCash Pay Example</title>
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://handcash-pay-nextjs-example-rseibane-handcash.vercel.app/og-preview.png" />
                <meta property="og:title" content="HandCash Pay Example" />
                <meta property="og:description" content="Getting started with HandCash Pay + NextJS" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@handcashapp" />
                <meta name="twitter:image" content="https://handcash-pay-nextjs-example-rseibane-handcash.vercel.app/og-preview.png" />
                <meta name="twitter:title" content="HandCash Pay Example" />
                <meta name="twitter:description" content="Getting started with HandCash Pay + NextJS" />
            </Head>
            <nav
                className="container flex grow-0 w-full justify-center">
                <div className="p-4 flex flex-grow justify-between items-center ">
                    <Link href="/" passHref>
                        <h1 className="text-xl font-bold text-black/90 hover:text-black hover:cursor-pointer">HandCash
                            Pay Checkout Demo</h1>
                    </Link>
                    <div className="flex gap-x-4">
                        <Link
                            className="hidden md:block flex items-center w-fit rounded-full py-1 pl-4 pr-5 gap-x-4 border border-transparent text-lg font-light hover:text-black text-black/70"
                            target="_blank"
                            rel="noreferrer"
                            href="https://docs.handcash.io/docs/overview">Github
                        </Link>
                        <Link
                            className="hidden md:block flex items-center w-fit rounded-full py-1 pl-4 pr-5 gap-x-4 border border-transparent text-lg font-light hover:text-black text-black/70"
                            target="_blank"
                            rel="noreferrer"
                            href="https://docs.handcash.io/docs/overview">Documentation
                        </Link>
                        <Link href="/settings" passHref
                              className="flex items-center w-fit bg-white/1 rounded-full py-1 pl-4 pr-5 gap-x-4 border border-white/50 hover:border-white/70 hover:text-black text-black/70">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <p className="text-lg font-light">Settings</p>
                        </Link>
                    </div>
                </div>
            </nav>
            <div className="grow flex border-t border-white/10 w-full">
                {children}
            </div>
            <footer
                className="w-full flex grow-0 p-6 border-t border-white/10 hidden md:block items-center justify-center">
                <p className="text-xs tracking-wider text-center">© HandCash Labs, S.L. {new Date().getFullYear()}</p>
            </footer>
        </div>
    )
}
