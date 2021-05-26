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
	
	var startDate = new Date(2021, 4, 26, 10, 0, 0);
	var endDate = new Date(2021, 4, 26, 12, 30, 0);
	var memberName = "녕이"
	var roomNo = 1;
	
	var resultBody = "";
	for (var i = 0; i < 3; i++) {
		resultBody += "<tr>";
		if (i==0) {
			resultBody += "<td style='background-color:#D8D8D8;'>" + "레슨" + "</td>";
		}
		else {
			resultBody += "<td style='background-color:#D8D8D8;'>" + "연습실" + i + "</td>";
		}
		
		if (i==roomNo) {
			for (var j = 0; j < 15; j++) {
				var thisDate = new Date(thisYear, thisMonth, thisDay, 0, 0, 0);
				
				thisDate.setHours(j+8, 0, 0);
				if (thisDate>=startDate&&thisDate<=endDate) { resultBody += "<td class='timeTable' id='reserved'>" + memberName + "</td>"; }
				else { resultBody += "<td class='timeTable'>" + "</td>"; }
				
				thisDate.setHours(j+8, 30, 0);
				if (thisDate>=startDate&&thisDate<=endDate) { resultBody += "<td class='timeTable' id='reserved'>" + memberName + "</td>"; }
				else { resultBody += "<td class='timeTable'>" + "</td>"; }
			}
			resultBody += "</tr>";
		}
		else {
			for (var j = 0; j < 15; j++) {
				var thisDate = new Date(thisYear, thisMonth, thisDay, 0, 0, 0);
				thisDate.setHours(j+8, 0, 0);
				resultBody += "<td class='timeTable'>" + "</td>";
				thisDate.setHours(j+8, 30, 0);
				resultBody += "<td class='timeTable'>" + "</td>";
			}
			resultBody += "</tr>";
		}
	}
	$("tbody").html(resultBody);
	$("tbody tr").fadeOut(0);
	$("tbody tr").fadeIn(500);
	
	$("tbody tr .timeTable").click(function(){
		alert("미구현 기능");
	})
}