function createMenubar() {
	var result = "";
	result += "<div class='menuName' onclick=location.href='" + "../Notice" + "'>" + "<a>공지사항</a>" + "</div>";
	result += "<br>";
	result += "<div class='menuName' onclick=location.href='" + "../Calendar" + "'>" + "<a>달력</a>" + "</div>";
	result += "<br>";
	result += "<div class='menuName' onclick=location.href='" + "../Reservation" + "'>" + "<a>예약하기</a>" + "</div>";
	result += "<br>";
	result += "<div class='menuName' id='adminMenu'>" + "<a>관리자 기능</a>" + "</div>";
	result += "<div class='subMenuName' onclick=location.href='" + "../Admin_Notice" + "'>" + "<a>공지사항 작성</a>" + "</div>";
	result += "<div class='subMenuName' onclick=location.href='" + "../Admin_Approval" + "'>" + "<a>회원등록 승인</a>" + "</div>";
	result += "<div class='subMenuName' onclick=location.href='" + "../Admin_Account" + "'>" + "<a>회원 관리</a>" + "</div>";
	
	document.write(result);
	
	$(function(){
		$(".menuName").click(function(){
			$(".menuName").css("background-color", "#481B07");
			$(".menuName").children().css("color", "#CFBEB7");
			$(this).css("background-color", "#CFBEB7");
			$(this).children().css("color", "#481B07");
		})
		
		$("#adminMenu").click(function(){
			$(".subMenuName").css("display", "block");
			$(".subMenuName").fadeOut(0);
			$(".subMenuName").fadeIn(250);
		})
	});
}

function hideMenubar() {
	$(".menuBar").css("display", "none");
	$(".headerBar").css("width", "94%");
	$(".headerBar").css("left", "2%");
	$(".mainScreen").css("width", "94%");
	$(".mainScreen").css("left", "2%");
	$(".hideButton").css("left", "0");
	$(".hideButton").attr("onclick", "displayMenubar()");
	$(".menuBar").fadeIn(0);
	$(".menuBar").fadeOut(250);
}

function displayMenubar() {
	$(".menuBar").css("display", "");
	$(".headerBar").css("width", "84%");
	$(".headerBar").css("left", "12%");
	$(".mainScreen").css("width", "84%");
	$(".mainScreen").css("left", "12%");
	$(".hideButton").css("left", "10%");
	$(".hideButton").attr("onclick", "hideMenubar()");
	$(".menuBar").fadeOut(0);
	$(".menuBar").fadeIn(250);
}