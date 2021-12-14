const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const { json } = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Success GET");
});

app.post("/", (req, res) => {
    const data=req.body;
    console.log(data);
    let data2;

    data2=JSON.parse(fs.readFileSync("../NFTPlanet/src/save.json"))
    data2.push(JSON.parse(JSON.stringify(data)))

    console.log(data2);
    fs.writeFileSync("../NFTPlanet/src/save.json",JSON.stringify(data2))

     res.send("Post Request Success");
    //     res.links({

    //     middle: 'http://localhost:3000/'

    // });
    //res.send(res.get('link'));

});

app.listen(PORT, (err) => {
  if (err) throw err;
  else {
    console.log(`Server Started at port ${PORT}`);
  }
});