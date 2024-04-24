

var table = document.querySelector(".Table");
var overlay = document.querySelector(".overlay");
var playerColor = "white";
var lastPos;
var hoveredItem;
var gameOver = false;
var isPlayerOrCpu;

var PlayerId;
var moveList;

var delayInMilliseconds = 500
const getRandomInt = (max) =>
{
    return Math.floor(Math.random() * max);
}
var rand = getRandomInt(2);
//rand === 1 ? true :   
var colorChosen =  false ;

function run() {
 
    // Creating Our XMLHttpRequest object 
    let xhr = new XMLHttpRequest();
 
    // Making our connection  
    let url = 'https://jsonplaceholder.typicode.com/todos/1';
    xhr.open("GET", url, true);
 
    // function execute after request is successful 
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    }
    // Sending our request 
    xhr.send();
}
const Send = (url, message, method, callback) =>
{
    const data = JSON.stringify(message);

    let xhr = new XMLHttpRequest();

    
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
             callback(this.responseText);
        }
    }
    
    xhr.send(data);

  
}
// overlay.lastChild.addEventListener('click', () =>
// {
//     overlay.style.display = "none";
//     ClearTable();
//     start();
//     gameOver = false;
//     playerColor = "white";
// });

const tableSign = colorChosen === true ? ["a", "b", "c", "d", "e","f", "g", "h"] :  ["a", "b", "c", "d", "e","f", "g", "h"].reverse()
const Figure =
{
    rock: `<div class="Figure" id="rook"></div>`,
    kinght: `<div class="Figure" id="knight"></div>`,
    Bishop: `<div class="Figure" id="bishop"></div>`,
    queen: `<div class="Figure" id="queen"></div>`,
    king: `<div class="Figure" id="king"></div>`,
    pawn: `<div class="Figure" id="pawn"></div>`,
}

