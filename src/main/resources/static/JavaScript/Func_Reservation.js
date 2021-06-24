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
	resultHead += "<td colspan=2>" + "08:00" + "</td>";
	resultHead += "<td colspan=2>" + "09:00" + "</td>";
	resultHead += "<td colspan=2>" + "10:00" + "</td>";
	resultHead += "<td colspan=2>" + "11:00" + "</td>";
	resultHead += "<td colspan=2>" + "12:00" + "</td>";
	resultHead += "<td colspan=2>" + "13:00" + "</td>";
	resultHead += "<td colspan=2>" + "14:00" + "</td>";
	resultHead += "<td colspan=2>" + "15:00" + "</td>";
	resultHead += "<td colspan=2>" + "16:00" + "</td>";
	resultHead += "<td colspan=2>" + "17:00" + "</td>";
	resultHead += "<td colspan=2>" + "18:00" + "</td>";
	resultHead += "<td colspan=2>" + "19:00" + "</td>";
	resultHead += "<td colspan=2>" + "20:00" + "</td>";
	resultHead += "<td colspan=2>" + "21:00" + "</td>";
	resultHead += "<td colspan=2>" + "22:00" + "</td>";
	resultHead += "</tr>";
	$("thead").html(resultHead);
	
	var thisYear = currentDate.getFullYear();
	var thisMonth = currentDate.getMonth();
	var thisDay = currentDate.getDate();
	
	var startDate = new Date(2021, 5, 24, 9, 0, 0);
	var endDate = new Date(2021, 5, 24, 12, 0, 0);
	var memberName = "녕이"
	var roomNo = 1;
	var timeDifference = endDate.getTime() - startDate.getTime();
	var timeCount = ((timeDifference/1000)/60)/30;
	
	var resultBody = "";
	for (var i = 0; i < 3; i++) {
		resultBody += "<tr>";
		if (i==0) {
			resultBody += "<td>" + "레슨" + "</td>";
		}
		else {
			resultBody += "<td>" + "연습실" + i + "</td>";
		}
		
		if (i==roomNo) {
			for (var j = 0; j < 30; j++) {
				var thisDate = new Date(thisYear, thisMonth, thisDay, 0, 0, 0);
				thisDate.setHours(parseInt(j/2)+8, (j%2)*30, 0);
				if (thisDate.getTime()==startDate.getTime()) {
					resultBody += "<td class='timeTable' id='reserved' colspan=" + timeCount + ">"
					resultBody += "<div id='reservation' onclick='openPopup()'>" + memberName + "</div>";
					resultBody += "</td>";
				}
				else if (thisDate>startDate&&thisDate<endDate) {
					resultBody += "<td class='timeTable' style='display:none;'>" + "<div class='hoverBall'></div>" + "</td>";
				}
				else {
					resultBody += "<td class='timeTable' onclick='openPopup()'>" + "<div class='hoverBall'></div>" + "</td>";
				}
			}
			resultBody += "</tr>";
		}
		else {
			for (var j = 0; j < 30; j++) {
				var thisDate = new Date(thisYear, thisMonth, thisDay, 0, 0, 0);
				thisDate.setHours(parseInt(j/2)+8, (j%2)*30, 0);
				resultBody += "<td class='timeTable' onclick='openPopup()'>" + "<div class='hoverBall'></div>" + "</td>";
			}
			resultBody += "</tr>";
		}
	}
	$("tbody").html(resultBody);
	$("tbody tr").fadeOut(0);
	$("tbody tr").fadeIn(500);
	
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
		resultPopup += "<input type='button' class='saveBtn' value='등록'>";
		$(".popupBox").html(resultPopup);
		$("#selectDate").val($("#date").val());
		
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
		if ($(this).parent().index()==2) { var thisType = 1; }
		else { var thisType = $(this).parent().index(); }
		$("#selectType").val(thisType).prop("selected", true);
		
		var resultRoom = "";
		if ($("#selectType").val()==0) {
			resultRoom += "<option value='none'>" + "" + "</option>";
			resultRoom += "<option value=0>" + "레슨실" + "</option>";
		}
		else {
			resultRoom += "<option value='none'>" + "" + "</option>";
			resultRoom += "<option value=1>" + "연습실1" + "</option>";
			resultRoom += "<option value=2>" + "연습실2" + "</option>";
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
				resultRoom += "<option value=1>" + "연습실1" + "</option>";
				resultRoom += "<option value=2>" + "연습실2" + "</option>";
			}
			$("#selectRoom").append(resultRoom);
		})
	})
	
	$("#reservation").click(function() {
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
		resultPopup += "<input type='button' class='deleteBtn' value='제거'>";
		resultPopup += "<input type='button' class='updateBtn' value='저장'>";
		$(".popupBox").html(resultPopup);
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