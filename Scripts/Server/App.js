
import { Chess } from "chess.js";
import express from "express";
import cors from "cors";

const app = express();
let chess = new Chess();
const PORT = 3005;

let Player = 
{
  "playerId": 0,
  "Game" : new Chess(),
  isOnline : true,
  "Score" : 0
  
}
let PlayerList = []

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5500');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  next();
});
let movesPl = []
let moves =[]
let Game
let validMove
const Playerfirst = (PlMove, pID) =>
{
  
  Game = PlayerList[pID].Game;
  // Player move
  movesPl = Game.moves()
  if(movesPl.length < 1) 
    return JSON.stringify({"status": "Cpu Win"})
  
  console.log("Player Move: "+ movesPl);
  console.log("Player Move: "+ PlMove);
  for(let i = 0; i < movesPl.length; i++)
  {
    let mv = movesPl[i]
    if(mv === PlMove)
    {
      validMove = true
      break;
    }else
    {
      validMove = false;
      continue;
    }
    
  };
  console.log(validMove);
  if(!validMove)
    return JSON.stringify({"status": "Wrong Move"})


  Game.move(PlMove);
  //
  // cpu move
  moves  = Game.moves()
  if(moves.length <1) 
    return JSON.stringify({"status": "You Win"})
  const cpuMove = moves[Math.floor(Math.random() * moves.length)]
  Game.move(cpuMove);
  //

  movesPl = Game.moves()
  console.log(movesPl);

  // response
  let index = Game.history({ verbose: true }).length
  let obj = JSON.stringify({"from": Game.history({ verbose: true }).at(index-1).from, "to":Game.history({ verbose: true }).at(index-1).to, "ValidMoves": moves})

  return obj
}
app.post('/gameStart', (req,res) =>
{
  
  Player.Game = new Chess()

  Player.playerId = PlayerList.length 
  
  PlayerList.push(Player)
  
  res.send({"PlayerId": Player.playerId})
})

app.post("/makemove", (req, res) => {
 
  const date = req.body
  let pluMove = date.Position
  
  res.send(Playerfirst(pluMove, date.PlayerId));

});

// while (!chess.isGameOver()) {
//   const moves = chess.moves()
//   const move = moves[Math.floor(Math.random() * moves.length)]

  
//   chess.move(move)
// }


console.log(chess.pgn())

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});