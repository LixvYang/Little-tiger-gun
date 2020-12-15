const http = require('http');
const querystring = require('querystring');
const url = require('url');
const fs = require('fs');
const express = require('express')
//导入游戏
const game = require('./game')
const app = express();


let playerWon = 0;
let playerLastAction = null;
let sameCount = 0;
let playerLose = 0;

app.get('/favicon.ico',function(request,response){
    response.writeHead(200);
    response.end();
    return;
})

app.get('/game',function(request,response){
    const parsedUrl = url.parse(request.url);
    const query = querystring.parse(parsedUrl.query);
    const playerAction = query.action;
    if (playerWon >= 3 || sameCount == 9) {
        response.writeHead(500);
        response.end('我再也不和你玩了！');
        return
    }
    if(playerLose>=3){
        response.writeHead(500);
        response.end('你太菜了，我不屑与你玩！');
        return
    }
    // 当玩家操作与上次相同，则连续相同操作统计次数+1，否则统计清零
    // 当玩家操作连续三次相同，则视为玩家作弊，把sameCount置为9代表有过作弊行为
    if (playerLastAction && playerAction == playerLastAction) {
        sameCount++;
    } else {
        sameCount = 0;
    }
    playerLastAction = playerAction

    if (sameCount >= 3) {
        response.writeHead(400);
        response.end('你作弊！');
        sameCount = 9;
        return 
    }

    // 执行游戏逻辑
    const gameResult = game(playerAction);

    // 先返回头部
    response.writeHead(200);

    // 根据不同的游戏结果返回不同的说明
    if (gameResult == 0) {
        response.end('平局！');

    } else if (gameResult == 1) {
        response.end('你赢了！');
        // 玩家胜利次数统计+1
        playerWon++;

    } else {
        response.end('你输了！');
        // 玩家输的次数+1
        playerLose++;
        }

})


app.get('/',function(request,response){
    fs.createReadStream(__dirname + '/index.html').pipe(response);
})


app.listen(3000)