/*
Ingressei na Universidade Federal do Rio de Janeiro pela primeira vez em 2011 np curso de bacharelado em física. 
Apesar de sempre gostar de matemática e física, tive uma formação altamente musical e durante meu tempo livre passei produzindo ou estudando música.
/*

This script is usable in https://www.haxball.com/headless
Steps:
    1) Copy this script
    2) Go to the link, then press F12
    3) Go to console if it's not already set, then paste
    4) Enter
    5) IF THIS TAB IS CLOSED THE ROOM WILL BE CLOSED TOO
*/
geo = {"code": "br"};
var room = HBInit({ roomName: "Copa Edmundo XIII", 
                    maxPlayers: 12, 
                    password:"coronga", 
                    playerName : "Primo",
                    public : false, 
                    geo
                    });
                    
room.setDefaultStadium("Classic");
room.setScoreLimit(0);
room.setTimeLimit(3);
 

/*
    Functions
*/
// If there are no admins left in the room give admin to one of the remaining players.
function updateAdmins() {
  // Get all players except the host (id = 0 is always the host)
  var players = room.getPlayerList().filter((player) => player.id != 0 );
  if ( players.length == 0 ) return; // No players left, do nothing.
  if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
  room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
}
 
function clonekick(player){
    players = room.getPlayerList();
    for (i = 0; i < players.length-1; i++){
        if (player.name == players[i].name){
            room.kickPlayer(player.id,"Já existe um usuário com esse nome.",false);
        }
    }
}
 
function initPlayerStats(player){
    if (stats.get(player.name)) return;
    stats.set(player.name, [0, 0, 0, 0, 0, 0]) // goals, assists, wins, loses, og, cs
}
 
/*
for commands
*/
 
function marcadorFun(player){ // !marcador
    if (player.admin == true){
        if ( marcador == false ){
            marcador = true;
            room.sendChat("Marcador Ativado.");
            return false;
        }
        else if ( marcador == true ){
            marcador = false;
            room.sendChat("Marcador Desativado.");
            return false;
        }
    }
}
 
function spamFun(player){ // !spam
    if (player.admin == true){
        if ( spam == false ){
            spam = true;
            room.sendChat("Spam Ativado.");
            return false;
        }
        else if ( spam == true ){
            spam = false;
            room.sendChat("Spam Desativado.");
            return false;
        }
    }
}
 
function resetAllFun(player){ // !resetall
    if (player.admin == true){
        players = Array.from(stats.keys());
        for (var i = 0; i < players.length; i++) {
            stats.set(players[i], [0,0,0,0,0,0]);
        }
        room.sendChat("Os stats foram resetados.");
        return false;
    }
}
 
function reset(name){
        stats.set(name, [0,0,0,0,0,0]);
        room.sendChat("Resatado os stats de: " + name);
}
 
function adminResetFun(player, message){ // !reset Jugador
    if (player.admin == true){
        if (stats.get(message.substr(7))){
            if ( temp == false ){
            temp = true;
            setTimeout( function(){
                 reset(message.substr(7));
                 temp = false;
            }, 3000);
            return false;
            }
        } else{ return false;}
    }
}
 
function swapFun(player){
    if (player.admin == true){
        if (room.getScores() == null) {
            players = room.getPlayerList();
            for (i = 0; i < players.length; i++){
                if (players[i].team == 1){
                    room.setPlayerTeam(players[i].id, 2);
                }
                else if (players[i].team == 2){
                    room.setPlayerTeam(players[i].id, 1);
                }
            }
        }
    }
}

function swapSet(){
    
    if (room.getScores() == null) {
        players = room.getPlayerList();
        for (i = 0; i < players.length; i++){
            if (players[i].team == 1){
                room.setPlayerTeam(players[i].id, 2);
            }
            else if (players[i].team == 2){
                room.setPlayerTeam(players[i].id, 1);
            }
        }
        try {
            // room.sendChat("/colors red " + teamsUniforms[team[blue][name]]) // SET RED TEAM UNIFORM
            // room.sendChat("/colors blue " + teamsUniforms[team[red][name]]) // SET BLUE TEAM UNIFORM
        }
        catch (err){
            // room.sendChat("Não foi possivel setar o uniforme de algum dos times.")
        }
    }
    
}

