const testFunction = (req, res) => {
  res.json({ message: "Controller working properly" });
};

module.exports = { testFunction };