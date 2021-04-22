var express = require('express');
const cors = require('cors');
var gg = 1;
const app = express();
const fs = require('fs');
const { json, raw } = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });



var takenGameIDs = [];

var gameInfosJSON = [];
var passwords = [];
var passwordLength = 20;

var languagePacks = [];
var javascriptTexts =[];

console.log("hiii");



app.use(cors())

app.get('/', function (req, res) {
  doShit();
  gg++;
  res.send('hello world\nnono\nyes\n' + gg); //replace with your data here
});
app.get('/ass', function (req, res) {
  res.send('hello ass\nnono\nyes\n'); //replace with your data here
});

app.get('/ZBUMCommunicate/gimmeAllTakenIDs', function (req, res) {
  // res.send("dd");
  let tmp = " \n";
  for (let index = 0; index < takenGameIDs.length; index++) {
    tmp = tmp + takenGameIDs[index] + "\n";
  }

  res.send(tmp); //replace with your data here
});


app.post('/ZBUMCommunicate/changeJavascriptFile/:gameID/:pass', upload.array('file', 12), function (req, res, next) {
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    fs.unlinkSync(req.files[0].path);
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    fs.unlinkSync(req.files[0].path);
    res.send("not found");
    return;
  }
  console.log(req.files)
  fs.readFile(req.files[0].path, 'utf8', function(err, data) {
      if (err) throw err;
      javascriptTexts[indexWeWant] = data;
  });
  fs.unlinkSync(req.files[0].path);
  res.send("done");
});

app.post('/ZBUMCommunicate/changeLanguagePack/:gameID/:pass', upload.array('file', 12), function (req, res, next) {
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    fs.unlinkSync(req.files[0].path);
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    fs.unlinkSync(req.files[0].path);
    res.send("not found");
    return;
  }
  console.log(req.files)
  fs.readFile(req.files[0].path, 'utf8', function(err, data) {
      if (err) throw err;
      languagePacks[indexWeWant] = data;
  });
  fs.unlinkSync(req.files[0].path);
  res.send("done");
});

app.get('/ZBUMCommunicate/gimmeJavascriptText/:gameID/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(gameInfosJSON[indexWeWant].gameState != "lobby"){
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }
}
  res.send(javascriptTexts[indexWeWant]); //replace with your data here
});

app.get('/ZBUMCommunicate/gimmeLanguagePack/:gameID/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(gameInfosJSON[indexWeWant].gameState != "lobby"){
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }
}
  res.send(languagePacks[indexWeWant]); //replace with your data here
});


app.get('/ZBUMCommunicate/deleteGame/:gameID/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(gameInfosJSON[indexWeWant].gameID == "AAA" && req.params.pass == "aaaaaa"){

  }else{
    if(req.params.pass != passwords[indexWeWant]){
      res.send("not found");
      return;
    }
  }
  
  takenGameIDs.splice(indexWeWant, 1);
  gameInfosJSON.splice(indexWeWant, 1);
  javascriptTexts.splice(indexWeWant, 1);
  languagePacks.splice(indexWeWant, 1);
  passwords.splice(indexWeWant, 1);
  res.send("done"); //replace with your data here
});

app.get('/ZBUMCommunicate/gimmeJSON/:gameID/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(gameInfosJSON[indexWeWant].gameState != "lobby"){
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }
}


  let rawdata = gameInfosJSON[indexWeWant];
  res.send(rawdata); //replace with your data here
});

app.get('/ZBUMCommunicate/updateGameStates/:gameID/:state/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }


  let JSONtmp = gameInfosJSON[indexWeWant];

  JSONtmp.gameState = req.params.state;
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});

app.get('/ZBUMCommunicate/updateGameData/:gameID/:dataInMyFormat/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }


  let JSONtmp = gameInfosJSON[indexWeWant];
  let lines = req.params.dataInMyFormat.split("UUU");
  for (let index = 0; index < lines.length; index++) {
    if (lines[index] == 'ZZZ') continue;
    JSONtmp.gameData[index] = lines[index];
  }
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});



app.get('/ZBUMCommunicate/updateMasterData/:gameID/:dataInMyFormat/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }

  let JSONtmp = gameInfosJSON[indexWeWant];
  let lines = req.params.dataInMyFormat.split("UUU");
  for (let index = 0; index < lines.length; index++) {
    if (lines[index] == 'ZZZ') continue;
    JSONtmp.masterData[index] = lines[index];
  }
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});


