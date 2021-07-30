function processAjax(param0, param1, param2, param3, param4, param5) {
	var thisYear = param0;
	var thisMonth = param1;
	
	if (thisMonth<9) {
		var month = "0" + (thisMonth+1);
	} else {
		var month = (thisMonth+1);
	}
	var filterStart = thisYear + "-" + month;
	
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
        	var memberIdxArray = [];
        	
        	for (var jsonIdx = 0; jsonIdx < data.total; jsonIdx++) {
            	startArray.push(data[jsonIdx].start);
            	endArray.push(data[jsonIdx].end);
            	rsvTypeArray.push(data[jsonIdx].rsvType);
            	roomTypeArray.push(data[jsonIdx].roomType);
            	memberNameArray.push(data[jsonIdx].memberName);
            	memoArray.push(data[jsonIdx].memo);
            	rsvIdxArray.push(data[jsonIdx].rsvIdx);
            	memberIdxArray.push(data[jsonIdx].memberIdx);
        	}
        	
        	var resultBody = "";
        	for (var i = 0; i < 42; i++) {
        		if (i%7==0) {
        			resultBody += "<tr>";
        			resultBody += "<td style='color:#FA5858;'></td>";
        		} else if (i%7==6) {
        			resultBody += "<td style='color:#5882FA;'></td>";
        			resultBody += "</tr>";
        		} else {
        			resultBody += "<td></td>";
        		}
        	}
        	$("tbody").html(resultBody);
        	
        	var firstDay = new Date(param0,param1,1);
        	var firstWeek = firstDay.getDay();
        	for (var j = (0-firstWeek); j < (42-firstWeek); j++) {
        		var currentDay = new Date(param0,param1,1);
        		currentDay.setDate(currentDay.getDate()+j);
        		var currentWeek = currentDay.getDay();
        		
        		var year = currentDay.getFullYear();
        		if (currentDay.getMonth()<9) {
        			var month = "0" + (currentDay.getMonth()+1);
        		} else {
        			var month = (currentDay.getMonth()+1);
        		}
        		if (currentDay.getDate()<10) {
        			var day = "0" + currentDay.getDate();
        		} else {
        			var day = currentDay.getDate();
        		}
        		
        		var row = parseInt((j+firstWeek)/7);
        		$("tbody tr").eq(row).children().eq(currentWeek).append("<label id='monthDay'>" + month + "-" + day + "</label>" + "<a style='float:right'></a>" + "<hr>");
        		$("tbody tr").eq(row).children().eq(currentWeek).append("<div id='realTime'>" + year + "-" + month + "-" + day + "</div>");
        		$("tbody tr").eq(row).children().eq(currentWeek).append("<div id='reservationList'>" + "</div>");
        	}
        	
        	$("label").click(function() {
        		var clickDate = $(this).parent().find("#realTime").html();
        		if (confirm(clickDate + "의 예약 화면으로 이동하시겠습니까?")==true) {
        			location.href = "../Reservation?date=" + clickDate;
        		}
        	});
        	
        	var holyDay = [ "01-01", "02-11", "02-12", "02-13", "03-01", "05-05", "05-19", "06-06", "08-15", "09-20", "09-21", "09-22", "10-03", "10-09", "12-25" ];
        	for (var k = 0; k < holyDay.length; k++) {
        		$("tbody td:contains('" + holyDay[k] + "')").css("color", "#FA5858");
        	}
        	
        	var today = new Date();
        	var nowYear = today.getFullYear();
        	if (today.getMonth()<9) {
        		var nowMonth = "0" + (today.getMonth()+1);
        	} else {
        		var nowMonth = (today.getMonth()+1);
        	}
        	if (today.getDate()<10) {
        		var nowDay = "0" + today.getDate();
        	} else {
        		var nowDay = today.getDate();
        	}
        	var now = nowYear + "-" +  nowMonth + "-" + nowDay;
        	$("tbody td:contains('" + now + "')").css("background", "#E6E6E6");
        	$("tbody td:contains('" + now + "')").css("font-weight", "bold");
        	$("tbody td").not("td:contains('" + $("#month").val() + "')").css("color", "#D8D8D8");
        	
        	var roomName = [ "레슨", "연습실3", "연습실4", "연습실5" ];
        	var key = $.cookie("loginInfo");
    		var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
    		var loginGrade = decrypt.split("&")[2];
    		var loginMember = decrypt.split("&")[3];
    		
        	for (var arrayIdx = 0; arrayIdx < startArray.length; arrayIdx++) {
        		var startTime = startArray[arrayIdx].split(" ")[1].substring(0,5);
        		var endTime = endArray[arrayIdx].split(" ")[1].substring(0,5);
        		var room = roomName[roomTypeArray[arrayIdx]];
        		var member = memberNameArray[arrayIdx];
        		var memo = memoArray[arrayIdx];
        		var rsvDate = startArray[arrayIdx].split(" ")[0];
        		var memberIdx = memberIdxArray[arrayIdx];
        		
        		var isFiltered = true;
        		if (param5==1 && memberIdx!=loginMember) { var isFiltered = false; }
        		if (param2!="" && member.indexOf(param2)<0) { var isFiltered = false; }
        		if (param3!="" && room.indexOf(param3)<0) { var isFiltered = false; }
        		if (param4!="" && memo.indexOf(param4)<0) { var isFiltered = false; }
        		
        		if (isFiltered==true) {
        			if (memberIdx!=loginMember&&loginGrade!=99) {
            			var reservation = "<div id='reservation' name='noPopup'>" + "[ " + room + " ]" + "&nbsp;" + startTime + " ~ " + endTime + "<a style='float:right'>" + maskingText(member) + "</a>" + "</div>";
        			}
        			else {
            			var reservation = "<div id='reservation' name='" + arrayIdx + "' onclick='openPopup()'>" + "[ " + room + " ]" + "&nbsp;" + startTime + " ~ " + endTime + "<a style='float:right'>" + maskingText(member) + "</a>" + "</div>";
        			}
        		}
        		else {
        			var reservation = "";
        		}
            	$("tbody td:contains('" + rsvDate + "')").find("#reservationList").append(reservation);
        	}
        	$("div #reservation[name='noPopup']").css("cursor", "default");
        	
        	for (var m = 0; m < $("tbody tr").length; m++) {
        		for (var n = 0; n < 7; n++) {
        			var reservationCount = $("tbody tr").eq(m).find("td").eq(n).find("div #reservation").length;
        			if (reservationCount>0) {
        				$("tbody tr").eq(m).find("td").eq(n).find("a").not("#reservation a").html(reservationCount + "건");
        			}
        		}
        	}
        	
        	var lastRow = $("tbody tr").eq(5).children().not("td:contains('" + $("#month").val() + "')").length;
        	if (lastRow==7) {
        		$("tbody tr").eq(5).css("display", "none");
        	}
        	$("tbody tr td").fadeOut(0);
        	$("tbody tr td").fadeIn(500);
        	
        	$("div #reservation").not("[name='noPopup']").click(function() {
        		var resultPopup = "";
        		resultPopup += "<strong>예약 정보</strong>";
        		resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
        		resultPopup += "<hr><table id='reservationInfo'>";
        		resultPopup += "<tr>" + "<td>예약 구분</td>" + "<td>" + "<select id='selectType'></select>&emsp;" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 장소</td>" + "<td>" + "<select id='selectRoom'></select>&emsp;" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 날짜</td>" + "<td>" + "<input type='date' id='selectDate'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 시간</td>" + "<td>" + "<select id='selectStartTime'></select>" + "&emsp;" + "<select id='selectEndTime'></select>" + "&emsp;" + "<input type='button' class='checkFlag' value='체크' onclick='checkTime(" + rsvIdxArray[$(this).attr("name")] + ")'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>메모</td>" + "<td>" + "<textarea id='reservationMemo' spellcheck='false'></textarea>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>파일 첨부</td>" + "<td>" + "<div id='fileList'><strong>첨부 파일 목록</strong><br><hr></div>" + "</td></tr>";
        		resultPopup += "</table><hr>";
        		resultPopup += "<input type='button' class='deleteBtn' value='예약취소'>";
        		resultPopup += "<input type='button' class='updateBtn' value='변경'>";
        		$(".popupBox").html(resultPopup);
        		$("#selectDate").val($(this).parent().parent().find("#realTime").html());
        		$(".updateBtn").attr("onclick", "updateReservation(" + rsvIdxArray[$(this).attr("name")] + ")");
        		$(".deleteBtn").attr("onclick", "deleteReservation(" + rsvIdxArray[$(this).attr("name")] + ")");
        		
        		$("#selectDate").change(function() {
            		$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		});
        		
        		$("#reservationInfo tr").eq(5).find("td").eq(1).prepend("<br>");
    			$("#reservationInfo tr").eq(5).find("td").eq(1).prepend("<label class='clearBtn' onclick='clearFile()'>지우기</label>");
    			$("#reservationInfo tr").eq(5).find("td").eq(1).prepend("<label class='uploadBtn' onclick='uploadFile()'>첨부</label>");
    			$("#reservationInfo tr").eq(5).find("td").eq(1).prepend("<label class='fileName'><a>첨부할 파일을 선택해 주세요.</a></label>");
    			$("#reservationInfo tr").eq(5).find("td").eq(1).prepend("<input type='file' id='reservationFile' style='display:none;'>");
    			$("#reservationInfo tr").eq(5).find("td").eq(1).prepend("<label class='fileBtn' for='reservationFile'>파일 선택</label>");
    			var startHTML = "<div id='fileList'>";
    			var startToFile = memoArray[$(this).attr("name")].indexOf(startHTML) + startHTML.length;
    			var endToFile = memoArray[$(this).attr("name")].indexOf("</div>");
    			var toFileString = memoArray[$(this).attr("name")].substring(startToFile, endToFile);
    			$("#reservationInfo #fileList").html(toFileString);
    			
    			$("#reservationFile").on('change',function(){
    				$(".fileName a").html($("#reservationFile")[0].files[0].name);
    				$(".fileName a").fadeOut(0);
    				$(".fileName a").fadeIn(500);
    			})
    			
    			var startToDelete = memoArray[$(this).attr("name")].indexOf("<div");
    			var endToDelete = memoArray[$(this).attr("name")].indexOf("div>") + 4;
    			var toDeleteString = memoArray[$(this).attr("name")].substring(startToDelete, endToDelete);
    			$("#reservationMemo").val(memoArray[$(this).attr("name")].replaceAll(toDeleteString, "").replaceAll("<br>", "\n"));
        		
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
        			
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		$("#selectRoom").change(function(){
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        	})
        }
    })
}

