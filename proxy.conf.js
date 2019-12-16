  const PROXY_CONFIG = [
    {
      "context": [
        "/auth/login",
        "/auth/register",
        "/auth/logout",
        "/customers"
      ],
      "target": "http://localhost:3001",
      "secure": false
    }
  ];
 
  module.exports = PROXY_CONFIG;