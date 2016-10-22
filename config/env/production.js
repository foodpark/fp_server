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
    googleApiKey:  process.env.googleApiKey

};