var teamsUniforms = {
    "BabyGotHax": "45 000000 962EFF F2F21F 962EFF",
    "420BlazeHax": "120 FFFFFF 0080FF 250C77 FFFFFF",
    "MaconhaFazMal": "0 000000 1AFF00 F7FF00 FF0000",
    "Punzinho": "90 FFFAFA FF0000 00000 FF0000",
    "GrandeUniao": "30 000000 0071F2 00F2F2 0071F2",
    "Quarenteners": "",
    "StardewBois": "90 304CFF 13FF03 F7FF0A",
    "NoName": "90 000000 FF0A9D E9FF26 FF0A9D",
}

function uniformFun(team, uniform){ // !uniform <teamname>  command to change teams uniforms
    // TO DO
}
 
var team;
var championship = false;
function startSetFun(player,msg){ // the teams names received in msg must match exactly with the names at teamsUniforms dict ("team1 team2")
    championship = true;
    sub = msg.substr(msg.indexOf(' ')+1);
    param = sub.split(" x ");

    red = param[0]; 
    blue = param[1];

    team = {red:{
                name:red,
                score:0
            },
            blue:{
                name:blue,
                score:0
            }};

    // try {
    //     // room.sendChat("/colors red " + teamsUniforms[red]) // SET RED TEAM UNIFORM
    //     // room.sendChat("/colors blue " + teamsUniforms[blue]) // SET BLUE TEAM UNIFORM
    // }
    // catch (err){
    //     room.sendChat("Não foi possivel setar o uniforme de algum dos times.")
    // }

    room.sendChat("Mais um jogo da Copa Edmundo XIII começará em breve!!");
    room.sendChat("Jogadores se preparem que o administrador do campeonato os colocará nos times corretos!");
    room.sendChat(red+" x "+blue);

 
}

function pushMuteFun(player, message){ // !mute Anddy
    // Prevent somebody to talk in the room (uses the nickname, not the id)
    // need to be admin
    if (player.admin == true){
        if (!(mutedPlayers.includes(message.substr(6)))) mutedPlayers.push(message.substr(6));
    }
}
 
function gotMutedFun(player){
    if (mutedPlayers.includes(player.name)){
        return true;
    }
}
 
function unmuteFun(player, message){ // !unmute Anddy
    // Allow somebody to talk if he has been muted
    // need to be admin
    if (player.admin == true){
        pos = mutedPlayers.indexOf(message.substr(9));
        mutedPlayers.splice(pos, 1);
    }
}
 
function adminFun(player, message){ // !admin Anddyisthebest
    // Gives admin to the person who type this password
 
    room.setPlayerAdmin(player.id, true);
    return false; // The message won't be displayed
}
 
function helpFun() { // !help
    room.sendChat('Comandos: "!stats jogador", "!ranking", "!topgol", "!topassist", "!resetstats", "!poss"');
    return false;
}
 
function adminHelpFun() {
    room.sendChat('Comandos: "!mute jogador", "!unmute jogador", ' +
    '"!clearbans", "!swap", "!reset jogador", "!resetall", "!marcador", "!spam"');
    return false;
}
 
function rankHelpFun() { // !rankhelp
    return false;
}
 
function statsFun(player, message){ // !stats Anddy
    if (stats.get(message.substr(7))){
        if ( temp2 == false ){
        temp2 = true;
        setTimeout( function(){
             sendStats(message.substr(7));
             temp2 = false;
        }, 3000);
        return false;
        }
    } else{ return false;}
}
 
function rankFun() { // !ranking
    if ( temp == false ){
        temp = true;
        setTimeout( function(){
             ranking();
             temp = false;
        }, 3000);
        return false;
    }
}
 
function asistenciasFun() { // !topassist
    if ( temp == false ){
        temp = true;
        setTimeout( function(){
             asistencias();
             temp = false;
        }, 3000);
        return false;
    }
}
 
