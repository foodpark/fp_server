var port = 80;
module.exports = {
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
  deliveryCharge: "10",
  deliveryOffset: 15,
  sumup:{
    clientId:"com.sumup.apisampleapp",
    client_secret:"6332ad54-eb47-4b41-8390-074f062da085",
    sumupAuthUrl:"https://api.sumup.com/oauth",
    sumupUrl:"https://api.sumup.com"
  },
  application_bundle : "com.streetfoodez.sfez",
  fcmServerKey: process.env.fcmServerKey || "AAAAAcAl7Vw:APA91bGzGfWSgV7NE5pOzcbZ4aGH6cH6k41WKuq3oSKZdC4BI4bkgn34tWiF0blBnCv_yaKjlTaghy1Y4XiUmcjV0c0_lO2vqkzL9Ijo-yb_xxYp_NGCDpzdKHR4o5zKJGVCESzJldWU",
  gcmServerKey: process.env.fcmServerKey || "AAAAAcAl7Vw:APA91bGzGfWSgV7NE5pOzcbZ4aGH6cH6k41WKuq3oSKZdC4BI4bkgn34tWiF0blBnCv_yaKjlTaghy1Y4XiUmcjV0c0_lO2vqkzL9Ijo-yb_xxYp_NGCDpzdKHR4o5zKJGVCESzJldWU",
  oldGcmServerKey: process.env.gcmServerKey || "AIzaSyBHjuQ6j05yKC-BYJa6C2ER9-JfNEaPvYI",
  oldFcmServerKey: process.env.gcmServerKey || "AIzaSyBHjuQ6j05yKC-BYJa6C2ER9-JfNEaPvYI"
};
