const express = require("express");
const path = require('path');
const bodyparser = require("body-parser");

const app = express();
const port = process.env.PORT || 3200;

const Jimp = require('jimp');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

function jeromeSays(phrase){
  //if you are following along, create the following 2 images relative to this script:
  let rawImages = ['raw/af1.jpg','raw/navy1.jpg','raw/navy2.jpg','raw/civ1.jpg','raw/civ2.jpg','raw/civ3.jpg','raw/civ4.jpg','raw/civ5.jpg','raw/civ6.jpg']
  let imgRaw = rawImages[Math.floor(Math.random() * rawImages.length)]; //a 1024px x 1024px backgroound image

  let imgActive = 'active/heSaidIt.jpg';
  let imgExported = 'export/heSaidIt.jpg';

  let textData = {
    text: phrase, //the text to be rendered on the image
    maxWidth: 400, //image width - 10px margin left - 10px margin right
    maxHeight: 267, //logo height + margin
    placementX: 505, // 10px in on the x axis
    placementY: 95 //bottom of the image: height - maxHeight - margin
  };

  //read template & clone raw image
  Jimp.read(imgRaw)
    .then(tpl => (tpl.clone().write(imgActive)))

    //read cloned (active) image
    .then(() => (Jimp.read(imgActive)))

    //load font
    .then(tpl => (
      Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => ([tpl, font]))
    ))

    //add footer text
    .then(data => {

      tpl = data[0];
      font = data[1];

      return tpl.print(font, textData.placementX, textData.placementY, {
        text: textData.text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      }, textData.maxWidth, textData.maxHeight);
    })

    //export image
    .then(tpl => (tpl.quality(100).write(imgExported)))

    //log exported filename
    .then(tpl => {
      console.log('exported file: ' + imgExported);
    })

    //catch errors
    .catch(err => {
      console.error(err);
    });
}
app.use("/img", express.static(path.join(__dirname, 'img')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.get("/say/:phrase", (req, res) => {
    const phrase = req.params.phrase
    if(phrase !== 'favicon.ico'){
        console.log(phrase)
        jeromeSays(phrase)
        sleep(2000).then(() => {
            res.status(200).sendFile("./export/heSaidIt.jpg",{root: __dirname});
          })

    }
  });

app.post("/say/", (req, res) => {
  const phrase = req.body.text
  if(phrase !== 'favicon.ico'){
      let encodedPhrase = encodeURIComponent(phrase)
      let newUrl = "http://jeromesays.gq/" + encodedPhrase
      let result = {"text": newUrl}
      return res.json(result)
      // jeromeSays(phrase)
      // sleep(2000).then(() => {
          // res.status(200).sendFile("./export/heSaidIt.jpg",{root: __dirname});
  }
});

app.get('/',function(req,res) {
  res.sendFile("./index.html",{root: __dirname});
});

app.listen(port, () => {
  console.log(`running at port ${port}`);
});
