var port = 80;
module.exports = {
    port: port,
    pg_connection_string: process.env.DATABASE_URL || "postgres://sfez_rw:sfez@localhost:5432/sfezdb",
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
    googleApiKey: 'AIzaSyBHjuQ6j05yKC-BYJa6C2ER9-JfNEaPvYI'
};