function selectMonth() {
	$(document).ready(function(){
		var timezoneOffset = new Date().getTimezoneOffset() * 60000;
		var timezoneDate = new Date(Date.now() - timezoneOffset);
		$("#month").val(timezoneDate.toISOString().slice(0,7));
		createMonthlyCalendar();
		
		$('#month').change(function(){
			createMonthlyCalendar();
		})
	});
}

function clickArrow(addValue) {
	var currentYear = Number($("#month").val().slice(0,4));
	var currentMonth = Number($("#month").val().slice(5,7))-1;
	var currentDate = new Date(currentYear, currentMonth+addValue, 1, 9, 0, 0);
	$("#month").val(currentDate.toISOString().slice(0,7));
	createMonthlyCalendar();
}

function createMonthlyCalendar() {
	var resultHead = "";
	resultHead += "<tr>";
	resultHead += "<td>" + "일" + "</td>";
	resultHead += "<td>" + "월" + "</td>";
	resultHead += "<td>" + "화" + "</td>";
	resultHead += "<td>" + "수" + "</td>";
	resultHead += "<td>" + "목" + "</td>";
	resultHead += "<td>" + "금" + "</td>";
	resultHead += "<td>" + "토" + "</td>";
	resultHead += "</tr>";
	$("thead").html(resultHead);
	filterCalendar();
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

function updateReservation(idx) {
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
	        data: { isApproval: 0, rsvIdx: idx, rsvType: rsv, roomType: room, start: startTime, end: endTime, memo: rsvMemo },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="UpdateRsv_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="UpdateRsv_OK") {
	            	alert("변경 신청이 접수되었습니다.\n관리자에게 승인을 요청해 주세요.");
	            	window.location.reload();
	        	}
	        }
		})
	}
}

