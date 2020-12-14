module.exports = function(playerAction){
    if (['man', 'tiger', 'gun'].indexOf(playerAction) == -1) {
        throw new Error('invalid playerAction');
    }

    let computerAction;
    let random = Math.random() * 3;
    if(random < 1){
        computerAction = 'man'
    }else if(random > 2){
        computerAction = 'tiger'
    }else{
        computerAction = 'gun'
    }

    
    if(computerAction == playerAction){
        return 0;
    }else if(
        computerAction == 'gun' && playerAction == 'tiger'||
        computerAction == 'tiger' && playerAction == 'man'||
        computerAction == 'man' && playerAction == 'gun'
    ) {
        return -1;
    }else{
        return 1;
    }
}