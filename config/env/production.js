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
  defaultTaxBand: "1278235843793780901", // Brazil ICMS
  deliveryCharge: "",
  sumup:{
      clientId:"",
      client_secret:"",
      sumupAuthUrl:"",
      sumupUrl:""
    },
  fcmServerKey: process.env.fcmServerKey,
  gcmServerKey: process.env.gcmServerKey
};
