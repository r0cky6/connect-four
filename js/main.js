$(()=>{

    // bunch of kind of useless things
    let randomRGB = () => Array(3).fill().map(_ => Math.round(Math.random()*255))

    let numEnding = (num) => {
        var numArr = num.toString().split('')
        if(num > 10) {
            switch(numArr.splice(-2)) {
                case '11': case '12': case '13': return 'th'
            }
        }
        switch($(numArr).get(-1)) {
            case '1':   return 'st'
            case '2':   return 'nd'
            case '3':   return 'rd'
            default:    return 'th'
        }
    }

    class boardCreate {
        constructor(w = 7, h = 6, playersNumber = 2, colors = ['rgb(49, 226, 226)', 'rgb(238, 46, 88)']) {
            this.gameBoard = Array(h).fill().map(_ => Array(w).fill(0)),
            this.playersNumber = playersNumber,
            this.colors = playersNumber > colors.length - 1 ? colors.concat(Array(playersNumber - colors.length).fill().map(_ => `rgb(${randomRGB()})`)) : colors,
            this.curPlayer = 1,
            this.gameStatus = 'ongoing'
        }
    }
    //game initialization
    // ??? -\
    $('#start-btn').click(e=>{
        e.preventDefault()
        $('#id').children().slice(1).remove()
        $('#curTurn').remove()
        form = $('#initForm').serializeArray().reduce((obj, item) => {
            obj[item.name] = parseInt(item.value)
            return obj
        }, {})
        var {w, h, p} = form
        cf_init(w, h ,p)
        $('#game-setup').css('display', 'none')
    })
    $('#restart-btn').click(e=>{
        e.preventDefault()
        $('#id').children().slice(1).remove()
        $('#curTurn').remove()
        $('#game-setup').css('display', 'unset')
        $('#game-restart').css('display', 'none')
    })
    // ???-/
    cf_init = (w,h,p) =>{
        game = new boardCreate(w,h,p)
        let {gameBoard, playersNumber, colors, curPlayer, gameStatus} = game
        //preparing the board
        $('#id').css({'width': `${gameBoard[0].length * 120}px`, 'height': `${(gameBoard.length + 1) * 120}px`})
        $('#connect-topRow').css('width', `${gameBoard[0].length * 120}px`)
        $('#connect-topRow').append(`<div class="connect-cell" id='curTurn' style='background-color: ${colors[0]}' />`)
        $('#curPlayer').text(`${curPlayer + numEnding(curPlayer)} Player's turn`)
        // checking if there is winning streak after each turn
        let checkBoard = () => {
            //creating an array of streaks of same color cells in 4 directions
            var checked = [
                checkCell([0, 1]) + checkCell([0, -1]),
                checkCell([1, 0]) + checkCell([-1, 0]),
                checkCell([1, 1]) + checkCell([-1, -1]),
                checkCell([1, -1]) + checkCell([-1, 1])
            ]
            return Math.max.apply(null, checked) + 1 >= 4
        }
        // chacking how many cells of a certain color there are in a certain direction
        let checkCell = (step, cell = [y, x]) =>{
            var nextCell = [cell[0]+step[0], cell[1]+step[1]]
            if( nextCell[0] < gameBoard.length && nextCell[1] < gameBoard[0].length && nextCell[0] >= 0 && nextCell[1] >= 0 &&
                gameBoard[nextCell[0]][nextCell[1]] == curPlayer) {
                return 1 + checkCell(step, nextCell)
            }else return 0
        }
        let x;
        window.addEventListener('mousemove', e =>{
            x = Math.floor((e.clientX - $('#id').position().left) / 120)
            x = x < 0 ? 0 : x >= gameBoard[0].length ? gameBoard[0].length - 1 : x
            gsap.to('#curTurn', {x: 120*x, duration: .05, ease: 'none'})
        })
    
        window.addEventListener('click', ()=>{
            if(gameStatus !== 'done') {
                for(y = gameBoard.length - 1; y >= 0 ; y--) {
                    if(gameBoard[y][x] == 0) {
                        $('#id').append(`<div class='connect-cell anim' style='background-color:${colors[curPlayer - 1]}; transform: translate(${120*x}px, 0px)' />`)
                        gsap.to(".anim", {y: 120*(y+1), duration: .1, ease: 'none', onStart: ()=> $('.anim').last().removeClass('anim')})
                        gameBoard[y][x] = curPlayer
                        if($('#id').children().length - 1 >= gameBoard[0].length * gameBoard.length) gameStatus = 'done'
                        if(checkBoard()) {
                            gameStatus = 'done'
                            $('#curTurn').remove()
                            $('#curPlayer').text(`${curPlayer + numEnding(curPlayer)} Player have won!`)
                            $('#game-restart').css('display', 'grid')
                            return 0
                        }
                        if(gameStatus !== 'done') {
                            curPlayer = curPlayer < playersNumber ? curPlayer + 1 : 1
                            $('#curPlayer').text(`${curPlayer + numEnding(curPlayer)} Player's turn`)
                            $('#curTurn').css('background-color', colors[curPlayer - 1])
                        }else{
                            $('#curTurn').remove()
                            $('#curPlayer').text(`It's a tie!`)
                            $('#game-restart').css('display', 'grid')
                        }
                        return 0
                    }
                }
            }
        })
    }
})