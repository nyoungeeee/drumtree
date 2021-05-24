function createPopup() {
	$(document).ready(function(){
		var resultPopup = "";
		resultPopup += "<strong>회원 등록 요청</strong>";
		resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
		resultPopup += "<br><br><hr><br>";
		resultPopup += "<table id='memberInfo'>";
		resultPopup += "<tr>" + "<td>아이디</td>" + "<td>" + "<input type='text' id='memberID' spellcheck='false' autocomplete='off'>" + "</td></tr>";
		resultPopup += "<tr>" + "<td>비밀번호</td>" + "<td>" + "<input type='text' id='memberPW' spellcheck='false' autocomplete='off'>" + "</td></tr>";
		resultPopup += "<tr>" + "<td>비밀번호 확인</td>" + "<td>" + "<input type='text' id='memberPWcheck' spellcheck='false' autocomplete='off'>" + "</td></tr>";
		resultPopup += "<tr>" + "<td>닉네임</td>" + "<td>" + "<input type='text' id='memberName' spellcheck='false' autocomplete='off'>" + "</td></tr>";
		resultPopup += "<tr>" + "<td>회원 메모</td>" + "<td>" + "<textarea id='memoMember' spellcheck='false'></textarea>" + "</td></tr>";
		resultPopup += "</table><br><hr><br>";
		resultPopup += "<input type='button' class='resetBtn' value='초기화'>";
		resultPopup += "<input type='button' class='requestBtn' value='등록'>";
		$(".popupBox").html(resultPopup);
		
		$(".resetBtn").attr("onclick", "resetMember()");
		$(".requestBtn").attr("onclick", "requestMember()");
	})
}

function openPopup() {
	$('.popupBox').css('display', 'inline-block');
	$('.popupBackground').css('display', 'inline-block');
	$('html, body').css('overflow', 'hidden');
}

function closePopup() {
	$('.popupBox').css('display', 'none');
	$('.popupBackground').css('display', 'none');
	$('html, body').css('overflow', '');
}

function requestMember() {
	var id = $("#memberID").val();
	var pw = $("#memberPW").val();
	var pwCheck = $("#memberPWcheck").val();
	var name = $("#memberName").val();
	var memo = $("#memoMember").val().replaceAll("\n", "<br>");
	
	$("#errorMessageID").remove();
	$("#errorMessagePW").remove();
	$("#memberID").attr("placeholder", "");
	$("#memberPW").attr("placeholder", "");
	$("#memberPWcheck").attr("placeholder", "");
	$("#memberName").attr("placeholder", "");
	$("#memoMember").attr("placeholder", "");
	
	var checkFlag = true;
	if (id=="") { $("#memberID").attr("placeholder", "아이디를 입력해 주세요."); checkFlag = false; }
	if (pw=="") { $("#memberPW").attr("placeholder", "비밀번호를 입력해 주세요."); checkFlag = false; }
	if (pwCheck=="") { $("#memberPWcheck").attr("placeholder", "비밀번호를 다시 입력해 주세요."); checkFlag = false; }
	if (name=="") { $("#memberName").attr("placeholder", "닉네임을 입력해 주세요."); checkFlag = false; }
	if (memo=="") { $("#memoMember").attr("placeholder", "메모를 입력해 주세요."); checkFlag = false; }
	if (pw!=pwCheck) { $("#memberInfo tr").eq(2).children().eq(1).append("<a id='errorMessagePW' style='color:red;'>&emsp;<strong>비밀번호 불일치</strong></a>"); checkFlag = false; }
	$("#errorMessagePW").fadeOut(0);
	$("#errorMessagePW").fadeIn(500);
	
	if (checkFlag==true) {
		$.ajax({
	        url: "http://" + IPstring + "/signin",
	        data: { memberID: id, memberPW: pw, memberName: name, memo: memo },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="SignIn_FAIL001") {
	        		$("#memberInfo tr").eq(0).children().eq(1).append("<a id='errorMessageID' style='color:red;'>&emsp;<strong>아이디 중복</strong></a>");
	        		$("#errorMessageID").fadeOut(0);
	        		$("#errorMessageID").fadeIn(500);
	        	}
	        	else if (data.rt=="SignIn_FAIL002") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="SignIn_OK") {
		        	alert("회원 등록이 정상적으로 완료되었습니다.");
		        	window.location.reload();
	        	}
	        }
		})
	}
}

function resetMember() {
	$("#memberID").val("");
	$("#memberPW").val("");
	$("#memberPWcheck").val("");
	$("#memberName").val("");
	$("#memoMember").val("");
	
	$("#errorMessageID").remove();
	$("#errorMessagePW").remove();
	$("#memberID").attr("placeholder", "");
	$("#memberPW").attr("placeholder", "");
	$("#memberPWcheck").attr("placeholder", "");
	$("#memberName").attr("placeholder", "");
	$("#memoMember").attr("placeholder", "");
}