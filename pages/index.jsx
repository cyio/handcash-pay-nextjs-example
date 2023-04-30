import {useCallback, useEffect, useState, useRef} from "react";
import {paymentStatus} from "../lib/Entities";
import moment from "moment";
import Image from 'next/image'
import { useRouter } from 'next/router';
import QRCode from 'qrcode'

const isDev = () => window.location.port !== ''

function sendDataToParent(data) {
    console.log('sendDataToParent ', data)
    window.opener.receiveDataFromChild(data);
    window.close()
  }

export default function Index() {
    const router = useRouter();
    const { query } = router;
    const [inputAmount, setInputAmount] = useState(0.01);
    const [paymentState, setPaymentState] = useState({
        status: paymentStatus.unknown,
    });
    const [settings, setSettings] = useState({});
    const [recentPayments, setRecentPayments] = useState([]);
    const [qrCodeImg, setQrCodeImg] = useState('');
    const submitButtonRef = useRef(null);

    let checkPaymentStatusInterval;

    useEffect(() => {
        // const storedSettings = localStorage.getItem('settings');
        // if (storedSettings) {
        //     setSettings(JSON.parse(storedSettings));
        // } else {
        //     window.location.href = '/settings';
        // }
        // getRecentPayments();
    }, []);

    useEffect(() => {
        submitButtonRef.current.click();
    }, [settings]);

    useEffect(() => {
        if (query.sendAmount) {
            setInputAmount(query.sendAmount)
        }
        setSettings({
            ...query
        })
    }, [query]);

    const onChangeInputAmount = (event) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setInputAmount(value);
        } else {
            setInputAmount(0);
        }
    };

    const onConfirmPaymentAmount = async () => {
        const response = await fetch(`api/createPaymentRequest`, {
            method: 'POST',
            body: JSON.stringify({
                sendAmount: inputAmount,
                currencyCode: query.currency || 'USD',
                destination: settings?.destination,
                businessName: settings?.businessName,
                notificationsEmail: settings?.notificationsEmail,
            }),
        });
        if (response.ok) {
            const payment = await response.json();
            setPaymentState({
                paymentRequest: payment,
                status: paymentStatus.pending,
            });
            const str = `pay:?r=https%3A%2F%2Fcloud.handcash.io%2Fmerchant%2Finvoice%2F${payment.id}`
            const qrUrl = await QRCode.toDataURL(str)
            setQrCodeImg(qrUrl)
            startCheckPaymentStatusInterval(payment.id);
        }
    };

    const onCancelPayment = async () => {
        clearInterval(checkPaymentStatusInterval);
        setPaymentState({
            status: paymentStatus.unknown,
        });
        if (!paymentState.paymentRequest) {
            return;
        }
        const response = await fetch(`/api/deletePaymentRequest`, {
            method: 'DELETE',
            body: JSON.stringify({
                id: paymentState.paymentRequest.id
            }),
        });
        console.log('delete suc', response)
        if (!response.ok) {
            console.error('Error deleting paymentRequest');
            console.error(await response.text());
        }
    };

    const getRecentPayments = async () => {
        const response = await fetch(`/api/getRecentPayments`);
        if (response.ok) {
            const data = await response.json();
            if (data?.items) {
                console.log('getRecentPayments: ', data.items);
                setRecentPayments(data.items);
                if (data.items.length) {
                    onPaymentSuccess(data.items[0]);
                }
            }
        } else {
            console.error(await response.text());
        }
    };

    const onPaymentSuccess = (data) => {
        if (isDev()) {
            data = {
                transactionId: '123'
            }
        } else {
        }
        sendDataToParent(data)
    }

    const checkPaymentStatus = async (id) => {
        const response = await fetch(`api/paymentStatus/${id}`, {
            method: 'GET',
        });
        if (response.ok) {
            const data = await response.json();
            setPaymentState((state) => {
                if ([paymentStatus.confirmed].includes(data.status)) {
                    clearInterval(checkPaymentStatusInterval);
                    getRecentPayments();
                    return {
                        status: data.status,
                    };
                }
                const expirationInSeconds = (new Date(state?.paymentRequest?.expiresAt) - new Date()) / 1000;
                if (expirationInSeconds < 0) {
                    clearInterval(checkPaymentStatusInterval);
                    return {
                        status: paymentStatus.expired,
                    };
                }
                return {
                    ...state,
                    status: data.status,
                    expirationInSeconds,
                }
            });
        }
    };

    const startCheckPaymentStatusInterval = (id) => {
        clearInterval(checkPaymentStatusInterval);
        checkPaymentStatusInterval = setInterval(() => {
            checkPaymentStatus(id);
        }, 1000);
    }

    return (
        <div className="w-full grow flex flex-col md:flex-row justify-around gap-x-16 p-0 md:p-6">
            {isDev ? <button onClick={onPaymentSuccess}>我已支付</button> : null}
            <div className="w-full h-full grow md:basis-1/2 flex md:justify-end">
                <div
                    className="w-full grow md:max-w-[22rem] flex flex-col md:rounded-xl bg-bg-dark-nullBackground-nullBackground-800 md:shadow-sm shadow-white/10 justify-center items-center">
                    {paymentState?.status === paymentStatus.unknown &&
                        <div
                            className="flex flex-col grow gap-y-2 w-full p-6 rounded-xl items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor" className="w-32 h-32 text-black-null/40">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"/>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"/>
                            </svg>
                            <p className="text-xl text-black-null/40">Loading</p>
                        </div>
                    }
                    {paymentState?.status === paymentStatus.confirmed &&
                        <div
                            className="flex flex-col grow gap-y-2 w-full p-6 rounded-xl items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                 className="w-24 h-24 text-green-500 motion-safe:animate-bounce">
                                <path fillRule="evenodd"
                                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                      clipRule="evenodd"/>
                            </svg>
                            <h5 className="text-2xl">Payment confirmed</h5>
                            <p className="text-sm text-black-null/70">Thanks for your payment!</p>
                        </div>
                    }
                    {paymentState?.status === paymentStatus.pending &&
                        <div
                            className="flex flex-col grow gap-y-2 w-full p-6 rounded-xl items-center justify-center">
                            <p className="">Scan to pay</p>
                            <div className="p-1 bg-white-null w-72 h-72 rounded-xl">
                                <Image
                                    // src={paymentState?.paymentRequest?.paymentRequestQrCodeUrl}
                                    src={qrCodeImg}
                                    alt={"QR code for payment request"}
                                    className="w-full h-full"
                                    width="200"
                                    height="200"
                                />
                            </div>
                            {paymentState?.expirationInSeconds && paymentState.expirationInSeconds < 30 &&
                                <div
                                    className="flex items-center justify-center bg-red-100/10 text-red-300 border-red-300 rounded-full mt-1 pl-4 pr-6 py-2 gap-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                                    </svg>
                                    <p className="text-xs">
                                        Expires
                                        in {((new Date(paymentState?.paymentRequest?.expiresAt) - new Date()) / 1000).toFixed(0)} seconds
                                    </p>
                                </div>
                            }
                            {paymentState?.status === paymentStatus.expired &&
                                <div
                                    className="flex items-center justify-center bg-red-100/10 text-red-300 border-red-300 rounded-full mt-1 pl-4 pr-6 py-2 gap-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <p className="text-xs">Payment expired</p>
                                </div>
                            }
                        </div>
                    }
                    <div className="w-full grow-0 fixed bottom-0 left-0 md:relative text-black-null/90">
                        {/* <div className="relative">
                            <input
                                type="text"
                                name="amount"
                                id="amount"
                                disabled={paymentState?.status !== paymentStatus.unknown}
                                onInput={onChangeInputAmount}
                                onKeyDown={(event) => event.key === 'Enter' && onConfirmPaymentAmount()}
                                className="block w-full bg-bg-dark-nullBackground-nullBackground-800 border-0 border-t border-white/30 pr-2 pl-6 focus:text-indigo-400 focus:caret-indigo-400 focus:border-indigo-500 focus:ring-transparent text-4xl"
                                value={inputAmount}
                                // placeholder="0.01"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                <span className="text-4xl">{query.currency || 'USD'}</span>
                            </div>
                        </div> */}
                        {paymentState?.status === paymentStatus.unknown &&
                            <button
                                className="opacity-0 w-full bg-indigo-500 hover:opacity-90 text-3xl text-black-null/90 md:rounded-b-xl py-3"
                                disabled={inputAmount <= 0}
                                onClick={onConfirmPaymentAmount}
                                ref={submitButtonRef}
                            >
                            </button>
                        }
                        {[paymentStatus.pending, paymentStatus.expired].includes(paymentState?.status) &&
                            <button
                                className="w-full bg-red-400 hover:opacity-90 text-3xl text-black-null/90 md:rounded-b-xl py-3"
                                onClick={onCancelPayment}
                            >Cancel
                            </button>
                        }
                        {paymentState?.status === paymentStatus.confirmed &&
                            <button
                                className="w-full bg-green-500 hover:opacity-90 text-3xl text-black-null/90 md:rounded-b-xl py-3"
                                onClick={onCancelPayment}
                            >Next
                            </button>
                        }
                    </div>
                </div>
            </div>
            <div className="w-full grow hidden md:block basis-1/2 flex justify-start">
                <div className="opacity-0 flex flex-col max-w-[23rem] max-h-[32rem] items-start gap-y-2">
                    <div className="flew-grow w-full mb-2 flex justify-between">
                        <h3 className="text-md text-black-null/90 uppercase">Recent payments</h3>
                        <button
                            className="text-xs text-black-null/90 bg-indigo-500/40 px-3 py-1 rounded-full hover:ring-2 hover:ring-indigo-500"
                            onClick={getRecentPayments}
                        >Update
                        </button>
                    </div>
                    {
                        recentPayments.map((payment) => (
                            <a key={payment.transactionId}
                               target="_blank"
                               rel="noopener noreferrer"
                               href={`https://app.handcash.io/#/payment/${payment.transactionId}`}
                               className="w-full">
                                <div
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/30 hover:bg-indigo-500/10 hover:border-indigo-400/70">
                                    <div className="flex gap-x-4">
                                        <img src={payment.userData.avatarUrl}
                                             className="w-12 h-12 rounded-full"/>
                                        <div className="flex flex-col items-start justify-center">
                                            <p className="text-lg m-0 p-0">${payment.userData.username}</p>
                                            <p className="text-xs text-black-null/70 m-0 p-0">{moment(payment.confirmedAt).fromNow()}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xl font-medium text-indigo-400">+{payment.paymentAmount?.amount.toFixed(2)} {payment.paymentAmount?.currencyCode}</p>
                                    </div>
                                </div>
                            </a>
                        ))
                    }
                    {recentPayments.length === 0 &&
                        <div className="w-full h-full overflow-scroll flex-col flex gap-y-2">
                            {Array.from(Array(5).keys()).map((index) => (
                                <div
                                    key={index}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10">
                                    <div className="flex gap-x-4">
                                        <div className="w-12 h-12 rounded-full bg-white-null/5"/>
                                        <div className="flex flex-col items-start justify-center gap-y-1">
                                            <div className="bg-white-null/5 rounded-full w-24 h-5"/>
                                            <div className="bg-white-null/5 rounded-full w-20 h-4"/>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="bg-white-null/5 rounded-full w-20 h-8"/>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
