  const PROXY_CONFIG = [
    {
      "context": [
        "/auth/login"
      ],
      "target": "http://localhost:3001",
      "secure": false
    }
  ];
 
  module.exports = PROXY_CONFIG;