function golesFun() { // !topgol
    if ( temp == false ){
        temp = true;
        setTimeout( function(){
             goles();
             temp = false;
        }, 3000);
        return false;
    }
}
 
function resetStatsFun (player){ // !resetstats
        stats.set(player.name, [0,0,0,0,0,0]);
        room.sendChat("Stats resetados.")
}
 
function clearFun(player){ // !clearbans
    if (player.admin == true) room.clearBans();
    room.sendChat('Bans removidos.')
}
 
function resetFun(player){
    if (player.admin == true){
        room.stopteam();
        room.startteam();
    }
}

function placarFun(){
    room.sendChat(team.red.name + " "+ team.red.score + " X "+ team.blue.score + " "+ team.blue.name);
}
 
/*
    For ranking
*/
 
function rankingCalc(player){
    return stats.get(player)[0] * 2 + stats.get(player)[1] * 2 +
            stats.get(player)[2] * 4 + stats.get(player)[5] * 3 -
            stats.get(player)[3] * 5 - stats.get(player)[4] * 2;
}
 
function golesCalc(player){
    return stats.get(player)[0] * 1;
}
 
function asistenciasCalc(player){
    return stats.get(player)[1] * 1;
}
 
function asistencias(){
 
    var overall3 = [];
    players3 = Array.from(stats.keys());
    for (var i = 2; i < players3.length; i++) {
        score = asistenciasCalc(players3[i])
        overall3.push({name: players3[i], value: score});
 
    }
    overall3.sort(function(a,b){
        return b.value - a.value;
    })
 
    if ( overall3.length < 4 ) { room.sendChat("Não há jogadores o suficiente. "); return; }
    else if ( overall3.length >= 4 ){
        room.sendChat("- - - Top Assistências - - -")
        for (var i = 0; i < 4; i++) {
            if (overall3[i].value != 0){
                room.sendChat( i+1 + ") " + overall3[i].name + ": " + overall3[i].value + " asis, ");
            }
        }
    }
}
 
function goles(){
 
    var overall2 = [];
    players2 = Array.from(stats.keys());
    for (var i = 2; i < players2.length; i++) {
        score = golesCalc(players2[i])
        overall2.push({name: players2[i], value: score});
 
    }
    overall2.sort(function(a,b){
        return b.value - a.value;
    })
 
    if ( overall2.length < 4 ) { room.sendChat("Não há jogadores o suficiente. "); return; }
    else if ( overall2.length >= 4 ){
        room.sendChat("- - - Top Goleadores - - -")
        for (var i = 0; i < 4; i++) {
            if (overall2[i].value != 0){
                room.sendChat( i+1 + ") " + overall2[i].name + ": " + overall2[i].value + " gols, ");
            }
        }
    }
}
 
function ranking(){
 
    var overall = [];
    players = Array.from(stats.keys());
    for (var i = 2; i < players.length; i++) {
        score = rankingCalc(players[i])
        // Goal: 5 pts, assist: 3 pts, win: 3 pts, cs: 6 pts, lose: -7 pts, og: -4 pts
        overall.push({name: players[i], value: score});
    }
    overall.sort(function(a,b){
        return b.value - a.value;
    })
   
    if ( overall.length < 4 ) { room.sendChat("Não há jogadores o suficiente. "); return; }
    else if ( overall.length >= 4 ){
        room.sendChat("- - - Top Geral - - -")
        for (var i = 0; i < 4; i++) {
            if (overall[i].value != 0){
                room.sendChat( i+1 + ") " + overall[i].name + ": " + overall[i].value + " pts, ");
            }
        }
    }
}
 
function sendStats(name){
    ps = stats.get(name); // stands for playerstats
    room.sendChat(name + ": Gols: " + ps[0] + ", assistências: " + ps[1]
    + ", contras: " + ps[4] + ", arco invicto: " + ps[5] + ", victórias: " + ps[2] + ", derrotas: " + ps[3] +
    " total: " + rankingCalc(name));
}
 
