var port = 8880;

var properties = {
    port: port,
    pg_connection_string: process.env.DATABASE_URL || "postgres://sfez_rw:sfez@localhost:5432/sfezdb",
    secret: "CorrectHorseBatteryStaple",
    apiVersion: "v1",
    moltinAuthUrl: "https://api.molt.in/oauth/access_token",
    moltinStoreUrl: "https://api.molt.in/v1",
    clientId: "QtDrN2fxN3JGsKQvNgtahF5jz1MPP6kVV4wZTavq15",
    client_secret: "K5M1sc3PZuBVU3gn5iMzymWGecDk1HT90ZrjWVra6P",
    grant_type: "client_credentials",
    olddefaultTaxBand: "1278235843793780901", // Brazil ICMS
    defaultTaxBand: "1427064502431515521",
    deliveryRadius: ["2", "10", "15"],
    deliveryCharge: ["0", "8", "10"],
    deliveryOffset: 15,
    sumup:{
        clientId:"com.sumup.apisampleapp",
        client_secret:"6332ad54-eb47-4b41-8390-074f062da085",
        sumupAuthUrl:"https://api.sumup.com/oauth",
        sumupUrl:"https://api.sumup.com"
    },
    squareAuthUrl:"https://connect.squareup.com/oauth2/token",
    square: {
        apiAddress:"https://connect.squareup.com/",
        locationsUrl: "https://connect.squareup.com/v2/locations",
        clientId:"sq0idp-Y2wa0NUE74KRqxLr2VBMaA",
        clientSecret:"sq0csp-vVijIaxOAGPUC1LluWNOUN_cQB4aLh9dIyzQcauNfbk",
        redirectUrl:"https://www.streetfoodez.com/pb/"
    },
    application_bundle : "com.streetfoodez.sfez",
    fcmServerKey: process.env.fcmServerKey || "AAAAAcAl7Vw:APA91bGzGfWSgV7NE5pOzcbZ4aGH6cH6k41WKuq3oSKZdC4BI4bkgn34tWiF0blBnCv_yaKjlTaghy1Y4XiUmcjV0c0_lO2vqkzL9Ijo-yb_xxYp_NGCDpzdKHR4o5zKJGVCESzJldWU",
    gcmServerKey: process.env.fcmServerKey || "AAAAAcAl7Vw:APA91bGzGfWSgV7NE5pOzcbZ4aGH6cH6k41WKuq3oSKZdC4BI4bkgn34tWiF0blBnCv_yaKjlTaghy1Y4XiUmcjV0c0_lO2vqkzL9Ijo-yb_xxYp_NGCDpzdKHR4o5zKJGVCESzJldWU",
    oldGcmServerKey: process.env.gcmServerKey || "AIzaSyBHjuQ6j05yKC-BYJa6C2ER9-JfNEaPvYI",
    oldFcmServerKey: process.env.gcmServerKey || "AIzaSyBHjuQ6j05yKC-BYJa6C2ER9-JfNEaPvYI",
    facebook_api_key: "1401488693436528",
    FACEBOOK_CLIENT_ID: "1580240262270648",
    FACEBOOK_CLIENT_SECRET: "9262a21aa421194191a90298af79e509",
    facebook_app_id: "1580240262270648",
    facebook_app_secret: "9262a21aa421194191a90298af79e509"
};

properties.squareRenewUrl = properties.square.apiAddress + "/oauth2/clients/" + properties.square.clientId + "/access-token/renew";
properties.square.orderUrl = function (locationId) {
    return properties.square.apiAddress + "v2/locations/" + locationId + "/orders/batch-retrieve"
};

module.exports = properties;


