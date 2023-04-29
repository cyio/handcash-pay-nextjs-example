const appId = process.env.APP_ID;
const appSecret = process.env.APP_SECRET;
const serverDomain = process.env.VERCEL_URL || process.env.SERVER_DOMAIN;
const baseEndpoint = 'https://cloud.handcash.io/v2';

export default class HandCashService {
    static headers = {
        'app-id': appId,
        'app-secret': appSecret,
    };

    static async createPaymentRequest({businessName, sendAmount, destination, currencyCode, notificationsEmail}) {
        // console.log('debug createPaymentRequest', currencyCode, this.headers)
        const response = await fetch(`${baseEndpoint}/paymentRequests`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                requestedUserData: ['paymail'],
                expirationType: 'onPaymentCompleted',
                product: {
                    name: businessName,
                    description: '',
                    imageUrl: 'https://resources.paymentexpert.com/paymentexpert/2019/05/shutterstock_311420912-1068x1068.jpg',
                },
                receivers: [
                    {sendAmount, currencyCode, destination}
                ],
                notifications: {
                    webhook: {
                        webhookUrl: `https://${serverDomain}/api/onPaymentCompleted`,
                    },
                    email: notificationsEmail || undefined,
                }
            }),
        });
        return this.parseResponse(response);
    };

    static async deletePaymentRequest({id}) {
        const response = await fetch(`${baseEndpoint}/paymentRequests/${id}`, {
            method: 'DELETE',
            headers: this.headers,
        });
        return response
    };

    static async parseResponse(response) {
        if (response.ok) {
            return response.json();
        } else {
            const errorMessage = await response.text();
            throw Error(errorMessage);
        }
    }
}