app.get('/ZBUMCommunicate/incrementCurrentNumberOfPlayers/:gameID/:num/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(gameInfosJSON[indexWeWant].gameState != "lobby"){
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }
}

  let JSONtmp = gameInfosJSON[indexWeWant];
  JSONtmp.currentNumberOfPlayers = parseInt(JSONtmp.currentNumberOfPlayers) + parseInt(req.params.num);
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});

app.get('/ZBUMCommunicate/changePlayerName/:gameID/:whichPlayer/:whatName/:setActive/:increment/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(gameInfosJSON[indexWeWant].gameState != "lobby"){
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }
}

  let JSONtmp = gameInfosJSON[indexWeWant];
  if (req.params.whichPlayer == "all") {
    for (let index = 0; index < JSONtmp.maxNumberOfPlayers; index++) {
      if (req.params.whatName != "ZZZ")
        JSONtmp.Players[index].hisName = req.params.whatName;
      if (req.params.setActive != "ZZZ") {
        if (req.params.setActive == "true") JSONtmp.Players[index].Active = true; else JSONtmp.Players[index].Active = false;
      }

    }
  } else {
    if (req.params.whatName != "ZZZ")
      JSONtmp.Players[parseInt(req.params.whichPlayer)].hisName = req.params.whatName;

    if (req.params.setActive != "ZZZ") {
      if (req.params.setActive == "true") JSONtmp.Players[parseInt(req.params.whichPlayer)].Active = true; else JSONtmp.Players[parseInt(req.params.whichPlayer)].Active = false;
    }
  }

  if (req.params.increment == "true") JSONtmp.currentNumberOfPlayers = (parseInt(JSONtmp.currentNumberOfPlayers) + 1);

  gameInfosJSON[indexWeWant] = JSONtmp;
  let tempTxt = "doneUUU";
  if(gameInfosJSON[indexWeWant].gameState == "lobby") tempTxt += passwords[indexWeWant];
  res.send(tempTxt); //replace with your data here
});

app.get('/ZBUMCommunicate/setActionsToPlayers/:gameID/:whichPlayer/:whichAction/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }

  let JSONtmp = gameInfosJSON[indexWeWant];
  if (req.params.whichPlayer == "all") {
    for (let index = 0; index < JSONtmp.maxNumberOfPlayers; index++) {
      JSONtmp.Players[index].actionToTake = req.params.whichAction;

    }
  } else {
    JSONtmp.Players[req.params.whichPlayer].actionToTake = req.params.whichAction;
  }
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});

app.get('/ZBUMCommunicate/setPlayerStates/:gameID/:whichPlayer/:whichState/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }

  let JSONtmp = gameInfosJSON[indexWeWant];
  if (req.params.whichPlayer == "all") {
    for (let index = 0; index < JSONtmp.maxNumberOfPlayers; index++) {
      JSONtmp.Players[index].playerState = req.params.whichState;

    }
  } else {
    JSONtmp.Players[req.params.whichPlayer].playerState = req.params.whichState;
  }
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});


app.get('/ZBUMCommunicate/updatePlayerInfo/:gameID/:whichPlayer/:dataInMyFormat/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }

  let JSONtmp = gameInfosJSON[indexWeWant];
  let lines = req.params.dataInMyFormat.split("UUU");

  if (req.params.whichPlayer == "all") {
    for (let index = 0; index < JSONtmp.maxNumberOfPlayers; index++) {
      for (let index2 = 0; index2 < lines.length; index2++) {
        if (lines[index2] == 'ZZZ') continue;
        JSONtmp.Players[index].playerInfo[index2] = lines[index2];
      }

    }
  } else {

    for (let index2 = 0; index2 < lines.length; index2++) {
      if (lines[index2] == 'ZZZ') continue;
      JSONtmp.Players[req.params.whichPlayer].playerInfo[index2] = lines[index2];
    }

  }
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});


app.get('/ZBUMCommunicate/updatePlayerInput/:gameID/:whichPlayer/:dataInMyFormat/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }

  let JSONtmp = gameInfosJSON[indexWeWant];
  let lines = req.params.dataInMyFormat.split("UUU");

  if (req.params.whichPlayer == "all") {
    for (let index = 0; index < JSONtmp.maxNumberOfPlayers; index++) {
      for (let index2 = 0; index2 < lines.length; index2++) {
        if (lines[index2] == 'ZZZ') continue;
        JSONtmp.Players[index].playerInput[index2] = lines[index2];
      }

    }
  } else {

    for (let index2 = 0; index2 < lines.length; index2++) {
      if (lines[index2] == 'ZZZ') continue;
      JSONtmp.Players[req.params.whichPlayer].playerInput[index2] = lines[index2];
    }

  }
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});

