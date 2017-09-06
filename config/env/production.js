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
  defaultTaxBand: "1554615357396746864", // Brazil ICMS
  defaultCurrency: "1554610428930163616", // Brazilian Real
  deliveryCharge: "10",
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
  moltin: {
    // BRAZIL
    1: { 
      client_id: "eDlPjoMabiu84tszlmr9gcpgm1YJXOJoSZxCBooYuW",
      client_secret: "hqvxfSwzIz9RP3nTLP3SbDZUUDDpfMteRJtfm3rOv3",
      grant_type: "client_credentials"
    },
    // US
    2: {
      client_id: "",
      client_secret: "",
      grant_type: "client_credentials",
    },
    // UK
    3: {
      client_id: "OCQZ6BwRk8OMUk04C08DmJGWTgcnkXoO2TSaVyqJLa",
      client_secret: "mkOFvvi3gJyuDU3ydONXFJbBzhO2Z4Npqg9CQjBRgw",
      grant_type: "client_credentials",
    }
  }
};