function deleteReservation(idx) {
	if (confirm("예약을 취소 하시겠습니까?")==true) {
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
        	
        	$("#errorMessageType").remove();
        	$("#errorMessageRoom").remove();
        	
        	var rsv = $("#selectType").val();
        	var room = $("#selectRoom").val();
        	var startTime = $("#selectDate").val() + " " + $("#selectStartTime").val() + ":00";
        	var endTime = $("#selectDate").val() + " " + $("#selectEndTime").val() + ":00";
        	var startGetTime = new Date(startTime);
        	var endGetTime = new Date(endTime);
        	
        	if (rsv==null) {
        		$("#reservationInfo tr").eq(0).children().eq(1).append("<a id='errorMessageType' class='error'>!</a>");
        		$("#errorMessageType").fadeOut(0);
        		$("#errorMessageType").fadeIn(500);
        	}
        	else if (room==null||room=="none") {
        		$("#reservationInfo tr").eq(1).children().eq(1).append("<a id='errorMessageRoom' class='error'>!</a>");
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

function filterCalendar() {
	var currentYear = Number($("#month").val().slice(0,4));
	var currentMonth = Number($("#month").val().slice(5,7))-1;
	
	var filterType = $("#filterType").val();
	var filterName = "";
	var filterRoom = "";
	var filterMemo = "";
	if (filterType=="name") {
		var filterName = $("#filter").val();
	}
	else if (filterType=="room") {
		var filterRoom = $("#filter").val();
	}
	else if (filterType=="memo") {
		var filterMemo = $("#filter").val();
	}
	
	var isOnOff = 0;
	if ($(".myScheduleArea").hasClass("myScheduleOn")==true) { var isOnOff = 1; }
	
	processAjax(currentYear, currentMonth, filterName, filterRoom, filterMemo, isOnOff);
}

function mySchedule() {
var on = $(".myScheduleArea").hasClass("myScheduleOn");
	
	if (on==false) {
		$(".myScheduleArea").addClass("myScheduleOn");
		$(".myScheduleBtn").val("나의 일정");
	}
	else if (on==true) {
		$(".myScheduleArea").removeClass("myScheduleOn");
		$(".myScheduleBtn").val("모든 일정");
	}
	filterCalendar();
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