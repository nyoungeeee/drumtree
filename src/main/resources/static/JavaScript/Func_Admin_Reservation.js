function processAjax(param0, param1) {
	var roomName = [ "레슨", "연습실 3번", "연습실 4번", "연습실 5번" ];
	
	$.ajax({
        url: "http://" + IPstring + "/list-rsv?isApproval=0",
        data: { memberName: param0, memo: param1 },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
    		var result = "";
    		for (var i = 0; i < data.total; i++) {
    			result += "<tr onclick='openPopup()'>";
    			result += "<td style='font-size:0.7em;'>" + data[i].regDate.replaceAll(" ", "<br>") + "</td>";
    			result += "<td>" + data[i].memberName + "</td>";
    			result += "<td>" + roomName[data[i].roomType] + "</td>";
    			result += "<td style='font-size:0.7em;'>" + data[i].start.split(" ")[0] + "<br>" + data[i].start.split(" ")[1].substring(0,5) + " ~ " + data[i].end.split(" ")[1].substring(0,5) + "</td>";
    			result += "<td>" + data[i].memo + "</td>";
    			result += "<td style='display:none;'>" + data[i].memberIdx + "</td>";
    			result += "</tr>";
    		}
    		$("tbody").html(result);
    		$("tbody tr").fadeOut(0);
    		$("tbody tr").fadeIn(500);
    		
    		$("tbody tr").click(function(){
    			var resultPopup = "";
        		resultPopup += "<strong>예약 정보</strong>";
        		resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
        		resultPopup += "<br><br><hr><br>";
        		resultPopup += "<table id='reservationInfo'>";
        		resultPopup += "<tr>" + "<td>신청 일자</td>" + "<td>" + $(this).children().eq(0).html().replaceAll("<br>", " ") + "</td></tr>";
        		resultPopup += "<tr>" + "<td>신청 회원</td>" + "<td>" + $(this).children().eq(1).html() + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 구분</td>" + "<td>" + "<select id='selectType'></select>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 장소</td>" + "<td>" + "<select id='selectRoom'></select>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 날짜</td>" + "<td>" + "<input type='date' id='selectDate'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 시간</td>" + "<td>" + "<select id='selectStartTime'></select>" + "&emsp;" + "<select id='selectEndTime'></select>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>메모</td>" + "<td>" + "<textarea id='reservationMemo' spellcheck='false'></textarea>" + "</td></tr>";
        		resultPopup += "</table><br><hr><br>";
        		resultPopup += "<input type='button' class='rejectBtn' value='반려'>";
    			resultPopup += "<input type='button' class='approvalBtn' value='승인'>";
        		$(".popupBox").html(resultPopup);
        		
    			$(".approvalBtn").attr("onclick", "approvalMember(" + $(this).children().eq(5).html() + ")");
    			$(".rejectBtn").attr("onclick", "rejectMember(" + $(this).children().eq(5).html() + ")");
        		
        		$("#selectDate").val($(this).children().eq(3).html().split("<br>")[0]);
        		$("#reservationMemo").val($(this).children().eq(4).html().replaceAll("<br>", "\n"));
        		
        		var resultStartTime = "";
        		var resultEndTime = "";
        		for (var k = 0; k < 30; k++) {
        			if (parseInt(k/2)+8 > 9) { var startHour = parseInt(k/2)+8; }
        			else { var startHour = "0" + (parseInt(k/2)+8); }
        			if ((k%2)*30 > 0) { var startMin = (k%2)*30; }
        			else { var startMin = "0" + (k%2)*30; }
        			
        			resultStartTime += "<option value='" + startHour + ":" + startMin + "'>"
        			resultStartTime += startHour + ":" + startMin;
        			resultStartTime += "</option>";
        			
        			if (parseInt((k+1)/2)+8 > 9) { var endHour = parseInt((k+1)/2)+8; }
        			else { var endHour = "0" + (parseInt((k+1)/2)+8); }
        			if (((k+1)%2)*30 > 0) { var endMin = ((k+1)%2)*30; }
        			else { var endMin = "0" + ((k+1)%2)*30; }
        			
        			resultEndTime += "<option value='" + endHour + ":" + endMin + "'>"
        			resultEndTime += endHour + ":" + endMin;
        			resultEndTime += "</option>";
        		}
        		$("#selectStartTime").append(resultStartTime);
        		$("#selectEndTime").append(resultEndTime);
        		$("#selectStartTime").val($(this).children().eq(3).html().split("<br>")[1].split(" ~ ")[0]).prop("selected", true);
        		$("#selectEndTime").val($(this).children().eq(3).html().split("<br>")[1].split(" ~ ")[1]).prop("selected", true);
        		
        		var resultType = "";
        		resultType += "<option value=0>" + "레슨" + "</option>";
        		resultType += "<option value=1>" + "연습" + "</option>";
        		$("#selectType").append(resultType);
        		if (roomName.indexOf($(this).children().eq(2).html())>1) { var thisType = 1; }
        		else { var thisType = roomName.indexOf($(this).children().eq(2).html()); }
        		$("#selectType").val(thisType).prop("selected", true);
        		
        		var resultRoom = "";
        		if ($("#selectType").val()==0) {
        			resultRoom += "<option value='none'>" + "" + "</option>";
        			resultRoom += "<option value=0>" + "레슨실" + "</option>";
        		}
        		else {
        			resultRoom += "<option value='none'>" + "" + "</option>";
        			resultRoom += "<option value=1>" + "연습실 3번" + "</option>";
        			resultRoom += "<option value=2>" + "연습실 4번" + "</option>";
        			resultRoom += "<option value=3>" + "연습실 5번" + "</option>";
        		}
        		$("#selectRoom").append(resultRoom);
        		$("#selectRoom").val(roomName.indexOf($(this).children().eq(2).html())).prop("selected", true);
        		
        		$("#selectType").change(function(){
        			$("#selectRoom option").remove();
        			var resultRoom = "";
        			if ($("#selectType").val()==0) {
        				resultRoom += "<option value='none'>" + "" + "</option>";
        				resultRoom += "<option value=0>" + "레슨실" + "</option>";
        			}
        			else {
        				resultRoom += "<option value='none'>" + "" + "</option>";
        				resultRoom += "<option value=1>" + "연습실 3번" + "</option>";
        				resultRoom += "<option value=2>" + "연습실 4번" + "</option>";
        				resultRoom += "<option value=3>" + "연습실 5번" + "</option>";
        			}
        			$("#selectRoom").append(resultRoom);
        		})
    		})
        }
    })
}

