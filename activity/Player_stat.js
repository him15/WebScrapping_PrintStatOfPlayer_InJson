let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results";
let request=require("request");
let cheerio=require("cheerio");
let path=require("path");
let fs=require("fs");
console.log("before");
createDir("F:\\WebDev\\Player_statistic\\activity\\Teams");
request(url,cb);
function cb(error, response , html){
    if(error){
        console.log(error);
    }else{
        extractHtml(html);
    }
}
let v=1;
function extractHtml(html){
    let selectorTool=cheerio.load(html);
    // array of all division of the matches 
    let matches=selectorTool(".col-md-8.col-16");
    let discriptionDiv=selectorTool(".match-info.match-info-FIXTURES");

    for(let i=0;i<matches.length;i++){
        // find the discription
        let discriptionTab=selectorTool(discriptionDiv[i]).find("div[class='description']");
        let matchesAnchor = selectorTool(matches[i]).find("a[class='match-info-link-FIXTURES']");
        let matchesLink="https://www.espncricinfo.com/"+selectorTool(matchesAnchor).attr("href");
        let discription=selectorTool(discriptionTab).text().split(",");
        
        // discription[1] -> Venue     discription[2] -> date
        pasteRecordToJsonReq(matchesLink , discription[1] , discription[2]);
    }
}

function pasteRecordToJsonReq(matchesLink , venue , date){
    request(matchesLink,cb);
    function cb(err , response , html){
        if(err){
            console.log(err);
        }else{
            pasteRecordToJson(html , venue , date);
        }
    }
}

function pasteRecordToJson(html , venue , date){
    let selectorTool=cheerio.load(html);

    let scorecardTable=selectorTool(".table.batsman");
    let teamNames=selectorTool(".header-title.label");
    let firstTeamDiv=scorecardTable[0];
    let secondTeamDiv=scorecardTable[1];

    // find Team Names whose match is happining ---------------
    // let firstTeamArr=selectorTool(teamNames[0]).text().split(" ").slice(0,2);
    // let firstTeam=firstTeamArr[0]+" "+firstTeamArr[1];
    // let secondTeamArr=selectorTool(teamNames[1]).text().split(" ").slice(0,2);
    // let secondTeam=secondTeamArr[0]+" "+secondTeamArr[1];
    
    // Team Loop  
    for(let j=0;j<2;j++){
        // find team name
        let teamArr=selectorTool(teamNames[j]).text().split(" ").slice(0,2);
        let teamName=teamArr[0]+" "+teamArr[1];
        // path to create the team folder 
        let teamFolderPath=path.join("F:\\WebDev\\Player_statistic\\activity\\Teams",teamName);
        createDir(teamFolderPath);

        let arr=[];
        // find scorecard and player runs 
        let tabSingleBatsman=selectorTool(scorecardTable[j]).find("tbody tr");
        for(let i=0;i<tabSingleBatsman.length-1;i=i+2){
            let allCol=selectorTool(tabSingleBatsman[i]).find("td");


            // 23567
            let batsmanName=selectorTool(allCol[0]).text();
            let batsmanRun=selectorTool(allCol[2]).text();
            let batsmanBall=selectorTool(allCol[3]).text();
            let batsmanFour=selectorTool(allCol[5]).text();
            let batsmanSix=selectorTool(allCol[6]).text();
            let batsmanSR=selectorTool(allCol[7]).text();
            
            let batsmanJsonFilePath=path.join(teamFolderPath,batsmanName+".json");
            createfile(batsmanJsonFilePath);


            // let content=fs.readFileSync(batsmanJsonFilePath);
            // let json = JSON.parse(content); 
            // write in json file 
            arr.push({
                "Runs : ": batsmanRun,
                "Balls : ": batsmanBall,
                "Four : ": batsmanFour,
                "Six : ": batsmanSix,
                "Strike Rate : ": batsmanSR,
                "Venue : ": venue,
                "Date : ":date
                
            });
            fs.writeFileSync( batsmanJsonFilePath, JSON.stringify(arr));
        }
    }

    //---------------------------

    console.log(v++ +" team completed!");
}







// create the folders 
function createDir(pathOfFolder){
    if (fs.existsSync(pathOfFolder) == false){
        fs.mkdirSync(pathOfFolder);
    }
}

//creating the json file 
function createfile(filepath){
    if (fs.existsSync(filepath) == false){
        let createStream=fs.createWriteStream(filepath);
        createStream.end();
    }
}