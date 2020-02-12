const express = require("express");
const path = require('path');
const bodyparser = require("body-parser");

const app = express();
const port = process.env.PORT || 3200;

const Jimp = require('jimp');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

function jodySays(phrase, imageType){
  let imageRaw;

  switch(imageType) {
    case "meme":
      let rawImages = ['raw/af1.jpg','raw/navy1.jpg','raw/navy2.jpg','raw/civ1.jpg','raw/civ2.jpg','raw/civ3.jpg','raw/civ4.jpg','raw/civ5.jpg','raw/civ6.jpg']
      imgRaw = rawImages[Math.floor(Math.random() * rawImages.length)]; //a 1024px x 1024px backgroound image
      break;
    case "drill":
      imgRaw = 'raw/jodyDrill.jpg'
      break;
    case "mad":
      imgRaw = 'raw/jodyMad.jpg'
      break;
    case "eyeroll":
      imgRaw = 'raw/jodyEyeroll.jpg'
      break;
    default:
      imgRaw = 'raw/jodyHappy.jpg'
      break;
  }

  let imgActive = '/tmp/active/heSaidIt.jpg';
  let imgExported = '/tmp/export/heSaidIt.jpg';

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

// -----------------------------
// Set Up Get Request Routing
// -----------------------------

app.get("/drilljody/:phrase", (req, res) => {
    const phrase = req.params.phrase
    if(phrase !== 'favicon.ico'){
        console.log(phrase)
        jodySays(phrase, "drill")
        sleep(2000).then(() => {
            res.status(200).sendFile("/tmp/export/heSaidIt.jpg",{root: "/"});
          })
    }
  });

  app.get("/jody/:phrase", (req, res) => {
      const phrase = req.params.phrase
      if(phrase !== 'favicon.ico'){
          console.log(phrase)
          jodySays(phrase, "happy")
          sleep(2000).then(() => {
              res.status(200).sendFile("/tmp/export/heSaidIt.jpg",{root: "/"});
            })
      }
  });

  app.get("/madjody/:phrase", (req, res) => {
      const phrase = req.params.phrase
      if(phrase !== 'favicon.ico'){
          console.log(phrase)
          jodySays(phrase, "mad")
          sleep(2000).then(() => {
              res.status(200).sendFile("/tmp/export/heSaidIt.jpg",{root: "/"});
            })
      }
  });

  app.get("/eyerolljody/:phrase", (req, res) => {
      const phrase = req.params.phrase
      if(phrase !== 'favicon.ico'){
          console.log(phrase)
          jodySays(phrase, "eyeroll")
          sleep(2000).then(() => {
              res.status(200).sendFile("/tmp/export/heSaidIt.jpg",{root: "/"});
            })
      }
    });

    app.get("/meme/:phrase", (req, res) => {
        const phrase = req.params.phrase
        if(phrase !== 'favicon.ico'){
            console.log(phrase)
            jodySays(phrase, "meme")
            sleep(2000).then(() => {
                res.status(200).sendFile("/tmp/export/heSaidIt.jpg",{root: "/"});
              })
        }
      });

// -----------------------------
// Set Up Post Request Routing
// -----------------------------

app.post("/meme/", (req, res) => {
  const phrase = req.body.text
  if(phrase !== 'favicon.ico'){
      let encodedPhrase = encodeURIComponent(phrase)
      let newUrl = "http://jodysays.ml/meme/" + encodedPhrase
      let result = {"text": newUrl}
      return res.json(result)
  }
});

app.post("/drilljody/", (req, res) => {
  const phrase = req.body.text
  if(phrase !== 'favicon.ico'){
      let encodedPhrase = encodeURIComponent(phrase)
      let newUrl = "http://jodysays.ml/drilljody/" + encodedPhrase
      let result = {"text": newUrl}
      return res.json(result)
  }
});

app.post("/jody/", (req, res) => {
  const phrase = req.body.text
  console.log(phrase)
  if(phrase !== 'favicon.ico'){
      let encodedPhrase = encodeURIComponent(phrase)
      let newUrl = "http://jodysays.ml/jody/" + encodedPhrase
      let result = {"text": newUrl}
      return res.json(result)
  }
});

app.post("/madjody/", (req, res) => {
  const phrase = req.body.text
  if(phrase !== 'favicon.ico'){
      let encodedPhrase = encodeURIComponent(phrase)
      let newUrl = "http://jodysays.ml/madjody/" + encodedPhrase
      let result = {"text": newUrl}
      return res.json(result)
  }
});

app.post("/eyerolljody/", (req, res) => {
  const phrase = req.body.text
  if(phrase !== 'favicon.ico'){
      let encodedPhrase = encodeURIComponent(phrase)
      let newUrl = "http://jodysays.ml/eyerolljody/" + encodedPhrase
      let result = {"text": newUrl}
      return res.json(result)
  }
});

// ----------------
// Serve Homepage
// ----------------

app.get('/',function(req,res) {
  res.sendFile("./public/index.html",{root: __dirname});
});
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`running at port ${port}`);
});
