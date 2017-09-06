var port = 1337;
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
  defaultTaxBand: "1427064502431515521", // Brazil ICMS
  deliveryCharge: "10",
  deliveryOffset: 15, // minutes
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
  oldFcmServerKey: process.env.gcmServerKey || "AIzaSyBHjuQ6j05yKC-BYJa6C2ER9-JfNEaPvYI",
  facebook_api_key: "1401488693436528",
  FACEBOOK_CLIENT_ID: "1580240262270648",
  FACEBOOK_CLIENT_SECRET: "9262a21aa421194191a90298af79e509",
  facebook_app_id: "1580240262270648",
  facebook_app_secret: "9262a21aa421194191a90298af79e509",
  moltin: {
    // BRAZIL
    1: { 
      client_id: "CJvCV3pZNWA87UbEP9LFjeHSkSrfLDArdbzVeaDTvC",
      client_secret: "IqUvmewaPFoF6vVi6E4Su4qnkVzhD7IYHZXZgGkYv9",
      grant_type: "client_credentials"
    },
    // ES
    2: {
      client_id: "DXzEC6moQa4ISJvFZ1mpaMCRDTm6AIcdx9PuMJJIKb",
      client_secret: "zuK90F5OF8fSK1z6uJ3huT5lMcvjtIDPjmLrNSUbL6",
      grant_type: "client_credentials",
    },
    // UK
    3: {
      client_id: "eNsB34Kfsq5X6jjPToR23mmM2lR2JQe6vpmyegJhNY",
      client_secret: "uUaxMehHbUaQHudcbuGTb7r3muiH5IYuXwqseSFfBn",
      grant_type: "client_credentials",
    }
  }
};
