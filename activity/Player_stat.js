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

function extractHtml(html){
    let selectorTool=cheerio.load(html);
    // array of all division of the matches 
    let matches=selectorTool(".col-md-8.col-16");

    for(let i=0;i<matches.length;i++){
        let matchesAnchor = selectorTool(matches[i]).find("a[class='match-info-link-FIXTURES']");
        let matchesLink="https://www.espncricinfo.com/"+selectorTool(matchesAnchor).attr("href");
        console.log(matchesLink);
        pasteRecordToJsonReq(matchesLink);
    }
}

function pasteRecordToJsonReq(matchesLink){
    request(matchesLink,cb);
    function cb(err , response , html){
        if(err){
            console.log(err);
        }else{
            pasteRecordToJson(html);
        }
    }
}

function pasteRecordToJson(html){
    let selectorTool=cheerio.load(html);

    let scorecardTable=selectorTool(".table.batsman");
    let teamNames=selectorTool(".header-title.label");
    let firstTeamDiv=scorecardTable[0];
    let secondTeamDiv=scorecardTable[1];

    // find Team Names whose match is happining ---------------
    let firstTeamArr=selectorTool(teamNames[0]).text().split(" ").slice(0,2);
    let firstTeam=firstTeamArr[0]+" "+firstTeamArr[1];
    let secondTeamArr=selectorTool(teamNames[1]).text().split(" ").slice(0,2);
    let secondTeam=secondTeamArr[0]+" "+secondTeamArr[1];
      
        //----- First Team played ----
        let firstTeamFolderPath=path.join("F:\\WebDev\\Player_statistic\\activity\\Teams",firstTeam);
        createDir(firstTeamFolderPath);
        let firstTabSingleBatsman=selectorTool(scorecardTable[0]).find("tbody tr");
        // iteration in batsman table
        for(let i=0;i<firstTabSingleBatsman.length-1;i=i+2){
            let allCol=selectorTool(firstTabSingleBatsman[i]).find("td");
            let batsmanName=selectorTool(allCol[0]).text();
            let batsmanJsonFilePath=path.join(firstTeamFolderPath,batsmanName+".json");
            createfile(batsmanJsonFilePath);
        
        }

        let secondTeamFolderPath=path.join("F:\WebDev\Player_statistic\activity\Teams",secondTeam);
    createDir(secondTeamFolderPath);
    //---------------------------


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