function selectCurrentMenu() {
	$(document).ready(function(){
		$(".menuName").eq(0).css("background-color", "#BDBDBD");
		$(".menuName").eq(0).children().css("color", "#000000");
	});
}

function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:10%;'>" + "번호" + "</td>";
		result += "<td style='width:25%;'>" + "날짜" + "</td>";
		result += "<td style='width:65%;'>" + "제목" + "</td>";
		result += "</tr>";
		
		$("thead").html(result);
	});
}

function createTableBody() {
	$(document).ready(function(){
		var result = "";
		
		for (var i = 0; i < 100; i++) {
			result += "<tr onclick='openPopup()'>";
			result += "<td>" + (i+1) + "</td>";
			result += "<td>" + "2021-03-21" + "</td>";
			result += "<td>" + "안녕하세요." + "</td>";
			result += "</tr>";
		}
		
		$("tbody").html(result);
	});
}

function createPopupBox() {
	$(document).ready(function(){
		var result = "";
		result += "<input type='button' value='닫기' class='closeButton' onclick='closePopup()'>";
		
		$(".popupBox").html(result);
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