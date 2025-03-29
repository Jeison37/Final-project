const { all } = require("axios");

module.exports = {
    ROL:{
        USER:0,
        TECHNICIAN:1,
        ADMIN:2
    },
    STATUS:{
        PENDING:0,
        COMPLETED:1,
        ALL: 2
    },
    WS:{
        CREATE_CHAT:0,
        TECHNICIAN_CONNECTED:1,
        MESSAGE:2,
        TECHNICIAN_AVAILABLE:3,
        TECHNICIAN_UNAVAILABLE:4,

    }
  };