function whichTeam(){ // gives the players in the red or blue team
    var players = room.getPlayerList();
    var redTeam = players.filter(player => player.team == 1);
    var blueTeam = players.filter(player => player.team == 2);
    return [redTeam, blueTeam]
}
 
function updateWinLoseStats(winners, losers){
    for (var i = 0; i < winners.length; i++) {
        stats.get(winners[i].name)[2] += 1;
    }
    for (var i = 0; i < losers.length; i++) {
        stats.get(losers[i].name)[3] += 1;
    }
}
 
function initBallCarrying(redTeam, blueTeam){
    var ballCarrying = new Map();
    var playing = redTeam.concat(blueTeam);
    for (var i = 0; i < playing.length; i++) {
        ballCarrying.set(playing[i].name, [0, playing[i].team]); // secs, team, %
    }
    return ballCarrying;
}
 
 
 
function updateTeamPoss(value){
    if (value[1] == 1) redPoss += value[0];
    if (value[1] == 2) bluePoss += value[0];
}
 
var bluePoss;
var redPoss;
function teamPossFun(){
    if (room.getScores() == null) return false;
    bluePoss = 0;
    redPoss = 0;
    ballCarrying.forEach(updateTeamPoss);
    redPoss = Math.round((redPoss / room.getScores().time) * 100);
    bluePoss = Math.round((bluePoss / room.getScores().time) * 100);
    room.sendChat("Posse de bola:  RED " + redPoss + "% - BLUE " + bluePoss + "% "  );
 
}


 
 
 
/*
For the team
*/
 
// Gives the last player who touched the ball, works only if the ball has the same
// size than in classics maps.
var radiusBall = 10;
var triggerDistance = radiusBall + 15 + 0.1;
function getLastTouchTheBall(lastPlayerTouched, time) {
    var ballPosition = room.getBallPosition();
    var players = room.getPlayerList();
    for(var i = 0; i < players.length; i++) {
        if(players[i].position != null) {
            var distanceToBall = pointDistance(players[i].position, ballPosition);
            if(distanceToBall < triggerDistance) {
                lastPlayerTouched = players[i];
                return lastPlayerTouched;
            }
        }
    }
    return lastPlayerTouched;
 
}

function resetSet(){
    championship = false;
    team = null;
    endSet = false;
    secondSet = false;
    room.sendChat("Partida finalizada" )

}
 
 
 
// Calculate the distance between 2 points
function pointDistance(p1, p2) {
    var d1 = p1.x - p2.x;
    var d2 = p1.y - p2.y;
    return Math.sqrt(d1 * d1 + d2 * d2);
}
 
function isOvertime(){
    scores = room.getScores();
    if (scores != null){
        if (scores.timeLimit != 0){
            if (scores.time > scores.timeLimit){
                if (scores.red == 0 && hasFinished == false){
                    stats.get(gk[0].name)[5] += 1;
                    stats.get(gk[1].name)[5] += 1;
                    hasFinished = true;
                }
            }
        }
    }
}
 
// return: the name of the team who took a goal
var team_name = team => team == 1 ? "Blue" : "Red";

// return: whether it's an OG
var isOwnGoal = (team, player) => team != player.team ? " (contra)" : ""; 
 
// return: a better display of the second when a goal is scored
var floor = s => s < 10 ? "0" + s : s;
 
// return: whether there's an assist
var playerTouchedTwice = playerList => playerList[0].team == playerList[1].team ? " (Assistência de " + playerList[1].name + ")" : "";
 

/*
Events
*/
 