Table = [
    Figure.rock, Figure.kinght, Figure.Bishop,Figure.queen, Figure.king,  Figure.Bishop, Figure.kinght, Figure.rock,
    Figure.pawn, Figure.pawn, Figure.pawn, Figure.pawn, Figure.pawn, Figure.pawn, Figure.pawn, Figure.pawn,
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    Figure.pawn, Figure.pawn, Figure.pawn, Figure.pawn, Figure.pawn, Figure.pawn, Figure.pawn, Figure.pawn,
    Figure.rock, Figure.kinght, Figure.Bishop,Figure.queen, Figure.king,  Figure.Bishop, Figure.kinght, Figure.rock,
]
const ClearTable = () =>
{
    var squers  = table.querySelectorAll(".box");
    squers.forEach(item  => {
        item.remove();
    });
}
const CpuMove = (res) =>
{
    tableSign.reverse()
   
    let resP = JSON.parse(res)
    console.log(resP.status);
    
    if(resP.status != undefined )
    {
        return resP.status;
    }
    let from = parseInt(resP.from[1]);
    let to = parseInt(resP.to[1])
    position = (((from - 1) * 8)) + tableSign.indexOf(resP.from[0])
    positionTo = (((to - 1) * 8)) + tableSign.indexOf(resP.to[0])

    moveList = resP.ValidMoves

    let el = document.querySelector(`[boxid="${position}"]`).childNodes[0];
    let nextPos = document.querySelector(`[boxid="${positionTo}"]`)
    if(nextPos.childNodes.length > 0)
        nextPos.childNodes[0].remove()


    setTimeout(function() {
        nextPos.append(el)

        tableSign.reverse()
        reversing()
    }, delayInMilliseconds);

    // 

}
const after = (res) =>
{
    let player = JSON.parse(res);
    PlayerId = player.PlayerId;
}
const CreateTable = (i) => {
    const newDiv = document.createElement("div");
    
    newDiv.innerHTML = Table[i];
    var row = Math.floor((63 - i) / 8) + 1;


    newDiv.setAttribute("BoxId", i);


    
    
    if (i < 16) {
        newDiv.firstChild.setAttribute("player", colorChosen === true ? "black" : "white")
        setImage(newDiv, colorChosen === true ? "black" : "white", i);
    } else if (i > 47) {
        newDiv.firstChild.setAttribute("player", colorChosen === false ? "black" : "white")
        setImage(newDiv, colorChosen === false ? "black" : "white", i);
    }
   
    if (row % 2 === 0) {
        if (i % 2 === 0) {
            newDiv.className = "white"

        } else {
            newDiv.className = "black"
        }

    } else {
        if (i % 2 === 0) {
            newDiv.className = "black"
        } else {
            newDiv.className = "white"

        }
    }

    newDiv.className += " box"



    if (newDiv.firstChild != null) {
        newDiv.firstChild.setAttribute("draggable", true)
        newDiv.firstChild.setAttribute("uniqeid", i);

    newDiv.firstChild.addEventListener("dragstart", function (event) {
            lastPos = event.target.parentElement;
         
            event.dataTransfer.setData("uniqid", event.target.getAttribute("uniqeid"));
       
            event.dataTransfer.setData("oldpos", lastPos.getAttribute("boxid"))
            event.dataTransfer.setData("figureId", event.target.getAttribute("id"));
        });
    }
    newDiv.addEventListener("dragover", function (event) {
        if(!gameOver){
            event.preventDefault();
        
            hoveredItem = event.target;
        }

    });

    newDiv.addEventListener("drop", async (event) =>
    {
        event.preventDefault();
        
        const uniqeid = event.dataTransfer.getData("uniqid");
        const oldPos = event.dataTransfer.getData("oldpos");
        const figureId = event.dataTransfer.getData("figureId");

        let newPosition = event.target.getAttribute("boxid") != undefined ? event.target.getAttribute("boxid") : event.target.parentElement.getAttribute("boxid") ;
        console.log(newPosition);
        var row = (Math.floor((63 - newPosition) / 8)) + 1
        var column = (newPosition) % 8;
        var rowold = (Math.floor((63 - oldPos) / 8)) + 1
        var old = (oldPos) % 8;
       
        let fid = figureId[1] === 'n' ? figureId[0] = 'n'.toUpperCase() : figureId[0].toUpperCase();
        console.log(moveList);

        if (!onClickEvent(uniqeid)) {
            return;
        }
        else if(event.target.className === "Figure" && event.target.getAttribute("player") != playerColor)
        {
            if(fid === 'P')
                fid = tableSign[old]
            if(fid === "N")
                fid = fid + rowold
            Send('http://127.0.0.1:3005/makemove',{"Position": `${fid}x${tableSign[column]}${row}`,"PlayerId": PlayerId},"POST", (res) =>
            {
                let resP = JSON.parse(res)
                var statusPl = resP.status;
                console.log(statusPl);
                if(statusPl === "Wrong Move")
                    return;

                document.querySelector(`[boxid="${newPosition}"]`).appendChild(document.querySelector(`[uniqeid="${uniqeid}"]`));
                event.target.remove();
                reversing()
                CpuMove(res)
            });
         
                
        }else if(event.target.getAttribute("player") === playerColor)
        {
            return
        }


        
        console.log(newPosition);
     

        console.log(row);
        console.log(`${figureId[0]}${tableSign[column]}${row}`);
        if(fid === 'P')
            fid = ''
        console.log(column , "ROW" , row);
        
        Send('http://127.0.0.1:3005/makemove',{"Position": `${fid}${tableSign[column]}${row}`, "PlayerId": PlayerId},"POST", (res) =>
        {
            let resP = JSON.parse(res)
            var statusPl = resP.status;
            
            if (event.target.className != "Figure" && statusPl != "Wrong Move") {
                event.target.appendChild(document.querySelector(`[uniqeid="${uniqeid}"]`));
                reversing()
                CpuMove(res)
            }
            
        })
        
        var figurepl = event.target.getAttribute("player");
      
    

    });

    table.appendChild(newDiv);

};

const setImage = (div, color, i) => {
    var firstNum = Table[i].search(`id="`);
    var lastNum = Table[i].search(`">`)
    var figure = Table[i].substring(firstNum + 4, lastNum)


    div.firstChild.style.backgroundImage = `url(Assats/Images/Noshadow/1024h/${figure}-${color}.png)`;
    div.firstChild.style.backgroundSize = " 50px 50px"
    div.firstChild.style.backgroundPosition = "50% 50%"
    div.firstChild.style.backgroundRepeat = "no-repeat"
}

