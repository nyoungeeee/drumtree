function processAjax(param0) {
	var thisYear = param0.getFullYear();
	var thisMonth = param0.getMonth();
	var thisDay = param0.getDate();
	
	if (thisMonth<9) {
		var month = "0" + (thisMonth+1);
	} else {
		var month = (thisMonth+1);
	}
	if (thisDay<10) {
		var day = "0" + thisDay;
	} else {
		var day = thisDay;
	}
	var filterStart = thisYear + "-" + month + "-" + day;
	
    $.ajax({
        url: "http://" + IPstring + "/list-rsv?isApproval=1",
        data: { start: filterStart },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	var startArray = [];
        	var endArray = [];
        	var rsvTypeArray = [];
        	var roomTypeArray = [];
        	var memberNameArray = [];
        	var memoArray = [];
        	var rsvIdxArray = [];
        	
        	for (var jsonIdx = 0; jsonIdx < data.total; jsonIdx++) {
            	startArray.push(data[jsonIdx].start);
            	endArray.push(data[jsonIdx].end);
            	rsvTypeArray.push(data[jsonIdx].rsvType);
            	roomTypeArray.push(data[jsonIdx].roomType);
            	memberNameArray.push(data[jsonIdx].memberName);
            	memoArray.push(data[jsonIdx].memo);
            	rsvIdxArray.push(data[jsonIdx].rsvIdx);
        	}
        	
        	var roomName = [ "레슨", "연습실 3번", "연습실 4번<br>(미니드럼)", "연습실 5번" ];
        	var resultBody = "";
        	for (var i = 0; i < roomName.length; i++) {
        		resultBody += "<tr>";
        		resultBody += "<td>" + roomName[i] + "</td>";
        		for (var j = 0; j < 30; j++) { resultBody += "<td class='timeTable' onclick='openPopup()'>" + "<div class='hoverBall'></div>" + "</td>"; }
        		resultBody += "</tr>";
        	}
        	$("tbody").html(resultBody);
        	
        	for (var arrayIdx = 0; arrayIdx < startArray.length; arrayIdx++) {
        		var startDate = new Date(startArray[arrayIdx]);
        		var endDate = new Date(endArray[arrayIdx]);
        		var room = roomTypeArray[arrayIdx];
        		var member = memberNameArray[arrayIdx];
        		var timeDifference = endDate.getTime() - startDate.getTime();
        		var timeCount = ((timeDifference/1000)/60)/30;
        		
        		var thisDate = new Date(thisYear, thisMonth, thisDay, 8, 0, 0);
        		if (startDate.getTime() >= thisDate.getTime()) {
        			var startPoint = ((((startDate.getTime() - thisDate.getTime())/1000)/60)/30)+1;
        			$("tbody tr").eq(room).find("td").eq(startPoint).attr("colspan", timeCount);
        			$("tbody tr").eq(room).find("td").eq(startPoint).attr("id", "reserved");
        			$("tbody tr").eq(room).find("td").eq(startPoint).removeAttr("onclick");
        			$("tbody tr").eq(room).find("td").eq(startPoint).html("<div id='reservation' name='" + arrayIdx + "' onclick='openPopup()'>" + member + "</div>");
        			for (var k = 1; k < timeCount; k++) {
        				$("tbody tr").eq(room).find("td").eq(startPoint+k).css("display", "none");
        				$("tbody tr").eq(room).find("td").eq(startPoint+k).removeAttr("onclick");
        			}
        		}
        	}
        	$("tbody tr").fadeOut(0);
        	$("tbody tr").fadeIn(500);
        	
        	$("div #reservation").click(function() {
        		var resultPopup = "";
        		resultPopup += "<strong>예약 정보</strong>";
        		resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
        		resultPopup += "<br><br><hr><br>";
        		resultPopup += "<table id='reservationInfo'>";
        		resultPopup += "<tr>" + "<td>예약 구분</td>" + "<td>" + "<select id='selectType'></select>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 장소</td>" + "<td>" + "<select id='selectRoom'></select>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 날짜</td>" + "<td>" + "<input type='date' id='selectDate'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 시간</td>" + "<td>" + "<select id='selectStartTime'></select>" + "&emsp;" + "<select id='selectEndTime'></select>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>메모</td>" + "<td>" + "<textarea id='reservationMemo' spellcheck='false'></textarea>" + "</td></tr>";
        		resultPopup += "</table><br><hr><br>";
        		resultPopup += "<input type='button' class='deleteBtn' value='취소'>";
        		resultPopup += "<input type='button' class='updateBtn' value='변경'>";
        		$(".popupBox").html(resultPopup);
        		$("#selectDate").val($("#date").val());
        		$("#reservationMemo").val(memoArray[$(this).attr("name")].replaceAll("<br>", "\n"));
        		$(".updateBtn").attr("onclick", "updateReservation(" + rsvIdxArray[$(this).attr("name")] + ")");
        		$(".deleteBtn").attr("onclick", "deleteReservation(" + rsvIdxArray[$(this).attr("name")] + ")");
        		
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
        		
        		var rsvStartTime = startArray[$(this).attr("name")].split(" ")[1].substring(0,5);
        		var rsvEndTime = endArray[$(this).attr("name")].split(" ")[1].substring(0,5);
        		$("#selectStartTime").val(rsvStartTime).prop("selected", true);
        		$("#selectEndTime").val(rsvEndTime).prop("selected", true);
        		
        		var resultType = "";
        		resultType += "<option value=0>" + "레슨" + "</option>";
        		resultType += "<option value=1>" + "연습" + "</option>";
        		$("#selectType").append(resultType);
        		if (roomTypeArray[$(this).attr("name")]>1) { var thisType = 1; }
        		else { var thisType = roomTypeArray[$(this).attr("name")]; }
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
        		var thisRoom = roomTypeArray[$(this).attr("name")];
        		$("#selectRoom").val(thisRoom).prop("selected", true);
        		
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
        	
        	$("tbody tr .timeTable").not("#reserved").click(function(){
        		var resultPopup = "";
        		resultPopup += "<strong>예약하기</strong>";
        		resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
        		resultPopup += "<br><br><hr><br>";
        		resultPopup += "<table id='reservationInfo'>";
        		resultPopup += "<tr>" + "<td>예약 구분</td>" + "<td>" + "<select id='selectType'></select>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 장소</td>" + "<td>" + "<select id='selectRoom'></select>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 날짜</td>" + "<td>" + "<input type='date' id='selectDate'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 시간</td>" + "<td>" + "<select id='selectStartTime'></select>" + "&emsp;" + "<select id='selectEndTime'></select>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>메모</td>" + "<td>" + "<textarea id='reservationMemo' spellcheck='false'></textarea>" + "</td></tr>";
        		resultPopup += "</table><br><hr><br>";
        		resultPopup += "<input type='button' class='resetBtn' value='초기화'>";
        		resultPopup += "<input type='button' class='saveBtn' value='신청'>";
        		$(".popupBox").html(resultPopup);
        		$("#selectDate").val($("#date").val());
        		$(".saveBtn").attr("onclick", "saveReservation()");
        		$(".resetBtn").attr("onclick", "resetReservation()");
        		
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
        		
        		if (parseInt(($(this).index()-1)/2)+8 > 9) { var thisStartHour = parseInt(($(this).index()-1)/2)+8; }
        		else { var thisStartHour = "0" + (parseInt(($(this).index()-1)/2)+8); }
        		if ((($(this).index()-1)%2)*30 > 0) { var thisStartMin = (($(this).index()-1)%2)*30; }
        		else { var thisStartMin = "0" + (($(this).index()-1)%2)*30; }
        		$("#selectStartTime").val(thisStartHour + ":" + thisStartMin).prop("selected", true);
        		
        		if (parseInt(($(this).index()-1)/2)+9 > 9) { var thisEndHour = parseInt(($(this).index()-1)/2)+9; }
        		else { var thisEndHour = "0" + (parseInt(($(this).index()-1)/2)+9); }
        		if (thisStartHour==22&&thisStartMin==30) { var thisEndMin = "00"; }
        		else { var thisEndMin = thisStartMin; }
        		$("#selectEndTime").val(thisEndHour + ":" + thisEndMin).prop("selected", true);
        		
        		$("#selectStartTime").change(function(){
        			var thisStartTime = $("#selectStartTime").val().split(":")[0];
        			if ((Number(thisStartTime)+1)<10) { var thisEndTime = "0" + (Number(thisStartTime)+1) + ":" + $("#selectStartTime").val().split(":")[1]; }
        			else { var thisEndTime = (Number(thisStartTime)+1) + ":" + $("#selectStartTime").val().split(":")[1]; }
        			$("#selectEndTime").val(thisEndTime).prop("selected", true);
        		})
        		
        		var resultType = "";
        		resultType += "<option value=0>" + "레슨" + "</option>";
        		resultType += "<option value=1>" + "연습" + "</option>";
        		$("#selectType").append(resultType);
        		if ($(this).parent().index()>1) { var thisType = 1; }
        		else { var thisType = $(this).parent().index(); }
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
        		var thisRoom = $(this).parent().index();
        		$("#selectRoom").val(thisRoom).prop("selected", true);
        		
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

function selectDate() {
	$(document).ready(function(){
		var currentDate = new Date();
		$("#date").val(currentDate.toISOString().slice(0,10));
		createTimeTable(currentDate);
		
		$('#date').change(function(){
			var currentDate = new Date($("#date").val());
			createTimeTable(currentDate);
		})
	});
}

function clickArrow(addValue) {
	var currentDate = new Date($("#date").val());
	currentDate.setDate(currentDate.getDate()+addValue);
	$("#date").val(currentDate.toISOString().slice(0,10));
	createTimeTable(currentDate);
}

function createTimeTable(currentDate) {
	var currentDateString = $("#date").val().split("-");
	var resultHead = "";
	resultHead += "<tr>";
	resultHead += "<td style='width:7.5%;'>" + currentDateString[1] + "월" + "&nbsp;" + currentDateString[2] + "일" + "</td>";
	for (var headIdx = 8; headIdx < 23; headIdx++) {
		if (headIdx > 9) {
			resultHead += "<td colspan=2 style='text-align:left;'>" + headIdx + ":00" + "</td>";
		}
		else {
			resultHead += "<td colspan=2 style='text-align:left;'>" + "0" + headIdx + ":00" + "</td>";
		}
	}
	resultHead += "</tr>";
	$("thead").html(resultHead);
	processAjax(currentDate);
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

function saveReservation() {
	var rsv = $("#selectType").val();	
	var room = $("#selectRoom").val();
	var startTime = $("#selectDate").val() + " " + $("#selectStartTime").val() + ":00";
	var endTime = $("#selectDate").val() + " " + $("#selectEndTime").val() + ":00";
	var rsvMemo = $("#reservationMemo").val().replaceAll("\n", "<br>");
	var rsvMember = 19;
	
	$("#errorMessageType").remove();
	$("#errorMessageRoom").remove();
	$("#errorMessageTime").remove();
	
	var startGetTime = new Date(startTime);
	var endGetTime = new Date(endTime);
	if (rsv==null) {
		$("#reservationInfo tr").eq(0).children().eq(1).append("<a id='errorMessageType' style='color:red;'>&emsp;<strong>예약 구분 선택 필수</strong></a>");
		$("#errorMessageType").fadeOut(0);
		$("#errorMessageType").fadeIn(500);
	}
	else if (room==null||room=="none") {
		$("#reservationInfo tr").eq(1).children().eq(1).append("<a id='errorMessageRoom' style='color:red;'>&emsp;<strong>예약 장소 선택 필수</strong></a>");
		$("#errorMessageRoom").fadeOut(0);
		$("#errorMessageRoom").fadeIn(500);
	}
	else if ($("#selectStartTime").val()==null||$("#selectEndTime").val()==null) {
		$("#reservationInfo tr").eq(3).children().eq(1).append("<a id='errorMessageTime' style='color:red;'>&emsp;<strong>예약 시간 선택 필수</strong></a>");
		$("#errorMessageTime").fadeOut(0);
		$("#errorMessageTime").fadeIn(500);
	}
	else if (startGetTime.getTime()>=endGetTime.getTime()) {
		$("#reservationInfo tr").eq(3).children().eq(1).append("<a id='errorMessageTime' style='color:red;'>&emsp;<strong>시간 재설정 필요</strong></a>");
		$("#errorMessageTime").fadeOut(0);
		$("#errorMessageTime").fadeIn(500);
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/write-rsv",
	        data: { memberIdx: rsvMember, rsvType: rsv, roomType: room, start: startTime, end: endTime, memo: rsvMemo },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="WriteRsv_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="WriteRsv_OK") {
	            	alert("예약 신청이 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
		})
	}
}

function resetReservation() {
	$("#selectType").val("");
	$("#selectRoom").val("");
	$("#selectStartTime").val("");
	$("#selectEndTime").val("");
	$("#reservationMemo").val("");
	
	$("#errorMessageType").remove();
	$("#errorMessageRoom").remove();
	$("#errorMessageTime").remove();
}

function updateReservation(idx) {
	var rsv = $("#selectType").val();	
	var room = $("#selectRoom").val();
	var startTime = $("#selectDate").val() + " " + $("#selectStartTime").val() + ":00";
	var endTime = $("#selectDate").val() + " " + $("#selectEndTime").val() + ":00";
	var rsvMemo = $("#reservationMemo").val().replaceAll("\n", "<br>");
	
	$("#errorMessageRoom").remove();
	$("#errorMessageTime").remove();
	
	var startGetTime = new Date(startTime);
	var endGetTime = new Date(endTime);
	if (room=="none") {
		$("#reservationInfo tr").eq(1).children().eq(1).append("<a id='errorMessageRoom' style='color:red;'>&emsp;<strong>예약 장소 선택 필수</strong></a>");
		$("#errorMessageRoom").fadeOut(0);
		$("#errorMessageRoom").fadeIn(500);
	}
	else if (startGetTime.getTime()>=endGetTime.getTime()) {
		$("#reservationInfo tr").eq(3).children().eq(1).append("<a id='errorMessageTime' style='color:red;'>&emsp;<strong>시간 재설정 필요</strong></a>");
		$("#errorMessageTime").fadeOut(0);
		$("#errorMessageTime").fadeIn(500);
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/update-rsv",
	        data: { rsvIdx: idx, rsvType: rsv, roomType: room, start: startTime, end: endTime, memo: rsvMemo },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="UpdateRsv_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="UpdateRsv_OK") {
	            	alert("예약 변경이 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
		})
	}
}

function deleteReservation(idx) {
	$.ajax({
        url: "http://" + IPstring + "/update-rsv",
        data: { rsvIdx: idx, isApproval: 3 },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	if (data.rt=="UpdateRsv_FAIL001") {
        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
        	}
        	else if (data.rt=="UpdateRsv_OK") {
            	alert("예약 취소가 정상적으로 완료되었습니다.");
            	window.location.reload();
        	}
        }
	})
}