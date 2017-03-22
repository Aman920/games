var board = new Array();
var score = 0;
//单次合并控制
var hasConflicted= new Array();

//移动端触碰坐标
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){

	if(documentwidth > 500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}

	$('#game-container').css('width',gridContainerWidth);
	$('#game-container').css('height',gridContainerWidth);
	$('#grid-container').css('width',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',0.02*gridContainerWidth);

	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for( var i = 0;i < 4;i++){
		for( var j = 0; j <4;j++){
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top',getPos(i));
			gridCell.css('left',getPos(j));
		}
	}
	for( var i = 0;i < 4;i++){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for( var j = 0; j <4;j++){
			board[i][j] = 0;
			hasConflicted[i][j] = false;//没有合并
		}
	}

	//隐藏gameover
	$("#game-message").fadeOut("slow");
	//分数归0
	updateScore(0);
 	updateBoardView();
	score = 0;
}
//更新格盘显示
function updateBoardView(){
	$(".number-cell").remove();
	for( var i = 0;i < 4;i++){
		for( var j = 0; j <4;j++){
			$("#grid-container").append("<div class='number-cell' id='number-cell-"+i+'-'+j+"'></div>");
			var theNumberCell = $("#number-cell-"+i+"-"+j);

			if(board[i][j] == 0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPos(i)+cellSideLength/2);
				theNumberCell.css('left',getPos(j)+cellSideLength/2);
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPos(i));
				theNumberCell.css('left',getPos(j));
				//获取背景色的值
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				//获取文字前景色的值
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

			hasConflicted[i][j] = false;
		}
	}
	$('.number-cell').css('line-height',cellSideLength+'px');
	$('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber(){
	if(nospace(board))
		return false;

	//随机一个位置
	var randx = parseInt(Math.floor(Math.random()*4));
	var randy = parseInt(Math.floor(Math.random()*4));
	//随机算法优化
	var times = 0;
	while(times < 50){
		if(board[randx][randy] == 0)
			break;

		var randx = parseInt(Math.floor(Math.random()*4));
		var randy = parseInt(Math.floor(Math.random()*4));
		times++;
	}
	if(times==50){
		for(var i = 0;i < 4; i ++){
			for(var j = 0; j <4; j++){
				if(board[i][j] == 0){
					randx = i;
					randy = j;
				}
			}
		}
	}
	//随机一个数字
	var randNumber = Math.random() < 0.5?2:4;
	//在随机位置显示随机数
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	return true;
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
			event.preventDefault();
			if(moveLeft()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		case 38://up
			event.preventDefault();
			if(moveUp()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		case 39://right
			event.preventDefault();
			if(moveRight()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		case 40://down
			event.preventDefault();
			if(moveDown()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		default:break;
	}
});

document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

//解决android的bug
document.addEventListener('touchmove',function(event){
	event.preventDefault();
});

document.addEventListener('touchend',function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx-startx;
	var deltay = endy-starty;

	//单击操作过滤
	if(Math.abs(deltax) <0.1*documentwidth && Math.abs(deltay) < 0.1*documentwidth)
		return;

	//x
	if(Math.abs(deltax) >= Math.abs(deltay)){
		if(deltax>0){
			//move right
			if(moveRight()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
		}else{
			//move left
			if(moveLeft()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
		}
	}
	//y
	else{
		if(deltay>0){
			//move down
			if(moveDown()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
		}else{
			//move up
			if(moveUp()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
		}
	}
});

function isgameover(){
	if(nospace(board) && nomove(board)){
		gameover();
	}
}

function gameover(){
	$("#game-message").fadeIn(1000);
}

function moveLeft(){
	if(!canMoveLeft(board)){
		return false;
	}
	//move left
	for (var i = 0; i < 4; i++) {
		for(var j = 1; j <4; j++){
			if(board[i][j] != 0){

				for(var k = 0; k<j ; k++){
					if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoardView,200);
	return true;
}

function moveRight(){
	if(!canMoveRight(board)){
		return false;
	}
	//move right
	for (var i = 0; i < 4; i++) {
		for(var j = 2; j >=0; j--){
			if(board[i][j] != 0){

				for(var k = 3; k>j ; k--){
					if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoardView,200);
	return true;
}
function moveUp(){
	if(!canMoveUp(board)){
		return false;
	}
	//move up
	for (var i = 0; i < 4; i++) {//col
		for(var j = 1; j <4; j++){//row
			if(board[j][i] != 0){

				for(var k = 0; k<j ; k++){
					if(board[k][i] == 0 && noBlockVerticle(k,j,i,board)){
						//move
						showMoveAnimation(j,i,k,i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						continue;
					}else if(board[k][i] == board[j][i] && noBlockVerticle(k,j,i,board) && !hasConflicted[k][i]){
						//move
						showMoveAnimation(j,i,k,i);
						//add
						board[k][i] += board[j][i];
						board[j][i] = 0;
						//add score
						score += board[k][i];
						updateScore(score);

						hasConflicted[k][i] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoardView,200);
	return true;
}
function moveDown(){
	if(!canMoveDown(board)){
		return false;
	}
	//move up
	for (var i = 0; i < 4; i++) {//col
		for(var j = 2; j >= 0; j--){//row
			if(board[j][i] != 0){

				for(var k = 3; k>j ; k--){
					if(board[k][i] == 0 && noBlockVerticle(j,k,i,board)){
						//move
						showMoveAnimation(j,i,k,i);
						board[k][i] = board[j][i];
						board[j][i] = 0;
						continue;
					}else if(board[k][i] == board[j][i] && noBlockVerticle(j,k,i,board) && !hasConflicted[k][i]){
						//move
						showMoveAnimation(j,i,k,i);
						//add
						board[k][i] += board[j][i];
						board[j][i] = 0;
						//add score
						score += board[k][i];
						updateScore(score);

						hasConflicted[k][i] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoardView,200);
	return true;
}