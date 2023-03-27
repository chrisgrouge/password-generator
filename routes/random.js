const express = require("express"),
  router = express.Router(),
  // this is what we'll use to generate a random password
  randomWords = require("random-words")


router.get("/random", (req, res) => {
  // this will return exactly X amount of words where X is the paramter in the url
  const number = Number(req.query.number)
  res.status(200).json(randomWords({exactly: number}))
});


module.exports = router;