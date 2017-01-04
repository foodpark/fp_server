var port = 80;
module.exports = {
    port: port,
    pg_connection_string: process.env.DATABASE_URL,
  	secret: 'WhanThatAprillWithHisShouresSoote',
  	apiVersion: 'v1',
    moltinAuthUrl: "",
    moltinStoreUrl: "",
    clientId: "",
    client_secret: "",
    grant_type: "client_credentials",
    defaultTaxBand: "1314876088337301664", // Brazil ICMS
    sumup:{
        clientId:"",
        client_secret:"",
        sumupAuthUrl:"",
        sumupUrl:""
      },
    actualfcmServerKey: process.env.fcmServerKey || "AAAAAcAl7Vw:APA91bGzGfWSgV7NE5pOzcbZ4aGH6cH6k41WKuq3oSKZdC4BI4bkgn34tWiF0blBnCv_yaKjlTaghy1Y4XiUmcjV0c0_lO2vqkzL9Ijo-yb_xxYp_NGCDpzdKHR4o5zKJGVCESzJldWU",
    gcmServerKey: process.env.gcmServerKey || "AIzaSyBHjuQ6j05yKC-BYJa6C2ER9-JfNEaPvYI",
    fcmServerKey: process.env.gcmServerKey || "AIzaSyBHjuQ6j05yKC-BYJa6C2ER9-JfNEaPvYI"
};
