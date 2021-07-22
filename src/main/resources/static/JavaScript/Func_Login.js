function createPopup() {
	$(document).ready(function(){
		var resultPopup = "";
		resultPopup += "<strong>회원 등록 요청</strong>";
		resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
		resultPopup += "<br><br><hr><br>";
		resultPopup += "<table id='memberInfo'>";
		resultPopup += "<tr>" + "<td>아이디</td>" + "<td>" + "<input type='text' id='memberID' spellcheck='false' autocomplete='off'>" + "&emsp;" + "</td></tr>";
		resultPopup += "<tr>" + "<td>비밀번호</td>" + "<td>" + "<input type='password' id='memberPW' spellcheck='false' autocomplete='off'>" + "</td></tr>";
		resultPopup += "<tr>" + "<td>비밀번호 확인</td>" + "<td>" + "<input type='password' id='memberPWcheck' spellcheck='false' autocomplete='off'>" + "&emsp;" + "</td></tr>";
		resultPopup += "<tr>" + "<td>닉네임</td>" + "<td>" + "<input type='text' id='memberName' spellcheck='false' autocomplete='off'>" + "</td></tr>";
		resultPopup += "<tr>" + "<td>회원 메모</td>" + "<td>" + "<textarea id='memoMember' spellcheck='false'></textarea>" + "</td></tr>";
		resultPopup += "</table><br><hr><br>";
		resultPopup += "<input type='button' class='resetBtn' value='초기화'>";
		resultPopup += "<input type='button' class='requestBtn' value='등록'>";
		$(".popupBox").html(resultPopup);
		
		$(".resetBtn").attr("onclick", "resetMember()");
		$(".requestBtn").attr("onclick", "requestMember()");
		
		$(".mainLogo").click(function(){
			var secretCode = "GAMZALAND";
			var insertCode = $("#userID").val().toUpperCase();
			
			if (insertCode == secretCode) {
				$(".mainLogo").css("transform", "rotate(360deg)");
				setTimeout(function(){
					$('.videoGameFrame').css('display', 'inline-block');
					$('.popupBackground').css('display', 'inline-block');
					$('html, body').css('overflow', 'hidden');
				}, 1250)
				
			}
		})
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
	resetMember();
}

function requestMember() {
	var id = $("#memberID").val();
	var pw = $("#memberPW").val();
	var pwCheck = $("#memberPWcheck").val();
	var name = $("#memberName").val();
	var memo = $("#memoMember").val().replaceAll("\n", "<br>");
	
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
	if (pw!=pwCheck) { $("#memberInfo tr").eq(2).children().eq(1).append("<a id='errorMessagePW' class='error'>!</a>"); checkFlag = false; }
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
	        		alert("이미 존재하는 아이디입니다.");
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
	
	$("#errorMessagePW").remove();
	$("#memberID").attr("placeholder", "");
	$("#memberPW").attr("placeholder", "");
	$("#memberPWcheck").attr("placeholder", "");
	$("#memberName").attr("placeholder", "");
	$("#memoMember").attr("placeholder", "");
}

function loginProcess() {
	var ID = $("#userID").val();
	var PW = $("#userPW").val();
	
	if (ID==""||PW=="") {
		alert("아이디 혹은 비밀번호를 입력해 주세요.");
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/members?reqCode=0",
	        data: { memberID: ID },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="MemberList_FAIL001") {
	        		alert("존재하지 않는 아이디 입니다.");
	        	}
	        	else if (data.rt=="MemberList_OK") {
	        		if (data[0].memberPW!=PW) {
						alert("비밀번호가 일치하지 않습니다.");
					}
	        		else if (data[0].isApproval==0) {
	        			alert("회원 요청이 승인되지 않았습니다.");
	        		}
	        		else {
	        			var original = ID + "&" + data[0].memberName + "&" + data[0].memberGrade + "&" + data[0].memberIdx;
					    var encrypt = CryptoJS.AES.encrypt(original, Decode);
					    
					    $.cookie("loginInfo", encrypt);
					    location.href = "../Notice";
	        		}
				}
	        }
		})
	}
}

function nonMemberLogin() {
	var original = "-" + "&" + "-" + "&" + 0;
    var encrypt = CryptoJS.AES.encrypt(original, Decode);
	
    $.cookie("loginInfo", encrypt);
    location.href = "../Notice";
}

function pressEnterKey() {
	$(document).ready(function(){
		$("#userPW").keypress(function(event) {
			if (event.keyCode==13) {
				event.preventDefault();
				$(".loginBtn").click();
			}
		})
	})
}