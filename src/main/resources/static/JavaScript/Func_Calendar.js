function selectMonth() {
	$(document).ready(function(){
		var today = new Date();
		$("#month").val(today.toISOString().slice(0,7));
		var currentYear = Number($("#month").val().slice(0,4));
		var currentMonth = Number($("#month").val().slice(5,7))-1;
		createMonthlyCalendar(currentYear, currentMonth);
		
		$('#month').change(function(){
			var currentYear = Number($("#month").val().slice(0,4));
			var currentMonth = Number($("#month").val().slice(5,7))-1;
			createMonthlyCalendar(currentYear, currentMonth);
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
	createMonthlyCalendar(changeYear, changeMonth);
}

function createMonthlyCalendar(currentYear, currentMonth) {
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
		$("tbody tr").eq(row).children().eq(currentWeek).append(month + "-" + day + "<a style='float:right'></a>" + "<hr>");
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
	$("tbody td:contains('" + now + "')").css("background", "#E6E6E6");
	$("tbody td:contains('" + now + "')").css("font-weight", "bold");
	$("tbody td").not("td:contains('" + $("#month").val() + "')").css("color", "#D8D8D8");
	
	var reservation = "<div id='reservation'>" + "[ 레슨 ]" + "&nbsp;" + "09:00 ~ 12:30" + "<a style='float:right'>" + "조*영" + "</a>" + "</div>";
	reservation += "<div id='reservation'>" + "[ 연습실3 ]" + "&nbsp;" + "09:00 ~ 12:30" + "<a style='float:right'>" + "조*영" + "</a>" + "</div>";
	reservation += "<div id='reservation'>" + "[ 연습실4 ]" + "&nbsp;" + "09:00 ~ 12:30" + "<a style='float:right'>" + "조*영" + "</a>" + "</div>";
	reservation += "<div id='reservation'>" + "[ 연습실5 ]" + "&nbsp;" + "09:00 ~ 12:30" + "<a style='float:right'>" + "조*영" + "</a>" + "</div>";
	$("tbody td:contains('" + now + "')").find("#reservationList").append(reservation);
	
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
}