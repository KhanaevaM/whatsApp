# whatsapp client in React.JS

This is test WhatsApp client, developed to send and receive text messages using service [green-api.com](https://green-api.com/en).

## Installing

1. Сlone repo

```
git clone https://github.com/KhanaevaM/whatsApp
```

2. Install dependencies

```
npm install
```

3. Run locally

```
npm run start
```

4. Enjoy!

## Authentification

Sending WhatsApp message like any other call to the API requires account registered on [green-api.com](https://green-api.com/en) and authentication completed on mobile WhatsApp app. To register account you have to proceed to the [control panel](https://console.green-api.com/). After registering you wll get own unique pair of `ID_INSTANCE` and `API_TOKEN_INSTANCE` keys.

WhatsApp mobile app authentication may be achived by using [control panel](https://console.green-api.com/). You need to scan QR-code generated within the control panel. Or you can request QR-code in App. After scanning you need to Login again using same `ID_INSTANCE` and `API_TOKEN_INSTANCE` keys.
