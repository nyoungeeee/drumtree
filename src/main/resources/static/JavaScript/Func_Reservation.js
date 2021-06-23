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
	var resultHead = "";
	resultHead += "<tr>";
	resultHead += "<td style='width:7.5%;'>" + "구분" + "</td>";
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
	
	var startDate = new Date(2021, 5, 23, 9, 0, 0);
	var endDate = new Date(2021, 5, 23, 12, 0, 0);
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
					resultBody += "<div id='reservation'>" + memberName + "</div>";
					resultBody += "</td>";
				}
				else if (thisDate>startDate&&thisDate<endDate) {
					resultBody += "";
				}
				else {
					resultBody += "<td class='timeTable'>" + "</td>";
				}
			}
			resultBody += "</tr>";
		}
		else {
			for (var j = 0; j < 30; j++) {
				var thisDate = new Date(thisYear, thisMonth, thisDay, 0, 0, 0);
				thisDate.setHours(parseInt(j/2)+8, (j%2)*30, 0);
				resultBody += "<td class='timeTable'>" + "</td>";
			}
			resultBody += "</tr>";
		}
	}
	$("tbody").html(resultBody);
	$("tbody tr").fadeOut(0);
	$("tbody tr").fadeIn(500);
	
	$("tbody tr .timeTable").not("#reserved").click(function(){
		alert("미구현 기능");
	})
}