var gkflag = false;
var spam = true;
var temp2 = false;
var marcador = false;
var temp = false;
var endSet = false;
var stats = new Map(); // map where will be set all player stats
var mutedPlayers = []; // Array where will be added muted players
var init = "init"; // Smth to initialize smth
init.id = 0; // Faster than getting host's id with the method
init.name = "init";
var scorers ; // Map where will be set all scorers in the current team (undefined if reset or end)
var whoTouchedLast; // var representing the last player who touched the ball
var whoTouchedBall = [init, init]; // Array where will be set the 2 last players who touched the ball


 
var commands = {
    // Command that doesnt need to know players attributes.
    "!help": helpFun,
    "!adminhelp": adminHelpFun,
    "!rankhelp": rankHelpFun,
    "!ranking": rankFun,
    "!topgol": golesFun,
    "!topassist": asistenciasFun,
    "!poss": teamPossFun,
 
    // Command that need to know who is the player.
    "!resetstats": resetStatsFun,
    "!admin": adminFun,
    "!reset": adminResetFun,
    "!resetall": resetAllFun,
    "!marcador": marcadorFun,
    "!spam": spamFun,    
    // "!gk": gkFun,
    // "!gkhelp": gkHelpFun,
 
    // Command that need to know if a player is admin.
    "!swap": swapFun,
    "!rr": resetFun,
    "!clearbans": clearFun,
 
    // Command that need to know what's the message.
    "!stats": statsFun,
 
    // Command that need to know who is the player and what's the message.
    "!mute" : pushMuteFun,
    "!unmute": unmuteFun,

    // Campeonato
    "!startset":startSetFun,
    "!placar":placarFun,
    "!reset":resetSet
 
}
 
initPlayerStats(room.getPlayerList()[0]) // lazy lol, i'll fix it later
initPlayerStats(init);
 
room.onPlayerLeave = function(player) {
  updateAdmins();
}
 
 
 
room.onPlayerJoin = function(player) {
    clonekick(player);
    updateAdmins(); // Gives admin to the first player who join the room if there's no one
    initPlayerStats(player); // Set new player's stat
   room.sendChat("Olá " + player.name + " ! Bem-vindo à Copa Edmundo XIII!" )
}
 
var redTeam;
var blueTeam;
var overtimeEnd;

room.onGameStart = function() {
    overtimeEnd = false;

    [redTeam,blueTeam] = whichTeam();
    ballCarrying = initBallCarrying(redTeam, blueTeam);

    if(championship){
        if(!secondSet){
            room.sendChat("Jogo iniciado! "+team.red.name+" x " +team.blue.name);
        }else{
            room.sendChat("O Segundo tempo começou! "+team.red.name+" "+team.red.score+" x " +team.blue.score+" "+team.blue.name);

        }
    }
    

}
 
room.onPlayerTeamChange = function(player){
    if (room.getScores() != null){
        if (1 <= player.team <= 2) ballCarrying.set(player.name, [0, player.team]);
    }
}
 
room.onPlayerChat = function(player, message) {
    if (mutedPlayers.includes(player.name)) return false;
    let spacePos = message.search(" ");
    let command = message.substr(0, spacePos !== -1 ? spacePos : message.length);
    if (commands.hasOwnProperty(command) == true) return commands[command](player, message);
 
}
 
room.onPlayerBallKick = function (player){
    whoTouchedLast = player;
}
 
var kickOff = false;
var secondSet = false;
room.onGameTick = function() {  
    scores = room.getScores();

    if (scores.time>scores.timeLimit && secondSet && !overtimeEnd) {
        if(team.red.score != team.blue.score){
            console.log('ENTREI OVERTIME END SECOND SET')
            room.onTeamVictory(scores);
            overtimeEnd = true;
        }
    }

    if (scores.time>scores.timeLimit && !secondSet && !overtimeEnd) {
        console.log('ENTREI OVERTIME END FIRST SET')
        room.onTeamVictory(scores);
        overtimeEnd = true;
    }



    /*
    if (kickOff == false) { // simplest comparison to not charge usulessly the tick thing
        if (room.getScores().time != 0){
            kickOff = true;
            gk = isGk();
            gkflag = true;
            if ( spam == true ){
                room.sendChat("Goleiro do time "+team.red.name+" : " + gk[0].name + ", Goleiro do time "+team.blue.name+" : " + gk[1].name)
            }
        }
    }
    */
 
    whoTouchedLast = getLastTouchTheBall(whoTouchedLast);
 
    if (whoTouchedLast != undefined) {
 
        if (ballCarrying.get(whoTouchedLast.name)) {
            ballCarrying.get(whoTouchedLast.name)[0] += 1/60;
        }
 
        if  ( whoTouchedLast.id != whoTouchedBall[0].id){
            whoTouchedBall[1] = whoTouchedBall[0];
            whoTouchedBall[0] = whoTouchedLast; // last player who touched the ball
        }
    }
}
 
