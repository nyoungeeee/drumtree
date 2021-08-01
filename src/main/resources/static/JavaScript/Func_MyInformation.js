function createTableHead() {
	$(document).ready(function(){
		var key = $.cookie("loginInfo");
		var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
		var idx = decrypt.split("&")[3];
		
		var result = "";
		result += "<tr>";
		result += "<td style='width:20%;'>" + "회원 정보" + "</td>";
		result += "<td style='width:20%;'>" + "예약 목록" + "</td>";
		result += "<td style='width:20%;'>" + "예약 승인 대기" + "</td>";
		result += "<td style='width:20%;'>" + "납부 정보" + "</td>";
		result += "<td style='width:20%;'>" + "기타" + "</td>";
		result += "</tr>";
		
		$("thead").html(result);
		$("thead tr td").eq(0).addClass("tabOn");
		
		$("thead tr td").click(function() {
			$("thead tr td").removeClass("tabOn");
			$(this).addClass("tabOn");
			
			var tabName = $(this).html();
			if (tabName=="회원 정보") {
				createMemberInfo(idx);
			}
			else if (tabName=="예약 목록") {
				var timezoneOffset = new Date().getTimezoneOffset() * 60000;
				var timezoneDate = new Date(Date.now() - timezoneOffset);
				createRsvCompleteInfo(idx, timezoneDate.toISOString().slice(0,7));
			}
			else if (tabName=="예약 승인 대기") {
				var timezoneOffset = new Date().getTimezoneOffset() * 60000;
				var timezoneDate = new Date(Date.now() - timezoneOffset);
				createRsvWaitingInfo(idx, timezoneDate.toISOString().slice(0,7));
			}
			else if (tabName=="납부 정보") {
				var timezoneOffset = new Date().getTimezoneOffset() * 60000;
				var timezoneDate = new Date(Date.now() - timezoneOffset);
				createPaymentInfo(idx, timezoneDate.toISOString().slice(0,7));
			}
			else {
				$("tbody tr td").html("추후 업데이트 예정");
			}
		});
	});
}

