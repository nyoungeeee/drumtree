function processAjax(param0, param1) {
	var roomName = [ "레슨", "연습실 3번", "연습실 4번", "연습실 5번" ];
	
	$.ajax({
        url: "http://" + IPstring + "/list-rsv",
        data: { memberName: param0, memo: param1 },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	var today = new Date();
			today.setHours(9, 0, 0, 0);
    		var result = "";
    		for (var i = 0; i < data.total; i++) {
    			if (data[i].isApproval==0||data[i].isApproval==4) {
    				result += "<tr onclick='openPopup()'>";
    				
    				if (data[i].isApproval==0) {
    					var rsvStatus = "신규 예약";
    					result += "<td name=" + data[i].isApproval + ">" + rsvStatus + "</td>";
    					
    					var regDay = new Date(data[i].regDate.split(" ")[0]);
    					if (today.getTime()==regDay.getTime()) { result += "<td name='" + data[i].regDate.substring(0,16) + "'>" + data[i].regDate.split(" ")[1].substring(0,5) + "</td>"; }
            			else { result += "<td name='" + data[i].regDate.substring(0,16) + "'>" + data[i].regDate.split(" ")[0] + "</td>"; }
    				}
    				else if (data[i].isApproval==4) {
    					var rsvStatus = "변경 신청";
    					result += "<td name=" + data[i].isApproval + ">" + rsvStatus + "</td>";
    					
    					var regDay = new Date(data[i].updateDate.split(" ")[0]);
    					if (today.getTime()==regDay.getTime()) { result += "<td name='" + data[i].updateDate.substring(0,16) + "'>" + data[i].updateDate.split(" ")[1].substring(0,5) + "</td>"; }
            			else { result += "<td name='" + data[i].updateDate.substring(0,16) + "'>" + data[i].updateDate.split(" ")[0] + "</td>"; }
    				}
        			
        			result += "<td>" + data[i].memberName + "</td>";
        			result += "<td>" + roomName[data[i].roomType] + "</td>";
        			result += "<td>" + data[i].start.split(" ")[0] + "</td>";
        			result += "<td>" + data[i].start.split(" ")[1].substring(0,5) + " ~ " + data[i].end.split(" ")[1].substring(0,5) + "</td>";
        			result += "<td>" + data[i].memo.replaceAll("\n", "<br>") + "</td>";
        			result += "<td style='display:none;'>" + data[i].rsvIdx + "</td>";
        			result += "<td style='display:none;'>" + data[i].memberIdx + "</td>";
        			result += "</tr>";
    			}
    			else {
    				result += "";
    			}
    		}
    		$("tbody").html(result);
    		$("tbody tr").fadeOut(0);
    		$("tbody tr").fadeIn(500);
    		$("tbody tr td").find("#fileList").css("display", "none");
    		
    		if ($("tbody tr").length==0) {
    			var result = "<tr id='noResult'><td colspan=" + $("thead tr td").length + ">" + "검색 결과가 없습니다." + "</td></tr>";
        		$("tbody").append(result);
        		$("tbody tr td").fadeOut(0);
            	$("tbody tr td").fadeIn(500);
            	$("#noResult").css("cursor", "default");
        	}
    		
    		$("tbody tr").not("#noResult").click(function(){
    			var resultPopup = "";
        		resultPopup += "<strong>예약 정보</strong>";
        		resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
        		resultPopup += "<hr><table id='reservationInfo'>";
        		resultPopup += "<tr>" + "<td>상태</td>" + "<td>" + $(this).children().eq(0).html() + "</td></tr>";
        		resultPopup += "<tr>" + "<td>신청 일자</td>" + "<td>" + $(this).children().eq(1).attr("name") + "</td></tr>";
        		resultPopup += "<tr>" + "<td>신청 회원</td>" + "<td>" + $(this).children().eq(2).html() + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 구분</td>" + "<td>" + "<select id='selectType'></select>" + "&emsp;" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 장소</td>" + "<td>" + "<select id='selectRoom'></select>" + "&emsp;" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 날짜</td>" + "<td>" + "<input type='date' id='selectDate'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 시간</td>" + "<td>" + "<select id='selectStartTime'></select>" + "&emsp;" + "<select id='selectEndTime'></select>" + "&emsp;" + "<input type='button' class='checkFlag' value='체크' onclick='checkTime(-1)'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>메모</td>" + "<td>" + "<textarea id='reservationMemo' spellcheck='false'></textarea>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>파일 첨부</td>" + "<td>" + "<div id='fileList'><strong>첨부 파일 목록</strong><br><hr></div>" + "</td></tr>";
        		resultPopup += "</table><hr>";
        		resultPopup += "<input type='button' class='rejectBtn' value='반려'>";
    			resultPopup += "<input type='button' class='approvalBtn' value='승인'>";
        		$(".popupBox").html(resultPopup);
        		$("#selectDate").val($(this).children().eq(4).html());
        		
        		$("#selectDate").change(function() {
            		$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		});
        		
        		$("#reservationInfo tr").eq(8).find("td").eq(1).prepend("<br>");
    			$("#reservationInfo tr").eq(8).find("td").eq(1).prepend("<label class='clearBtn' onclick='clearFile()'>지우기</label>");
    			$("#reservationInfo tr").eq(8).find("td").eq(1).prepend("<label class='uploadBtn' onclick='uploadFile()'>첨부</label>");
    			$("#reservationInfo tr").eq(8).find("td").eq(1).prepend("<label class='fileName'><a>첨부할 파일을 선택해 주세요.</a></label>");
    			$("#reservationInfo tr").eq(8).find("td").eq(1).prepend("<input type='file' id='reservationFile' style='display:none;'>");
    			$("#reservationInfo tr").eq(8).find("td").eq(1).prepend("<label class='fileBtn' for='reservationFile'>파일 선택</label>");
    			$("#reservationInfo #fileList").html($(this).children().eq(6).find("#fileList").html());
    			
    			$("#reservationFile").on('change',function(){
    				$(".fileName a").html($("#reservationFile")[0].files[0].name);
    				$(".fileName a").fadeOut(0);
    				$(".fileName a").fadeIn(500);
    			})
    			
    			var startToDelete = $(this).children().eq(6).html().indexOf("<div");
    			var endToDelete = $(this).children().eq(6).html().indexOf("div>") + 4;
    			var toDeleteString = $(this).children().eq(6).html().substring(startToDelete, endToDelete);
    			$("#reservationMemo").val($(this).children().eq(6).html().replaceAll(toDeleteString, "").replaceAll("<br>", "\n"));
        		
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
        		$("#selectStartTime").val($(this).children().eq(5).html().split(" ~ ")[0]).prop("selected", true);
        		$("#selectEndTime").val($(this).children().eq(5).html().split(" ~ ")[1]).prop("selected", true);
        		
        		$("#selectStartTime").change(function(){
        			var thisStartTime = $("#selectStartTime").val().split(":")[0];
        			if ((Number(thisStartTime)+1)<10) { var thisEndTime = "0" + (Number(thisStartTime)+1) + ":" + $("#selectStartTime").val().split(":")[1]; }
        			else { var thisEndTime = (Number(thisStartTime)+1) + ":" + $("#selectStartTime").val().split(":")[1]; }
        			$("#selectEndTime").val(thisEndTime).prop("selected", true);
        			
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		$("#selectEndTime").change(function(){
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		var resultType = "";
        		resultType += "<option value=0>" + "레슨" + "</option>";
        		resultType += "<option value=1>" + "연습" + "</option>";
        		$("#selectType").append(resultType);
        		if (roomName.indexOf($(this).children().eq(3).html())>1) { var thisType = 1; }
        		else { var thisType = roomName.indexOf($(this).children().eq(3).html()); }
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
        		$("#selectRoom").val(roomName.indexOf($(this).children().eq(3).html())).prop("selected", true);
        		
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
        			
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		$("#selectRoom").change(function(){
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		$(".approvalBtn").attr("onclick", "approvalReservation(" + $(this).children().eq(7).html() + "," + $(this).children().eq(8).html() + ")");
        		$(".rejectBtn").attr("onclick", "rejectReservation(" + $(this).children().eq(7).html() + ")");
    		})
        }
    })
}

function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:10%;'>" + "요청 상태" + "</td>";
		result += "<td style='width:10%;'>" + "신청 일자" + "</td>";
		result += "<td style='width:10%;'>" + "신청 회원" + "</td>";
		result += "<td style='width:10%;'>" + "예약 장소" + "</td>";
		result += "<td style='width:10%;'>" + "예약 날짜" + "</td>";
		result += "<td style='width:10%;'>" + "예약 시간" + "</td>";
		result += "<td style='width:30%;'>" + "예약 메모" + "</td>";
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

function approvalReservation(idx, member) {
	var rsv = $("#selectType").val();	
	var room = $("#selectRoom").val();
	var startTime = $("#selectDate").val() + " " + $("#selectStartTime").val() + ":00";
	var endTime = $("#selectDate").val() + " " + $("#selectEndTime").val() + ":00";
	var rsvMemo = "<div id='fileList'>" + $("#reservationInfo #fileList").html() + "</div>" + $("#reservationMemo").val();
	
	if ($(".checkFlag").val()=="체크") {
		alert("예약 가능 시간을 체크해주세요.");
	}
	else if ($(".checkFlag").val()=="불가") {
		alert("변경할 수 없는 시간대입니다.");
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/update-rsv",
	        data: { rsvIdx: idx, isApproval: 1, rsvType: rsv, roomType: room, start: startTime, end: endTime, memo: rsvMemo },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="UpdateRsv_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="UpdateRsv_OK") {
	        		if (rsv==0) {
        				changeRemainCount(member, 1, -1);
        			}
        			else if (rsv==1) {
        				changeRemainCount(member, 2, -1);
        			}
        			alert("승인이 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
		})
	}
}

function changeRemainCount(param0, param1, param2) {
	$.ajax({
        url: "http://" + IPstring + "/change-cnt",
        data: {
        	memberIdx: param0,
        	code: param1,
        	cnt: param2
        },
        method: "POST",
        dataType: "JSON",
        error: function() { console.log("데이터 로드 실패"); }
	})
}

function rejectReservation(idx) {
	if (confirm("예약 요청을 반려 하시겠습니까?")==true) {
		$.ajax({
	        url: "http://" + IPstring + "/update-rsv",
	        data: { rsvIdx: idx, isApproval: 2 },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="UpdateRsv_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="UpdateRsv_OK") {
	            	alert("반려가 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
		})
	}
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

function checkTime(reservationIndex) {
	$.ajax({
		url: "http://" + IPstring + "/list-rsv?isApproval=1",
        data: { start: $("#selectDate").val() },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	var startCheckArray = [];
        	var endCheckArray = [];
        	var roomTypeCheckArray = [];
        	var rsvIdxCheckArray = [];
        	
        	for (var jsonIdx = 0; jsonIdx < data.total; jsonIdx++) {
        		startCheckArray.push(data[jsonIdx].start);
        		endCheckArray.push(data[jsonIdx].end);
        		roomTypeCheckArray.push(data[jsonIdx].roomType);
        		rsvIdxCheckArray.push(data[jsonIdx].rsvIdx);
        	}
        	
        	if (reservationIndex != -1) {
        		var thisIdx = rsvIdxCheckArray.indexOf(reservationIndex);
        		startCheckArray.splice(thisIdx, 1);
        		endCheckArray.splice(thisIdx, 1);
        		roomTypeCheckArray.splice(thisIdx, 1);
        		rsvIdxCheckArray.splice(thisIdx, 1);
        	}
        	
        	$("#errorMessageRoom").remove();
        	
        	var room = $("#selectRoom").val();
        	var startTime = $("#selectDate").val() + " " + $("#selectStartTime").val() + ":00";
        	var endTime = $("#selectDate").val() + " " + $("#selectEndTime").val() + ":00";
        	var startGetTime = new Date(startTime);
        	var endGetTime = new Date(endTime);
        	
        	if (room==null||room=="none") {
        		$("#reservationInfo tr").eq(4).children().eq(1).append("<a id='errorMessageRoom' class='error'>!</a>");
        		$("#errorMessageRoom").fadeOut(0);
        		$("#errorMessageRoom").fadeIn(500);
        		
        		$(".checkFlag").val("불가");
        		$(".checkFlag").addClass("checkFalse");
        	}
        	else if ($("#selectStartTime").val()==null||$("#selectEndTime").val()==null) {
        		$(".checkFlag").val("불가");
        		$(".checkFlag").addClass("checkFalse");
        	}
        	else if (startGetTime.getTime()>=endGetTime.getTime()) {
        		$(".checkFlag").val("불가");
        		$(".checkFlag").addClass("checkFalse");
        	}
        	else {
        		var checkFlag = true;
	        	for (var arrayIdx = 0; arrayIdx < startCheckArray.length; arrayIdx++) {
	        		var startDateCheck = new Date(startCheckArray[arrayIdx]);
	        		var endDateCheck = new Date(endCheckArray[arrayIdx]);
	        		var roomCheck = roomTypeCheckArray[arrayIdx];
	        		
	        		var selectDate = new Date($("#selectDate").val());
	        		selectDate.setHours($("#selectStartTime").val().split(":")[0], $("#selectStartTime").val().split(":")[1], 0, 0);
	        		if (roomCheck==$("#selectRoom").val()&&startDateCheck.getTime()<=selectDate.getTime()&&endDateCheck.getTime()>selectDate.getTime()) {
	        			var checkFlag = false;
	        		}
	        		
	        		selectDate.setHours($("#selectEndTime").val().split(":")[0], $("#selectEndTime").val().split(":")[1], 0, 0);
	        		if (roomCheck==$("#selectRoom").val()&&startDateCheck.getTime()<selectDate.getTime()&&endDateCheck.getTime()>=selectDate.getTime()) {
	        			var checkFlag = false;
	        		}
	        	}
        	}

        	if (checkFlag==true) {
        		$(".checkFlag").val("가능");
        		$(".checkFlag").addClass("checkTrue");
        	}
        	else {
        		$(".checkFlag").val("불가");
        		$(".checkFlag").addClass("checkFalse");
        	}
        }
	})
}

function uploadFile() {
	var formData = new FormData();
	var fileData = $("#reservationFile")[0].files[0];
	formData.append("upload", fileData);
	
	if (fileData==null) {
		$(".fileName a").fadeOut(0);
		$(".fileName a").fadeIn(500);
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/upload2",
	        data: formData,
	        contentType: false,
	        processData: false,
	        method: "POST",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	var startPoint = data.indexOf('"url":"') + 7;
	        	var endPoint = data.indexOf(', "name"');
	        	var fileURL = data.substring(startPoint, endPoint);
	        	
	        	var startName = data.indexOf('"name":"') + 8;
	        	var endName = data.indexOf('"}');
	        	var fileName = data.substring(startName, endName);
	        	
	        	var fileList = "<span>" + "[ " + "<a href='" + fileURL + "' target='_blank'>" + fileName + "</a>" + " ]" + "&emsp;" + "</span>";
	        	$("#reservationInfo #fileList").append(fileList);
	        }
		})
	}
}

function clearFile() {
	$("#reservationInfo #fileList span").remove();
}