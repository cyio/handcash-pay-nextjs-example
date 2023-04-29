import {useEffect, useState} from "react";
import {validationStates} from "../lib/Entities";
import Image from "next/image";
import ImageWithFallback from "../components/ImageWithFallback";

const Home = () => {
    const [validationState, setValidationState] = useState({
        validationState: validationStates.unknown,
        destination: {
            value: '',
            validationState: validationStates.unknown,
        },
        businessName: {
            value: 'My pop-up store',
            validationState: validationStates.unknown,
        },
        notificationsEmail: {
            value: '',
            validationState: validationStates.unknown,
        }
    });

    useEffect(() => {
        const storedSettings = localStorage.getItem('settings');
        if (storedSettings) {
            const settings = JSON.parse(storedSettings);
            setValidationState({
                ...validationState,
                destination: {
                    value: settings.destination,
                    validationState: validationStates.unknown,
                },
                businessName: {
                    value: settings.businessName,
                    validationState: validationStates.unknown,
                },
                notificationsEmail: {
                    value: settings.notificationsEmail,
                    validationState: validationStates.unknown,
                }
            });
        }
    }, []);

    const onChangeDestination = async (event) => {
        setValidationState((state) => ({
            ...state,
            validationState: validationStates.unknown,
            destination: {
                value: event.target.value,
                validationState: validationStates.unknown,
            }
        }));
        document.getElementById('username').setCustomValidity('');
    };

    const onChangeBusinessName = async (event) => {
        setValidationState((state) => ({
            ...state,
            validationState: validationStates.unknown,
            businessName: {
                value: event.target.value,
                validationState: validationStates.unknown,
            }
        }));
        document.getElementById('businessName').setCustomValidity('');
    };

    const onChangeNotificationsEmail = async (event) => {
        setValidationState((state) => ({
            ...state,
            validationState: validationStates.unknown,
            notificationsEmail: {
                value: event.target.value,
                validationState: validationStates.unknown,
            }
        }));
        document.getElementById('email').setCustomValidity('');
    };

    const onSave = async () => {
        setValidationState((state) => ({
            ...state,
            validationState: validationStates.inProgress,
        }));
        let areAllValid = true;
        const isValidDestination = await validatePaymentsDestination(validationState.destination.value);
        areAllValid &= isValidDestination;
        const isValidBusinessName = await validateBusinessName(validationState.businessName.value);
        areAllValid &= isValidBusinessName;
        const isValidNotificationsEmail = await validateNotificationsEmail(validationState.notificationsEmail.value);
        areAllValid &= isValidNotificationsEmail;

        setValidationState((state) => ({
            ...state,
            validationState: areAllValid ? validationStates.valid : validationStates.invalid,
            destination: {
                ...state.destination,
                validationState: isValidDestination ? validationStates.valid : validationStates.invalid,
            },
            businessName: {
                ...state.businessName,
                validationState: isValidBusinessName ? validationStates.valid : validationStates.invalid,
            },
            notificationsEmail: {
                ...state.notificationsEmail,
                validationState: isValidNotificationsEmail ? validationStates.valid : validationStates.invalid,
            }
        }));
        if (areAllValid) {
            setValidationState((state) => ({
                ...state,
                validationState: validationStates.valid,
            }));
            localStorage.setItem('settings', JSON.stringify({
                destination: validationState.destination.value,
                businessName: validationState.businessName.value,
                notificationsEmail: validationState.notificationsEmail.value,
            }));
            window.location.href = '/';
        } else {
            setValidationState((state) => ({
                ...state,
                validationState: validationStates.invalid,
            }));
        }
    };

    const validatePaymentsDestination = async (value) => {
        const response = await fetch(`https://cloud.handcash.io/api/bsvalias/public-profile/${value}@handcash.io`, {});
        if (response.ok) {
            document.getElementById('username').setCustomValidity('');
        } else {
            document.getElementById('username').setCustomValidity('Invalid username');
        }
        return response.ok;
    };

    const validateBusinessName = async (value) => {
        const isValid = value.length > 0;
        if (isValid) {
            document.getElementById('businessName').setCustomValidity('');
        } else {
            document.getElementById('businessName').setCustomValidity('Invalid business name');
        }
        return isValid;
    };

    const validateNotificationsEmail = async (value) => {
        const emailRegex = /\S+@\S+\.\S+/i;
        const isValid = !value || emailRegex.test(value);
        if (isValid) {
            document.getElementById('email').setCustomValidity('');
        } else {
            document.getElementById('email').setCustomValidity('Invalid email');
        }
        return isValid;
    };

    return (
        <div className="flex flex-col text-center flex-grow bg-bg-dark-nullBackground-nullBackground-900 justify-center">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div
                    className="flex-col max-w-xl md:m-2 rounded-md bg-bg-dark-nullBackground-nullBackground-800 w-full shadow-2xl shadow-white/1 transform overflow-hidden text-left p-8 sm:px-20 sm:py-12">
                    <div className="flex flex-col min-h-[6.5rem] items-start">
                        <h6 className="text-sm">Business name</h6>
                        <div className="mt-1 w-full flex justify-start items-center h-[3rem] gap-x-2">
                            <input
                                type="text"
                                name="businessName"
                                id="businessName"
                                className="block w-full bg-nullplaceholder:text-black-null/50 rounded-md border-transparent shadow shadow-white/10 invalid:border-red-500 px-3 focus:border-indigo-500 focus:ring-indigo-500 hover:shadow-white/20 text-lg caret-indigo-500"
                                placeholder="My pop-up store"
                                value={validationState.businessName.value}
                                maxLength={25}
                                onInput={onChangeBusinessName}
                            />
                        </div>
                        {validationState.businessName.validationState === validationStates.invalid &&
                            <p className="text-xs text-red-500 px-3 py-1">Invalid business name</p>
                        }
                    </div>
                    <div className="flex flex-col min-h-[6.5rem] items-start">
                        <h6 className="text-sm">HandCash username to receive the funds</h6>
                        <div className="mt-1 w-full flex justify-start items-center h-[3rem] gap-x-2">
                            <div className="relative rounded-md shadow-sm flex-grow">
                                <ImageWithFallback
                                    width={64}
                                    height={64}
                                    src={`https://cloud.handcash.io/v2/users/profilePicture/${validationState.destination.value}`}
                                    placeholderSrc="/placeholder_avatar.png"
                                    errorSrc="/placeholder_avatar.png"
                                    alt="user avatar"
                                    className="w-8 h-8 rounded-full top-2 pointer-events-none absolute inset-y-0 left-3 flex items-center"/>
                                <div
                                    className="pointer-events-none absolute inset-y-0 left-12 flex items-center pl-1">
                                    <span className="text-black-null/70 text-lg">$</span>
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    className="block w-full bg-nullplaceholder:text-black-null/50 rounded-md border-transparent shadow shadow-white/10 invalid:border-red-500 pl-16 pr-12 focus:border-indigo-500 focus:ring-indigo-500 hover:shadow-white/20 text-lg caret-indigo-500"
                                    placeholder="username"
                                    value={validationState.destination.value}
                                    onInput={onChangeDestination}
                                />
                            </div>
                        </div>
                        {validationState.destination.validationState === validationStates.invalid &&
                            <p className="text-xs text-red-500 px-3 py-1">Invalid username</p>
                        }
                    </div>
                    <div className="flex flex-col min-h-[6.5rem] items-start">
                        <h6 className="text-sm">Email to receive payment notifications</h6>
                        <div className="mt-1 w-full flex justify-start items-center h-[3rem] gap-x-2">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="block w-full bg-nullplaceholder:text-black-null/50 rounded-md border-transparent shadow shadow-white/10 invalid:border-red-500 px-3 focus:border-indigo-500 focus:ring-indigo-500 hover:shadow-white/20 text-lg caret-indigo-500"
                                placeholder="email (optional)"
                                value={validationState.notificationsEmail.value}
                                onInput={onChangeNotificationsEmail}
                            />
                        </div>
                        {validationState.notificationsEmail.validationState === validationStates.invalid &&
                            <p className="text-xs text-red-500 px-3 py-1">Invalid email</p>
                        }
                    </div>
                    <div className="flex w-full pt-8 gap-x-4 justify-end text-black-null/90">
                        <button
                            className="h-full w-1/2 max-w-[120px] px-3 py-2 bg-white-null/10 hover:ring-2 hover:ring-white/40 rounded-md disabled:opacity-50"
                            onClick={() => window.location.href = '/'}>Back
                        </button>
                        <button
                            className="flex h-full w-1/2 max-w-[120px] px-3 py-2 bg-indigo-500 hover:ring-2 hover:ring-indigo-300 rounded-md disabled:opacity-50 justify-center"
                            onClick={onSave}>
                            {validationState.validationState === validationStates.inProgress && 'Saving'}
                            {validationState.validationState === validationStates.unknown && 'Save'}
                            {validationState.validationState === validationStates.invalid && 'Save'}
                            {validationState.validationState === validationStates.valid && 'Saved'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