function createTableBody() {
	$(document).ready(function(){
		var key = $.cookie("loginInfo");
		var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
		var idx = decrypt.split("&")[3];
		
		var result = "";
		result += "<tr>";
		result += "<td colspan=" + $("thead tr td").length + ">" + "</td>";
		result += "</tr>";
		
		$("tbody").html(result);
		createMemberInfo(idx);
	});
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

function reset() {
	$("#popupInfo input[type=password]").val("");
	
	$("#errorMessageCurrentPW").remove();
	$("#errorMessageChangePW").remove();
	$("#errorMessageCheckPW").remove();
}

function createMemberInfo(idx) {
	$.ajax({
        url: "http://" + IPstring + "/members?isApproval=1",
        data: {
        	reqCode: 0,
        	memberIdx: idx,
        },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	if (data[0].memberGrade==0) { var gradeString = "비회원"; }
        	else if (data[0].memberGrade==1) { var gradeString = "손님"; }
        	else if (data[0].memberGrade==2) { var gradeString = "연습생"; }
        	else if (data[0].memberGrade==3) { var gradeString = "레슨생"; }
        	else if (data[0].memberGrade==99) { var gradeString = "관리자"; }
        	
        	var memberInfo = "";
        	memberInfo += "<table id='detailInfo'>";
        	memberInfo += "<tr>" + "<td>회원 번호</td>" + "<td>" + data[0].memberIdx + "</td>" + "</tr>";
        	memberInfo += "<tr>" + "<td>회원 등급</td>" + "<td>" + gradeString + "</td>" +  "</tr>";
        	memberInfo += "<tr>" + "<td>아이디</td>" + "<td>" + data[0].memberID + "</td>" + "</tr>";
        	memberInfo += "<tr>" + "<td>레슨</td>" + "<td>" + data[0].lessonCnt + "</td>" + "</tr>";
        	memberInfo += "<tr>" + "<td>연습</td>" + "<td>" + data[0].practiceCnt + "</td>" + "</tr>";
        	memberInfo += "<tr>" + "<td>닉네임</td>" + "<td>" + "<input type='text'>" + "<input type='button' value='수정' onclick=changeMemberName("+ data[0].memberIdx + "," + data[0].memberGrade + ")>" + "</td>" + "</tr>";
        	memberInfo += "<tr>" + "<td>메모</td>" + "<td>" + "<textarea></textarea>" + "<input type='button' value='수정' onclick=changeMemberMemo("+ data[0].memberIdx + "," + data[0].memberGrade + ")>" + "</td>" +  "</tr>";
        	memberInfo += "<tr>" + "<td>비밀번호</td>" + "<td>" + "<input type='button' id='changePassword' value='수정'>" + "</td>" +  "</tr>";
        	memberInfo += "</table>";
        	$("tbody tr td").html(memberInfo);
        	$("tbody tr td").fadeOut(0);
        	$("tbody tr td").fadeIn(500);
        	
        	$("#detailInfo input[type=text]").val(data[0].memberName);
        	$("#detailInfo textarea").val(data[0].memo.replaceAll("<br>", "\n"));
        	
        	$("#changePassword").click(function() {
        		var resultPopup = "";
    			resultPopup += "<strong>비밀번호 변경</strong>";
    			resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
    			resultPopup += "<hr><table id='popupInfo'>";
    			resultPopup += "<tr>" + "<td>현재 비밀번호</td>" + "<td>" + "<input type='password' placeholder='현재 비밀번호를 입력해 주세요.'>" + "&emsp;" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>변경할 비밀번호</td>" + "<td>" + "<input type='password' placeholder='변경할 비밀번호를 입력해 주세요.'>" + "&emsp;" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>비밀번호 재확인</td>" + "<td>" + "<input type='password' placeholder='비밀번호를 다시 입력해 주세요.'>" + "&emsp;" + "</td></tr>";
    			resultPopup += "</table><hr>";
    			resultPopup += "<input type='button' class='resetBtn' value='초기화'>";
    			resultPopup += "<input type='button' class='updateBtn' value='변경'>";
    			$(".popupBox").html(resultPopup);
    			$(".resetBtn").attr("onclick", "reset()");
    			openPopup();

    			$(".updateBtn").click(function() {
    				var currentPW = $("#popupInfo input[type=password]").eq(0).val();
    				var changePW = $("#popupInfo input[type=password]").eq(1).val();
    				var checkPW = $("#popupInfo input[type=password]").eq(2).val();
    				
    				$("#errorMessageCurrentPW").remove();
    				$("#errorMessageChangePW").remove();
    				$("#errorMessageCheckPW").remove();
    				
    				if (currentPW!=data[0].memberPW) {
    					$("#popupInfo tr").eq(0).children().eq(1).append("<a id='errorMessageCurrentPW' class='error'>!</a>");
    					$("#errorMessageCurrentPW").fadeOut(0);
    					$("#errorMessageCurrentPW").fadeIn(500);
    				}
    				else if (changePW==""||changePW==null) {
    					$("#popupInfo tr").eq(1).children().eq(1).append("<a id='errorMessageChangePW' class='error'>!</a>");
    					$("#errorMessageChangePW").fadeOut(0);
    					$("#errorMessageChangePW").fadeIn(500);
    				}
    				else if (changePW!=checkPW) {
    					$("#popupInfo tr").eq(2).children().eq(1).append("<a id='errorMessageCheckPW' class='error'>!</a>");
    					$("#errorMessageCheckPW").fadeOut(0);
    					$("#errorMessageCheckPW").fadeIn(500);
    				}
    				else {
    					$.ajax({
    				        url: "http://" + IPstring + "/update-member",
    				        data: {
    				        	memberIdx: idx,
    				        	memberPW: changePW,
    				        	memberGrade : data[0].memberGrade
    				        },
    				        method: "POST",
    				        dataType: "JSON",
    				        error: function() { alert("데이터 로드 실패"); },
    				        success: function(data) {
    				        	if (confirm("비밀번호를 변경하면 다시 로그인해야 합니다.\n정말 변경을 진행하시겠습니까?")==true) {
    				        		alert("비밀번호 변경이 정상적으로 완료되었습니다.");
    				        		logOut();
    				        	}
    				        }
    					});
    				}
    			});
        	});
        }
	});
}

function changeMemberName(idx, grade) {
	$.ajax({
        url: "http://" + IPstring + "/update-member",
        data: {
        	memberIdx: idx,
        	memberName: $("#detailInfo input[type=text]").val(),
        	memberGrade: grade
        },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	alert("닉네임 변경이 정상적으로 완료되었습니다.");
        	var key = $.cookie("loginInfo");
    		var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
        	var change = decrypt.split("&")[0] + "&" + $("#detailInfo input[type=text]").val() + "&" + decrypt.split("&")[2] + "&" + decrypt.split("&")[3];
		    var encrypt = CryptoJS.AES.encrypt(change, Decode);
		    $.cookie("loginInfo", encrypt);
        	window.location.reload();
        }
	});
}

