var port = 8880;
module.exports = {
  port: port,
  pg_connection_string: process.env.DATABASE_URL,
  secret: process.env.SFEZ_SECRET,
  apiVersion: process.env.SFEZ_API_VERSION,
  moltinAuthUrl: "https://api.molt.in/oauth/access_token",
  moltinStoreUrl: "https://api.molt.in/v1",
  clientId: process.env.MOLTIN_CLIENT_ID,
  client_secret: process.env.MOLTIN_CLIENT_SECRET,
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
  application_bundle : process.env.appBundleId,
  fcmServerKey: process.env.FCM_SERVER_KEY,
  gcmServerKey: process.env.GCM_SERVER_KEY,
  facebook_api_key: "1401488693436528",
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
};

