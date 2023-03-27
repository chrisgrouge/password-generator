const express = require("express"),
  router = express.Router();


router.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


module.exports = router;