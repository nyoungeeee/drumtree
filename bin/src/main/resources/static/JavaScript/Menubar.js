function createMenubar() {
	var result = "";
	result += "<div class='logo'>" + "<img src='resources/Images/logo5.png' width='90%' onclick=location.href='" + "../" + "'>" + "</div>";
	result += "<div class='menuName' onclick=location.href='" + "../Notice" + "'>" + "<a>공지사항</a>" + "</div>";
	result += "<br>";
	result += "<div class='menuName' onclick=location.href='" + "../Calendar" + "'>" + "<a>달력</a>" + "</div>";
	result += "<br>";
	result += "<div class='menuName' onclick=location.href='" + "../Reservation" + "'>" + "<a>예약하기</a>" + "</div>";
	result += "<br>";
	result += "<div class='menuName' id='adminMenu'>" + "<a>관리자 기능</a>" + "</div>";
	result += "<div class='subMenuName' onclick=location.href='" + "../Admin_Notice" + "'>" + "<a>공지사항 관리</a>" + "</div>";
	result += "<div class='subMenuName' onclick=location.href='" + "../Admin_Approval" + "'>" + "<a>회원등록 승인</a>" + "</div>";
	result += "<div class='subMenuName' onclick=location.href='" + "../Admin_Account" + "'>" + "<a>회원 관리</a>" + "</div>";
	result += "<div class='subMenuName' onclick=location.href='" + "../Admin_Reservation" + "'>" + "<a>예약 승인</a>" + "</div>";
	result += "<div class='subMenuName' onclick=location.href='" + "../Admin_Payment" + "'>" + "<a>납부 관리</a>" + "</div>";
	result += "<div class='footer'>" + "경기 안양시 동안구 관양로 129" + "<br>" + "지하 1층 드럼트리" + "<br>" + "TEL.010-5362-7312" + "</div>";
	
	document.write(result);
	
	$(function(){
		$("#adminMenu").mouseover(function(){
			if ($(".subMenuName").css("visibility")!="visible") {
				$(".subMenuName").css("height", "0");
			}
		})
		
		$("#adminMenu").click(function(){
			$(".menuName").css("background-color", "");
			$(".menuName").children().css("color", "");
			$(this).css("background-color", "#424242");
			$(this).children().css("color", "#FFFFFF");
			$(".subMenuName").css("visibility", "visible");
			$(".subMenuName").css("height", "1.5em");
		})
	});
}

function hideMenubar() {
	$(".menuBar").css("left", "-10%");
	$(".logo").css("left", "-5%");
	$(".footer").css("left", "-5%");
	$(".headerBar").css("width", "94%");
	$(".headerBar").css("left", "2%");
	$(".mainScreen").css("width", "94%");
	$(".mainScreen").css("left", "2%");
	$(".hideButton").css("left", "0");
	$(".hideButton").attr("onclick", "displayMenubar()");
}

function displayMenubar() {
	$(".menuBar").css("left", "0");
	$(".logo").css("left", "5%");
	$(".footer").css("left", "5%");
	$(".headerBar").css("width", "84%");
	$(".headerBar").css("left", "12%");
	$(".mainScreen").css("width", "84%");
	$(".mainScreen").css("left", "12%");
	$(".hideButton").css("left", "10%");
	$(".hideButton").attr("onclick", "hideMenubar()");
}