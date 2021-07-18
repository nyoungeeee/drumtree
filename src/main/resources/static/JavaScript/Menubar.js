function createMenubar() {
	var key = document.location.href.split("?")[1];
	var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
	
	var result = "";
	result += "<img class='menuLogo' src='resources/Images/logo5.png' width='100%' onclick=movePage('Notice')><br>";
	
	result += "<div class='loginInfo'>"
	result += "<a style='float:left'>· 아이디</a>" + "<a id='loginID' style='float:right'>" + decrypt.split("&")[0] + "</a><br>";
	result += "<a style='float:left'>· 닉네임</a>" + "<a id='loginName'style='float:right'>" + decrypt.split("&")[1] + "</a><br>";
	if (decrypt.split("&")[2]==99) { var grade = "관리자" }
	else if (decrypt.split("&")[2]==0) { var grade = "비회원" }
	else if (decrypt.split("&")[2]==1) { var grade = "손님" }
	else if (decrypt.split("&")[2]==2) { var grade = "연습생" }
	else if (decrypt.split("&")[2]==3) { var grade = "레슨생" }
	else { var grade = "???" }
	result += "<a style='float:left'>· 등급</a>" + "<a id='loginGrade' style='float:right'>" + grade + "</a><br>";
	if (decrypt.split("&")[2]==0) { result += "<div id='logout' onclick=location.href='" + "../" + "'>" + "LOGIN" + "</div>"; }
	else { result += "<div id='logout' onclick=location.href='" + "../" + "'>" + "LOGOUT" + "</div>"; }
	result += "</div><br>";
	
	result += "<div class='menuName' onclick=movePage('Notice')>" + "<a>공지사항</a>" + "</div><br>";
	result += "<div class='menuName' onclick=movePage('Calendar')>" + "<a>달력</a>" + "</div><br>";
	result += "<div class='menuName' onclick=movePage('Reservation')>" + "<a>예약하기</a>" + "</div><br>";
	
	result += "<div class='menuName' id='adminMenu'>" + "<a>관리자 기능</a>" + "</div>";
	result += "<div class='subMenuName' onclick=movePage('Admin_Notice')>" + "<a>공지사항 관리</a>" + "</div>";
	result += "<div class='subMenuName' onclick=movePage('Admin_Approval')>" + "<a>회원등록 승인</a>" + "</div>";
	result += "<div class='subMenuName' onclick=movePage('Admin_Account')>" + "<a>회원 관리</a>" + "</div>";
	result += "<div class='subMenuName' onclick=movePage('Admin_Reservation')>" + "<a>예약 승인</a>" + "</div>";
	result += "<div class='subMenuName' onclick=movePage('Admin_Payment')>" + "<a>납부 관리</a>" + "</div>";
	
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

function movePage(param0) {
	var page = "../" + param0;
	var key = document.location.href.split("?")[1];
	
	location.href = page + "?" + key;
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