app.get('/ZBUMCommunicate/updatePlayerPoints/:gameID/:dataInMyFormat/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }

  let JSONtmp = gameInfosJSON[indexWeWant];
  let lines = req.params.dataInMyFormat.split("UUU");


    for (let index2 = 0; index2 < lines.length; index2++) {
      if (lines[index2] == 'ZZZ') continue;
      JSONtmp.playerPoints[index2] = parseFloat(lines[index2]);
    }

  
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});
app.get('/ZBUMCommunicate/updateCurrentTurn/:gameID/:currentTurn/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }

  let JSONtmp = gameInfosJSON[indexWeWant];
  
      JSONtmp.currentTurn = parseInt(req.params.currentTurn);
    

  
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});

app.get('/ZBUMCommunicate/updateTextForPhoneIndependance/:gameID/:txt/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }

  let JSONtmp = gameInfosJSON[indexWeWant];
  
      JSONtmp.textForPhoneIndependance = req.params.txt;
    

  
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});

app.get('/ZBUMCommunicate/updateSkipText/:gameID/:skip/:pass', function (req, res) {
  // res.send("dd");
  let indexWeWant = takenGameIDs.indexOf(req.params.gameID.toUpperCase());
  if (indexWeWant == -1) {
    res.send("not found");
    return;
  }
  if(req.params.pass != passwords[indexWeWant]){
    res.send("not found");
    return;
  }

  let JSONtmp = gameInfosJSON[indexWeWant];
  
      JSONtmp.skipTextNow = req.params.skip;
    

  
  gameInfosJSON[indexWeWant] = JSONtmp;
  res.send("done"); //replace with your data here
});


app.get('/ZBUMCommunicate/makeGame/:gameID/:lang/:minPlayers/:maxPlayers/:gameDataNum/:masterDataNum/:playerInfoNum/:playerInputNum/:gameModeName/:gameModeType', function (req, res) {
  // res.send("dd");
  //console.log("gg0");
  if (takenGameIDs.indexOf(req.params.gameID.toUpperCase()) != -1) {
    res.send("taken");
    return;
  }
  
  // console.log("gg1");
  takenGameIDs.push(req.params.gameID.toUpperCase());
  passwords.push(makeRandomString(passwordLength));
  javascriptTexts.push(" ");
  languagePacks.push(" ");
  let playersJSONtmp ={
    "doesExist": false,
    "hisName": "AAA",
    "areYouAlive": false,
    "Active": false,
    "ipAddress": "aaa",
    "actionToTake": 0,
    "playerState": 0,
    "playerInfo":Array(parseInt(req.params.playerInfoNum)).fill(''),
    "playerInput":Array(parseInt(req.params.playerInputNum)).fill(''),
    "switchToThisPlayer": 0
  };
  let JSONtmp = {
    "gameID": req.params.gameID.toUpperCase(),
    "language": req.params.lang,
    "currentNumberOfPlayers": 0,
    "minNumberOfPlayers": parseInt(req.params.minPlayers),
    "maxNumberOfPlayers": parseInt(req.params.maxPlayers),
    "skipTextNow":"false",
    "gameState": "lobby",
    "gameModeName":req.params.gameModeName,
    "gameModeType":req.params.gameModeType,
    "currentTurn":0,
    "textForPhoneIndependance":"",
    "playerPoints" :Array(parseInt(req.params.maxPlayers)).fill(0),
    "gameData": Array(parseInt(req.params.gameDataNum)).fill(''),
    "masterData": Array(parseInt(req.params.masterDataNum)).fill(''),
    "Players": Array(parseInt(req.params.maxPlayers)).fill('')
  };

  for (let index = 0; index < parseInt(req.params.maxPlayers); index++) {
    JSONtmp.Players[index] =  JSON.parse(JSON.stringify(playersJSONtmp));
    
}
 

  gameInfosJSON.push(JSONtmp);

  res.send("doneUUU"+passwords[passwords.length-1]); //replace with your data here
});


function doShit() {
  fs.writeFileSync('jjj.json', tmp);
}


var student = {
  name: 'Mike',
  age: 23,
  gender: 'Male',
  department: 'English',
  car: 'Honda'
};

var data = JSON.stringify(student);


app.listen(3000);



function makeRandomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._!^*-";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}