function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:15%;'>" + "신청 시간" + "</td>";
		result += "<td style='width:15%;'>" + "닉네임" + "</td>";
		result += "<td style='width:15%;'>" + "예약 장소" + "</td>";
		result += "<td style='width:15%;'>" + "예약 시간" + "</td>";
		result += "<td style='width:40%;'>" + "예약 메모" + "</td>";
		result += "</tr>";
		
		$("thead").html(result);
	});
}

function createTableBody() {
	$(document).ready(function(){
		var filterName = "";
		var filterMemo = "";
		processAjax(filterName, filterMemo);
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

function approvalMember(idx) {
	var grade = $("#memberGrade").val();
	var memo = $("#memoAdmin").val().replaceAll("\n", "<br>");
	
	$("#errorMessageGrade").remove();
	
	if (grade=="none") {
		$("#memberInfo tr").eq(5).children().eq(1).append("<a id='errorMessageGrade' style='color:red;'>&emsp;<strong>회원 등급 선택 필수</strong></a>");
		$("#errorMessageGrade").fadeOut(0);
		$("#errorMessageGrade").fadeIn(500);
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/approval-member",
	        data: { memberIdx: idx, memberGrade: grade, memoAdmin: memo },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="ApprovalMember_FAIL001") {
	        		alert("존재하지 않는 회원 번호입니다.");
	        	}
	        	else if (data.rt=="ApprovalMember_FAIL002") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="ApprovalMember_OK") {
	            	alert("승인이 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
		})
	}
}

function rejectMember(idx) {
    $.ajax({
        url: "http://" + IPstring + "/delete-member",
        data: { memberIdx: idx },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	if (data.rt=="DeleteMember_FAIL001") {
        		alert("존재하지 않는 회원 번호입니다.");
        	}
        	else if (data.rt=="DeleteMember_FAIL002") {
        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
        	}
        	else if (data.rt=="DeleteMember_OK") {
            	alert("반려가 정상적으로 완료되었습니다.");
            	window.location.reload();
        	}
        }
    })
}

function filterReservation() {
	var filterType = $("#filterType").val();
	var filterName = "";
	var filterMemo = "";
	if (filterType=="name") {
		var filterName = $("#filter").val();
	}
	else if (filterType=="memo") {
		var filterMemo = $("#filter").val();
	}
	processAjax(filterName, filterMemo);
}