const http = require('http');
const querystring = require('querystring');
const url = require('url');
const fs = require('fs');
//导入游戏
const game = require('./game')

let playerWon = 0;
let playerLastAction = null;
let sameCount = 0;
let playerLose = 0;
http.createServer(
    function(req,res){
        //通过内置模块url，解析发送自url的包
        //将其分割成 协议(protocol)://域名(host):端口(port)/路径名(pathname)?请求参数(query)
        const parsedUrl = url.parse(req.url);
        //访问不存在
        if(parsedUrl.pathname == '/favicon.ico'){
            res.writeHead(200);
            res.end();
            return;
        };
        if (parsedUrl.pathname == '/game') {
            // 如果请求url是游戏请求，比如 http://localhost:3000/game?action=rock的情况
            // 就要把action解析出来，然后执行游戏逻辑
            const query = querystring.parse(parsedUrl.query);
            const playerAction = query.action;
            
            // 如果统计的玩家胜利次数超过3
            // 或者玩家出现过作弊的情况（sameCount=9代表玩家有过作弊行为）
            if (playerWon >= 3 || sameCount == 9) {
                res.writeHead(500);
                res.end('我再也不和你玩了！');
                return
            }
            if(playerLose>=3){
                res.writeHead(500);
                res.end('你太菜了，我不屑与你玩！');
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
                res.writeHead(400);
                res.end('你作弊！');
                sameCount = 9;
                return 
            }

            // 执行游戏逻辑
            const gameResult = game(playerAction);

            // 先返回头部
            res.writeHead(200);

            // 根据不同的游戏结果返回不同的说明
            if (gameResult == 0) {
                res.end('平局！');

            } else if (gameResult == 1) {
                res.end('你赢了！');
                // 玩家胜利次数统计+1
                playerWon++;

            } else {
                res.end('你输了！');
                // 玩家输的次数+1
                playerLose++;
                }
        }

        // 如果访问的是根路径，则把游戏页面读出来返回出去
        if (parsedUrl.pathname == '/') {
            fs.createReadStream(__dirname + '/index.html').pipe(res);
        }


        })
        .listen(3000)
