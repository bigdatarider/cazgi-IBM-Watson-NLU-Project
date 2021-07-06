const express = require('express');
const app = new express();

const dotenv = require("dotenv");
dotenv.config();

/*
var router = express.Router();
app.use("/", router);
router.get('/', function(req, res, next) {
    res.render('index.html', { title: 'Sentiment Analyzer'  });
}); 
*/
function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2021-03-25',
  authenticator: new IamAuthenticator({
    apikey: api_key,
  }),
  serviceUrl: api_url,
});
return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());
/*
app.get("/",(req,res)=>{
    res.render('index.html', { title: 'Sentiment Analyzer' });
  });
*/
app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
/*const analyzeParams = {
  'url': req.query.url,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': false,
      'limit': 3,
    },
    'keywords': {
      'emotion': true,
      'sentiment': false,
      'limit': 3,
    },
  },
};*/

const analyzeParams = {
  'url': req.query.url,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
  },
};


//    return res.send({"happy":"90","sad":"10"});
naturalLanguageUnderstanding = getNLUInstance();
naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    //console.log(JSON.stringify(analysisResults, null, 2));
    //return res.send(JSON.stringify(analysisResults, null, 2));

    const emos = analysisResults["result"]["keywords"][0]["emotion"];
    return res.send(JSON.stringify(emos));
})
  .catch(err => {
    //console.log('error:', err);
    return res.send("An error occurred :"+ err);
  });

});

app.get("/url/sentiment", (req,res) => {
    //return res.send("url sentiment for "+req.query.url);

const analyzeParams = {
  'url': req.query.url,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'sentiment': true,
      'limit': 2,
    },
  },
};
naturalLanguageUnderstanding = getNLUInstance();

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    const sentiments = analysisResults["result"]["keywords"][0]["sentiment"];
    return res.send(JSON.stringify(sentiments));
})
  .catch(err => {
    return res.send("An error occurred :"+ err);
  });

});

app.get("/text/emotion", (req,res) => {
    //return res.send({"happy":"10","sad":"90"});
    const analyzeParams = {
  'text': req.query.text,
  'features': {
    'entities': {
      'emotion': true,
      'sentiment': false,
      'limit': 2,
    },
    'keywords': {
      'emotion': true,
      'sentiment': false,
      'limit': 2,
    },
  },
};
naturalLanguageUnderstanding = getNLUInstance();

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    const emos = analysisResults["result"]["keywords"][0]["emotion"];
    return res.send(JSON.stringify(emos));
})
  .catch(err => {
    return res.send("An error occurred :"+ err);
  });
});

app.get("/text/sentiment", (req,res) => {
    //return res.send("text sentiment for "+req.query.text);
     const analyzeParams = {
  'text': req.query.text,
  'features': {
    'entities': {
      'emotion': false,
      'sentiment': true,
      'limit': 2,
    },
    'keywords': {
      'emotion': false,
      'sentiment': true,
      'limit': 2,
    },
  },
};
naturalLanguageUnderstanding = getNLUInstance();

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    const sentiments = analysisResults["result"]["keywords"][0]["sentiment"];
    return res.send(JSON.stringify(sentiments));
})
  .catch(err => {
    return res.send("An error occurred :"+ err);
  });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