const onClickEvent = (data) => {

   
    // if (!isvalidPlayer(data)) {

    //     console.log("Error");
    //     return false;
    // }

    if (!isValid(data)) {

        console.log("Error");

        return false;
    }


    //reversing();
    return true;

}
const isvalidPlayer = (data) => {
    var FigureColor = document.querySelector(`[uniqeid="${data}"]`).getAttribute('player');
    console.log(FigureColor);
    console.log(playerColor);
    if (playerColor === FigureColor)
        return true;

}
const EatFigure = (element) => {
    if(element.id === "king"){
        gameOver = true;
        ShowOverlay();
    }
    
    return true;
}
const ShowOverlay = () =>
{
    overlay.style.display = "flex";
    var PlNum = playerColor === "black" ? 2 : 1;
    overlay.firstChild.textContent = `Player ${PlNum} Win`
}
const reversing = () => {
    const allSquer = document.querySelectorAll(".box")
    allSquer.forEach((squer, i) => {
        var ids = parseInt(squer.getAttribute("boxid"));
        if (ids === i) {
            squer.setAttribute("boxid", ((8 * 8) - 1) - i)

        }

        else {
            squer.setAttribute("boxid", i)

        }

    })
}
const onEnterEvent = elem => {

    if (selectedElement != null) {

        console.log(elem);
        hoveredItem = elem.fromElement;

    }


}
const DraggingEvent = (elem) => {
    if (selectedElement != null) {
        selectedElement.style.left = (elem.x - elem.offsetX) + "px";
        selectedElement.style.top = (elem.y - elem.offsetY) + "px";
    }
}
const onStart = () =>
{
    Send('http://127.0.0.1:3005/gameStart',{}, "POST", after)
    for (let i = 0; i < 64; i++) 
    {
        //if(isPlayerOrCpu != undefined)
       
            CreateTable(i);
        
           
    }
    if(!colorChosen)
    {
        reversing();
    }
}
// Rules
const isValid = (data) => {
    
    var boxid = hoveredItem.getAttribute('boxid');
    if (boxid === null) {
        boxid = hoveredItem.parentElement.getAttribute('boxid');
    }

    var startboxid = lastPos.getAttribute('boxid');
    var Figure = document.querySelector(`[uniqeid="${data}"]`);
    const startingPositions = [48, 49, 50, 51, 52, 53, 54, 55]
    if(Figure.getAttribute('player') != playerColor)
        return;
    switch (Figure.id) {
        case "pawn":
            if (hoveredItem.className === "Figure") {
                var boxiditem = hoveredItem.parentElement;
                var boxids = boxiditem.getAttribute("boxid")
                if ((parseInt(startboxid) - 7 === parseInt(boxids))
                    || (parseInt(startboxid) - 9 === parseInt(boxids))) return true;
            }
            if (parseInt(startboxid) - 8 * 2 === parseInt(boxid) && boxid <= startboxid
                && startingPositions.includes(parseInt(startboxid))
                || (parseInt(startboxid) - 8 === parseInt(boxid))) return true;

            break;
        case "knight":
            if (parseInt(startboxid) - 15 === parseInt(boxid)
                || parseInt(startboxid) - 17 === parseInt(boxid)
                || parseInt(startboxid) - 10 === parseInt(boxid)
                || parseInt(startboxid) - 6 === parseInt(boxid)
                || parseInt(startboxid) + 15 === parseInt(boxid)
                || parseInt(startboxid) + 17 === parseInt(boxid)
                || parseInt(startboxid) + 10 === parseInt(boxid)
                || parseInt(startboxid) + 6 === parseInt(boxid)) return true
            break;
        case "rook":
            var startRow = Math.floor((63 - startboxid) / 8);
            var row = Math.floor((63 - boxid) / 8)
            var startColumn = (startboxid) % 8;
            var column = (boxid) % 8;
            var checkedId = startboxid;

            if (row === startRow) {
                checkedId = startboxid;
                while (boxid < checkedId) {
                    //// console.log("SMALLER 1");
                    checkedId = checkedId - 1;
                    //// console.log(checkedId);
                    var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                    if (el != null)
                        var FgID = el.parentElement.getAttribute("boxid")

                    if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) {
                        return true;
                    }
                    if (el != null) {

                        return false;
                    }

                    if (parseInt(boxid) === checkedId) {

                        return true
                    }

                }
                checkedId = startboxid;
                while (boxid > checkedId) {
                    //// console.log("BIGGER 1");
                    checkedId = parseInt(checkedId) + 1;
                    //// console.log(checkedId);
                    var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                    if (el != null)
                        var FgID = el.parentElement.getAttribute("boxid")

                    if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) {
                        return true;
                    }
                    if (el != null) {
                        return false;
                    }
                }
                return true;
            }
            else if (startColumn === column) {
                checkedId = startboxid;
                //// console.log(parseInt(boxid), parseInt(checkedId));
                //// console.log(parseInt(boxid) < parseInt(checkedId));
                //// console.log(parseInt(boxid) > parseInt(checkedId));

                while (parseInt(boxid) < parseInt(checkedId)) {
                    //// console.log("SMALLER");
                    checkedId = checkedId - 8 * 1;
                    //// console.log(table.querySelector(`[boxid="${Math.abs(checkedId)}"]`));
                    var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                    if (el != null)
                        var FgID = el.parentElement.getAttribute("boxid")

                    if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player") || parseInt(boxid) === checkedId) {
                        return true;
                    }
                    if (el != null) {
                        return false;
                    }



                }

                checkedId = startboxid;

                while (boxid > checkedId) {
                    //// console.log("BIGGER");
                    checkedId = parseInt(Math.abs(checkedId)) + 8;

                    //// console.log(table.querySelector(`[boxid="${Math.abs(checkedId)}"]`));
                    var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                    if (el != null)
                        var FgID = el.parentElement.getAttribute("boxid")

                    if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) {
                        return true;
                    }
                    if (el != null) {
                        return false;
                    }

                }
                return true;
            }
            break;
        case "queen":
            var startRow = Math.floor((63 - startboxid) / 8) + 1;
            var row = Math.floor((63 - boxid) / 8) + 1
            var startColumn = (startboxid) % 8 + 1;
            var column = (boxid) % 8 + 1;
            var checkedId = startboxid;
            if (row != startRow && column != startColumn) {
                var diagOne = Math.abs(((row - column)));
                var startDiagOne = Math.abs(((startRow - startColumn)));
                var diagTwo = column + row - 1;
                var startDiagTwo = startColumn + startRow - 1;
                checkedId = startboxid;
                if (diagOne === startDiagOne && diagTwo != startDiagTwo) {
                    // console.log("digone radi");
                    checkedId = parseInt(startboxid)
                    while (checkedId > parseInt(boxid)) {
                        checkedId = parseInt(checkedId) - 7;
                        // console.log(checkedId,"BIGGER");
                        var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                        if (el != null)
                            var FgID = el.parentElement.getAttribute("boxid")
                        if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) return true;
                        if (el != null) return false;
                        if (parseInt(boxid) === checkedId) return true
                    }
                    checkedId = parseInt(startboxid)
                    while (checkedId < parseInt(boxid)) 
                    {
                        checkedId = parseInt(checkedId) + 7;
                        var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                        if (el != null)var FgID = el.parentElement.getAttribute("boxid")
                        if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player"))  return true;
                        if (el != null) return false;
                        if (parseInt(boxid) === checkedId)return true
                    }
                    return true;
                }
                if (diagTwo === startDiagTwo) {
                    checkedId = parseInt(startboxid)
                    while (checkedId > parseInt(boxid)) 
                    {
                        checkedId = parseInt(checkedId) - 9;
                        var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                        if (el != null)
                            var FgID = el.parentElement.getAttribute("boxid")
                        if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) return true;
                        if (el != null)  return false;
                        if (parseInt(boxid) === checkedId)  return true
                    }
                    checkedId = parseInt(startboxid)
                    while (checkedId < parseInt(boxid)) {
                        checkedId = parseInt(checkedId) + 9;
                        var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                        if (el != null) var FgID = el.parentElement.getAttribute("boxid")
                        if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) {return true;}
                        if (el != null)return false;                        
                        if (parseInt(boxid) === checkedId) return true                       
                    }
                    return true
                }
            }
            if (row === startRow) {
                checkedId = startboxid;
                while (boxid < checkedId) {
                    checkedId = checkedId - 1;
                    var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                    if (el != null)var FgID = el.parentElement.getAttribute("boxid")
                    if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) return true;
                    if (el != null)  return false;
                    if (parseInt(boxid) === checkedId) return true                
                }
                checkedId = startboxid;
                while (boxid > checkedId) {
                    // console.log("BIGGER 1");
                    checkedId = parseInt(checkedId) + 1;
                    // console.log(checkedId);
                    var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                    if (el != null) var FgID = el.parentElement.getAttribute("boxid")
                    if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player"))  return true;
                    if (el != null) return false;
                }
                return true;
            }
            else if (startColumn === column) {
                checkedId = startboxid;
                while (parseInt(boxid) < parseInt(checkedId)) {
                    checkedId = checkedId - 8 * 1;
                    var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                    if (el != null)var FgID = el.parentElement.getAttribute("boxid")
                    if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) return true;                   
                    if (el != null) return false;
                    if (parseInt(boxid) === checkedId) return true;
                }
                checkedId = startboxid;
                while (boxid > checkedId) {
                    checkedId = parseInt(Math.abs(checkedId)) + 8;
                    var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                    if (el != null) var FgID = el.parentElement.getAttribute("boxid")
                    if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) return true;
                    if (el != null) return false;
                }
                return true;
            }
            break;
        case "bishop":
            var startRow = Math.floor((63 - startboxid) / 8) + 1;
            var row = Math.floor((63 - boxid) / 8) + 1
            var startColumn = (startboxid) % 8 + 1;
            var column = (boxid) % 8 + 1;
            var checkedId = startboxid;
            if (row != startRow && column != startColumn) {

                var diagOne = Math.abs(((row - column)));
                var startDiagOne = Math.abs(((startRow - startColumn)));

                var diagTwo = column + row - 1;
                var startDiagTwo = startColumn + startRow - 1;

                // console.log(column, row);
                // console.log("two", diagTwo, startDiagTwo);
                // console.log("one", diagOne, startDiagOne);

                // console.log(startboxid, boxid);
                checkedId = startboxid;

                if (diagOne === startDiagOne && diagTwo != startDiagTwo) {
                    // console.log("digone radi");
                    checkedId = parseInt(startboxid)

                    while (checkedId > parseInt(boxid)) {
                        checkedId = parseInt(checkedId) - 7;
                        // console.log(checkedId,"BIGGER");

                        var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                        if (el != null)
                            var FgID = el.parentElement.getAttribute("boxid")

                        if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) {
                            return true;
                        }

                        if (el != null) {
                            return false;
                        }

                        if (parseInt(boxid) === checkedId) {
                            return true
                        }

                    }

                    checkedId = parseInt(startboxid)
                    // console.log(checkedId);
                    while (checkedId < parseInt(boxid)) {
                        checkedId = parseInt(checkedId) + 7;
                        // console.log(checkedId, "SMALLER");

                        var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                        if (el != null)
                            var FgID = el.parentElement.getAttribute("boxid")

                        if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) {
                            return true;
                        }

                        if (el != null) {
                            return false;
                        }

                        if (parseInt(boxid) === checkedId) {
                            return true
                        }


                    }
                    return true

                }
                if (diagTwo === startDiagTwo) {
                    checkedId = parseInt(startboxid)

                    while (checkedId > parseInt(boxid)) {
                        checkedId = parseInt(checkedId) - 9;
                        // console.log(checkedId,"BIGGER");

                        var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;
                        if (el != null)
                            var FgID = el.parentElement.getAttribute("boxid")

                        if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) {
                            return true;
                        }

                        if (el != null) {
                            return false;
                        }

                        if (parseInt(boxid) === checkedId) {
                            return true
                        }

                    }

                    checkedId = parseInt(startboxid)
                    // console.log(checkedId);
                    while (checkedId < parseInt(boxid)) {
                        checkedId = parseInt(checkedId) + 9;
                        // console.log(checkedId, "SMALLER");

                        var el = table.querySelector(`[boxid="${Math.abs(checkedId)}"]`).firstChild;

                        if (el != null)
                            var FgID = el.parentElement.getAttribute("boxid")

                        if (boxid === FgID && el.getAttribute("player") != Figure.getAttribute("player")) {
                            return true;
                        }

                        if (el != null) {
                            return false;
                        }

                        if (parseInt(boxid) === checkedId) {
                            return true
                        }


                    }
                    return true

                }




            }


            break;
        case "king":

            if (parseInt(startboxid) - 8 === parseInt(boxid) || parseInt(startboxid) + 8 === parseInt(boxid)
                || parseInt(startboxid) - 7 === parseInt(boxid) || parseInt(startboxid) + 7 === parseInt(boxid)
                || parseInt(startboxid) - 9 === parseInt(boxid) || parseInt(startboxid) + 9 === parseInt(boxid)
                || parseInt(startboxid) - 1 === parseInt(boxid) || parseInt(startboxid) + 1 === parseInt(boxid)) {

                return true;
            }

            break;
        default:
            break;
    }
    return false;
}


onStart();