room.onTeamGoal = function(teamGoal){ // Write on chat who scored and when.
    console.log('entrei aqui');
    room.sendChat("Gooooooooooooooooooool!!!!");

    var time = room.getScores().time;
    var m = Math.trunc(time/60); var s = Math.trunc(time % 60);
    time = m + ":" + floor(s); // MM:SS format
    var ownGoal = isOwnGoal(teamGoal, whoTouchedBall[0]);
    var assist = "";
    if (ownGoal == "") assist = playerTouchedTwice(whoTouchedBall);
 
     if (ownGoal != "") {
         stats.get(whoTouchedBall[0].name)[4] += 1;
         room.sendChat(whoTouchedBall[0].name + " fez um gol contra!");
     } else {
        room.sendChat(whoTouchedBall[0].name+ " marca aos "+ time+"!");

        stats.get(whoTouchedBall[0].name)[0] += 1;
     }

     if(championship == true){
         console.log("teamgoal:"+teamGoal)
        if(teamGoal == 1){
            team.red.score +=1;
            teamGoalName = team.red.name;
        }else{
            team.blue.score +=1;
            teamGoalName = team.red.name;
        }

        room.sendChat(team.red.name + " "+ team.red.score + " x " + team.blue.score + " " + team.blue.name);


    }
 
    if (whoTouchedBall[1] != init && assist != "") stats.get(whoTouchedBall[1].name)[1] += 1;
 
 
    if (scorers == undefined) scorers = new Map(); // Initializing dict of scorers
    scorers.set(scorers.size + 1 +") " + whoTouchedLast.name, [time, assist, ownGoal])
    whoTouchedBall = [init, init];
    whoTouchedLast = undefined;
}
 
 var swap = false;
room.onTeamVictory = function(scores){ // Sum up all scorers since the beginning of the match.
    // if (scores.blue == 0 && gk[0].position != null && hasFinished == false) stats.get(gk[0].name)[5] += 1;
    // if (scores.red == 0 && gk[1].position != null  && hasFinished == false) stats.get(gk[1].name)[5] += 1;

    if (scores.red > scores.blue) {
        updateWinLoseStats(redTeam, blueTeam);
    }
    else{ updateWinLoseStats(blueTeam, redTeam); }
 
    if ( marcador == true ){
        room.sendChat("Gols realizados:")
        for (var [key, value] of scorers) { // key: name of the player, value: time of the goal
            room.sendChat(key + " " + value[1] + value[2] + ": " + value[0]);
        }  
    }  


    if(championship){
        overtimeEnd = true;
        teamPossFun();

        if(secondSet){
            console.log('ENTREI ENDSET')

            endSet = true;
        }else{
            console.log('ENTREI SECONDSET TRUE')

            secondSet = true;
            room.stopGame();
            room.sendChat("Fim do primeiro tempo!");

        }
    }
       
}
 
room.onGameStop = function(){

    if(championship){

        if(secondSet == true){
            swapSet();
            temp = team.red;
            team.red = team.blue;
            team.blue = temp;
        }

        if(endSet == true){
            if(team.blue.score>team.red.score){
                room.sendChat("Vitória do time "+team.blue.name+" de "+team.blue.score+" a "+team.red.score+"!")
                
            }else{
                room.sendChat("Vitória do time "+team.red.name+" de "+team.red.score+" a "+team.blue.score+"!")
            }
            resetSet();
        }
    }

    gkflag = false;
    scorers = undefined;
    whoTouchedBall = [init, init];
    whoTouchedLast = undefined;
    gk = [init, init];
    kickOff = false;
    hasFinished = false;
}
 
 
 
 
// Made by Grandes Ligas HaxBall
// Editado por ianzinho e bilbo