function changeMemberMemo(idx, grade) {
	$.ajax({
        url: "http://" + IPstring + "/update-member",
        data: {
        	memberIdx: idx,
        	memo: $("#detailInfo textarea").val().replaceAll("\n", "<br>"),
        	memberGrade: grade
        },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	alert("회원 메모 변경이 정상적으로 완료되었습니다.");
        	window.location.reload();
        }
	});
}

function createRsvCompleteInfo(idx, month) {
	var roomName = [ "레슨", "연습실 3번", "연습실 4번", "연습실 5번" ];
	
	$.ajax({
        url: "http://" + IPstring + "/list-rsv?isApproval=1",
        data: {
        	start: month,
        	memberIdx: idx
        },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	var today = new Date();
			today.setHours(9, 0, 0, 0);
        	var reservationInfo = "";
        	reservationInfo += "<input type='button' id='leftArrow' value='◀' onclick='clickArrow(0" + "," + idx + "," + "-1)'>";
        	reservationInfo += "<input type='month' id='month' onchange='changeMonth(0" + "," + idx + ")'>";
        	reservationInfo += "<input type='button' id='rightArrow' value='▶' onclick='clickArrow(0" + "," + idx + "," + "1)'>";
        	
        	reservationInfo += "<table id='detailRsv'>";
        	reservationInfo += "<thead><tr>";
        	reservationInfo += "<td style='width:10%'>" + "요청 상태" + "</td>";
        	reservationInfo += "<td style='width:10%'>" + "신청 일자" + "</td>";
        	reservationInfo += "<td style='width:10%'>" + "예약 장소" + "</td>";
        	reservationInfo += "<td style='width:10%'>" + "예약 날짜" + "</td>";
        	reservationInfo += "<td style='width:10%'>" + "예약 시간" + "</td>";
        	reservationInfo += "<td style='width:30%'>" + "예약 메모" + "</td>";
        	reservationInfo += "<td style='width:20%'>" + "첨부파일" + "</td>";
        	reservationInfo += "</tr></thead>";
        	reservationInfo += "<tbody>";
        	
        	if (data.total==0) {
        		reservationInfo += "<tr><td colspan=7>" + month.split("-")[0] + "년 " + month.split("-")[1] + "월 예약 목록이 없습니다." + "</td></tr>";
        	}
        	else {
        		for (var i = 0; i < data.total; i++) {
            		reservationInfo += "<tr>";
            		reservationInfo += "<td>" + "승인 완료" + "</td>";
            		
            		var regDay = new Date(data[i].regDate.split(" ")[0]);
        			if (today.getTime()==regDay.getTime()) { reservationInfo += "<td>" + data[i].regDate.split(" ")[1].substring(0,5) + "</td>"; }
        			else { reservationInfo += "<td>" + data[i].regDate.split(" ")[0] + "</td>"; }
        			
            		reservationInfo += "<td>" + roomName[data[i].roomType] + "</td>";
            		reservationInfo += "<td>" + data[i].start.split(" ")[0] + "</td>";
            		reservationInfo += "<td>" + data[i].start.split(" ")[1].substring(0,5) + " ~ " + data[i].end.split(" ")[1].substring(0,5) + "</td>";
            		reservationInfo += "<td>" + data[i].memo.replaceAll("\n", "<br>") + "</td>";
            		
            		var startString = "<strong>첨부 파일 목록</strong><br><hr>";
            		var startToFile = data[i].memo.indexOf(startString) + startString.length;
        			var endToFile = data[i].memo.indexOf("</div>");
        			var toFileString = data[i].memo.substring(startToFile, endToFile);
            		reservationInfo += "<td style='text-align:left;'>" + toFileString.replaceAll("<span>", "").replaceAll("</span>", "<br>") + "</td>";
            		reservationInfo += "</tr>";
            	}
        	}
        	reservationInfo += "</tbody>";
        	reservationInfo += "</table>";
        	
        	$("tbody tr td").html(reservationInfo);
        	$("#detailRsv tbody tr td").fadeOut(0);
        	$("#detailRsv tbody tr td").fadeIn(500);
        	$("#detailRsv tbody tr td").find("#fileList").css("display", "none");
        	$("#month").val(month);
        }
	});
}

