function selectCurrentMenu() {
	$(document).ready(function(){
		$(".menuName").eq(1).css("background-color", "#CFBEB7");
		$(".menuName").eq(1).children().css("color", "#481B07");
	});
}

function selectMonth() {
	$(document).ready(function(){
		var today = new Date();
		$("#month").val(today.toISOString().slice(0,7));
		var currentYear = Number($("#month").val().slice(0,4));
		var currentMonth = Number($("#month").val().slice(5,7))-1;
		createMonthlyCalendar(currentYear, currentMonth, 0);
		
		$('#month').change(function(){
			var currentYear = Number($("#month").val().slice(0,4));
			var currentMonth = Number($("#month").val().slice(5,7))-1;
			createMonthlyCalendar(currentYear, currentMonth, 1);
		})
	});
}

function clickArrow(addValue) {
	var currentYear = Number($("#month").val().slice(0,4));
	var currentMonth = Number($("#month").val().slice(5,7));
	var currentDate = new Date(currentYear, currentMonth+addValue, 1);
	$("#month").val(currentDate.toISOString().slice(0,7));
	
	var changeYear = Number($("#month").val().slice(0,4));
	var changeMonth = Number($("#month").val().slice(5,7))-1;
	createMonthlyCalendar(changeYear, changeMonth, 1);
}

function createMonthlyCalendar(currentYear, currentMonth, eventType) {
	$(document).ready(function(){
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
		
		var firstDay = new Date(currentYear,currentMonth,1);
		var firstWeek = firstDay.getDay();
		for (var j = (0-firstWeek); j < (42-firstWeek); j++) {
			var currentDay = new Date(currentYear,currentMonth,1);
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
			$("tbody tr").eq(row).children().eq(currentWeek).append(month + "-" + day + "<hr>");
			$("tbody tr").eq(row).children().eq(currentWeek).append("<div id='realTime'>" + year + "-" + month + "-" + day + "</div>");
			$("tbody tr").eq(row).children().eq(currentWeek).append("<div id='reservationList'>" + "</div>");
		}
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
		$("tbody td:contains('" + now + "')").css("background", "#DDE5C0");
		$("tbody td").not("td:contains('" + $("#month").val() + "')").css("color", "#D8D8D8");
		
		var reservation = "<input type='button' id='reservation' value='" + "[00:00] " + "닉네임" + "'>";
		reservation += "<input type='button' id='reservation' value='" + "[00:00] " + "닉네임" + "'>";
		reservation += "<input type='button' id='reservation' value='" + "[00:00] " + "닉네임" + "'>";
		reservation += "<input type='button' id='reservation' value='" + "[00:00] " + "닉네임" + "'>";
		reservation += "<input type='button' id='reservation' value='" + "[00:00] " + "닉네임" + "'>";
		$("tbody td:contains('" + now + "')").find("#reservationList").append(reservation);
		
		var lastRow = $("tbody tr").eq(5).children().not("td:contains('" + $("#month").val() + "')").length;
		if (lastRow==7) {
			$("tbody tr").eq(5).css("display", "none");
		}

		if (eventType==1) {
			$("tbody tr td").fadeOut(0);
			$("tbody tr td").fadeIn(500);
		}	
	});
}