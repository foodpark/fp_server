var port = 80;
module.exports = {
  port: port,
  pg_connection_string: process.env.DATABASE_URL,
  secret: 'WhanThatAprillWithHisShouresSoote',
  apiVersion: 'v1',
  moltinAuthUrl: process.env.moltinAuthUrl,
  moltinStoreUrl: process.env.moltinStoreUrl,
  clientId: process.env.moltinStoreUrl,
  client_secret: process.env.moltinStoreUrl,
  grant_type: "client_credentials",
  defaultTaxBand: "1427064502431515521", // Brazil ICMS
  deliveryCharge: "",
  deliveryOffset: 15,
  sumup:{
      clientId:"",
      client_secret:"",
      sumupAuthUrl:"",
      sumupUrl:""
    },
  fcmServerKey: process.env.fcmServerKey,
  gcmServerKey: process.env.gcmServerKey
};