function createRsvWaitingInfo(idx, month) {
	var roomName = [ "레슨", "연습실 3번", "연습실 4번", "연습실 5번" ];
	
	$.ajax({
        url: "http://" + IPstring + "/list-rsv",
        data: {
        	start: month,
        	memberIdx: idx
        },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	var today = new Date();
			today.setHours(9, 0, 0, 0);
        	var reservationInfo = "";
        	reservationInfo += "<input type='button' id='leftArrow' value='◀' onclick='clickArrow(1" + "," + idx + "," + "-1)'>";
        	reservationInfo += "<input type='month' id='month' onchange='changeMonth(1" + "," + idx + ")'>";
        	reservationInfo += "<input type='button' id='rightArrow' value='▶' onclick='clickArrow(1" + "," + idx + "," + "1)'>";
        	
        	reservationInfo += "<table id='detailRsv'>";
        	reservationInfo += "<thead><tr>";
        	reservationInfo += "<td style='width:10%'>" + "요청 상태" + "</td>";
        	reservationInfo += "<td style='width:10%'>" + "신청 일자" + "</td>";
        	reservationInfo += "<td style='width:10%'>" + "예약 장소" + "</td>";
        	reservationInfo += "<td style='width:10%'>" + "예약 날짜" + "</td>";
        	reservationInfo += "<td style='width:10%'>" + "예약 시간" + "</td>";
        	reservationInfo += "<td style='width:30%'>" + "예약 메모" + "</td>";
        	reservationInfo += "<td style='width:20%'>" + "첨부파일" + "</td>";
        	reservationInfo += "</tr></thead>";
        	reservationInfo += "<tbody>";
    		for (var i = 0; i < data.total; i++) {
        		if (data[i].isApproval==0||data[i].isApproval==4) {
	        		reservationInfo += "<tr>";
	        		
	        		if (data[i].isApproval==0) {
    					var rsvStatus = "신규 예약";
    					reservationInfo += "<td>" + rsvStatus + "</td>";
    					
    					var regDay = new Date(data[i].regDate.split(" ")[0]);
    					if (today.getTime()==regDay.getTime()) { reservationInfo += "<td name='" + data[i].regDate.substring(0,16) + "'>" + data[i].regDate.split(" ")[1].substring(0,5) + "</td>"; }
            			else { reservationInfo += "<td name='" + data[i].regDate.substring(0,16) + "'>" + data[i].regDate.split(" ")[0] + "</td>"; }
    				}
    				else if (data[i].isApproval==4) {
    					var rsvStatus = "변경 신청";
    					reservationInfo += "<td>" + rsvStatus + "</td>";
    					
    					var regDay = new Date(data[i].updateDate.split(" ")[0]);
    					if (today.getTime()==regDay.getTime()) { reservationInfo += "<td name='" + data[i].updateDate.substring(0,16) + "'>" + data[i].updateDate.split(" ")[1].substring(0,5) + "</td>"; }
            			else { reservationInfo += "<td name='" + data[i].updateDate.substring(0,16) + "'>" + data[i].updateDate.split(" ")[0] + "</td>"; }
    				}
	    			
	        		reservationInfo += "<td>" + roomName[data[i].roomType] + "</td>";
	        		reservationInfo += "<td>" + data[i].start.split(" ")[0] + "</td>";
	        		reservationInfo += "<td>" + data[i].start.split(" ")[1].substring(0,5) + " ~ " + data[i].end.split(" ")[1].substring(0,5) + "</td>";
	        		reservationInfo += "<td name='memberMemo'>" + data[i].memo.replaceAll("\n", "<br>") + "</td>";
	        		
	        		var startString = "<strong>첨부 파일 목록</strong><br><hr>";
	        		var startToFile = data[i].memo.indexOf(startString) + startString.length;
	    			var endToFile = data[i].memo.indexOf("</div>");
	    			var toFileString = data[i].memo.substring(startToFile, endToFile);
	        		reservationInfo += "<td style='text-align:left;'>" + toFileString.replaceAll("<span>", "").replaceAll("</span>", "<br>") + "</td>";
	        		reservationInfo += "</tr>";
        		}
        		else {
        			reservationInfo += "";
        		}
        	}
        	reservationInfo += "</tbody>";
        	reservationInfo += "</table>";
        	
        	$("tbody tr td").html(reservationInfo);
        	$("#detailRsv tbody tr td").fadeOut(0);
        	$("#detailRsv tbody tr td").fadeIn(500);
        	$("#detailRsv tbody tr td").find("#fileList").css("display", "none");
        	$("#month").val(month);
        	
        	if ($("#detailRsv tbody tr").length==0) {
        		var reservationInfo = "<tr><td colspan=7>" + month.split("-")[0] + "년 " + month.split("-")[1] + "월 승인 대기 중인 예약이 없습니다." + "</td></tr>";
        		$("#detailRsv tbody").append(reservationInfo);
        		$("#detailRsv tbody tr td").fadeOut(0);
            	$("#detailRsv tbody tr td").fadeIn(500);
        	}
        }
	});
}

