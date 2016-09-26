var port = 80;
module.exports = {
  port: port,
  pg_connection_string: process.env.DATABASE_URL || 'postgres://sfez_rw:sfez@localhost:5432/sfezdb',
  secret: 'CorrectHorseBatteryStaple',
  apiVersion: 'v1',
  moltinAuthUrl: 'https://api.molt.in/oauth/access_token',
  moltinStoreUrl: 'https://api.molt.in/v1',
  clientId: 'QtDrN2fxN3JGsKQvNgtahF5jz1MPP6kVV4wZTavq15',
  client_secret: 'K5M1sc3PZuBVU3gn5iMzymWGecDk1HT90ZrjWVra6P',
  grant_type: 'client_credentials',
  defaultTaxBand: '1314876088337301664', // Brazil ICMS
  sumup:{
    clientId:"com.sumup.apisampleapp",
    client_secret:"6332ad54-eb47-4b41-8390-074f062da085",
    sumupAuthUrl:"https://api.sumup.com/oauth",
    sumupUrl:"https://api.sumup.com"
  },
  googleApiKey:"AIzaSyB9NG4YuvIlIJztHqlEx9w5GWO6ZM7Ojx4"
};