function clickArrow(type, idx, addValue) {
	var currentYear = Number($("#month").val().slice(0,4));
	var currentMonth = Number($("#month").val().slice(5,7))-1;
	var currentDate = new Date(currentYear, currentMonth+addValue, 1, 9, 0, 0);

	if (type==0) {
		createRsvCompleteInfo(idx, currentDate.toISOString().slice(0,7));
	}
	else if (type==1) {
		createRsvWaitingInfo(idx, currentDate.toISOString().slice(0,7));
	}
	else if (type==2) {
		createPaymentInfo(idx, currentDate.toISOString().slice(0,7));
	}
}

function changeMonth(type, idx) {
	var currentYear = Number($("#month").val().slice(0,4));
	var currentMonth = Number($("#month").val().slice(5,7))-1;
	var currentDate = new Date(currentYear, currentMonth, 1, 9, 0, 0);

	if (type==0) {
		createRsvCompleteInfo(idx, currentDate.toISOString().slice(0,7));
	}
	else if (type==1) {
		createRsvWaitingInfo(idx, currentDate.toISOString().slice(0,7));
	}
	else if (type==2) {
		createPaymentInfo(idx, currentDate.toISOString().slice(0,7));
	}
}

function createPaymentInfo(idx, month) {
	$.ajax({
        url: "http://" + IPstring + "/payments",
        data: {
        	payDate: month,
        	memberIdx: idx
        },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	var paymentInfo = "";
        	paymentInfo += "<input type='button' id='leftArrow' value='◀' onclick='clickArrow(2" + "," + idx + "," + "-1)'>";
        	paymentInfo += "<input type='month' id='month' onchange='changeMonth(2" + "," + idx + ")'>";
        	paymentInfo += "<input type='button' id='rightArrow' value='▶' onclick='clickArrow(2" + "," + idx + "," + "1)'>";
        	
        	paymentInfo += "<table id='detailRsv'>";
        	paymentInfo += "<thead><tr>";
        	paymentInfo += "<td style='width:10%'>" + "납부 번호" + "</td>";
        	paymentInfo += "<td style='width:10%'>" + "납부 일자" + "</td>";
        	paymentInfo += "<td style='width:10%'>" + "닉네임" + "</td>";
        	paymentInfo += "<td style='width:10%'>" + "수강료" + "</td>";
        	paymentInfo += "<td style='width:15%'>" + "레슨" + "</td>";
        	paymentInfo += "<td style='width:15%'>" + "연습" + "</td>";
        	paymentInfo += "<td style='width:30%'>" + "메모" + "</td>";
        	paymentInfo += "</tr></thead>";
        	paymentInfo += "<tbody>";
        	
        	if (data.total==0) {
        		paymentInfo += "<tr><td colspan=7>" + month.split("-")[0] + "년 " + month.split("-")[1] + "월 납부 정보가 없습니다." + "</td></tr>";
        	}
        	else {
        		for (var i = 0; i < data.total; i++) {
        			paymentInfo += "<tr>";
        			paymentInfo += "<td>" + data[i].payIdx + "</td>";
        			paymentInfo += "<td>" + data[i].payDate + "</td>";
        			paymentInfo += "<td>" + data[i].memberName + "</td>";
        			paymentInfo += "<td>" + "￦ " + data[i].fees.toLocaleString() + "</td>";
        			
        			if (data[i].lessonCnt >= 0) {
        				var lessonCount = "+" + data[i].lessonCnt;
        			}
        			else {
        				var lessonCount = data[i].lessonCnt;
        			}
        			paymentInfo += "<td name='" + data[i].lessonCnt + "'>" + lessonCount + "</td>";
        			
        			if (data[i].practiceCnt >= 0) {
        				var practiceCount = "+" + data[i].practiceCnt;
        			}
        			else {
        				var practiceCount = data[i].practiceCnt;
        			}
        			paymentInfo += "<td name='" + data[i].practiceCnt + "'>" + practiceCount + "</td>";
        			
        			paymentInfo += "<td>" + data[i].memo.replaceAll("\n", "<br>") + "</td>";
        			paymentInfo += "</tr>";
            	}
        	}
    		paymentInfo += "</tbody>";
    		paymentInfo += "</table>";
        	
        	$("tbody tr td").html(paymentInfo);
        	$("#detailRsv tbody tr td").fadeOut(0);
        	$("#detailRsv tbody tr td").fadeIn(500);
        	$("#month").val(month);
        }
	});
}