function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:10%;'>" + "번호" + "</td>";
		result += "<td style='width:40%;'>" + "제목" + "</td>";
		result += "<td style='width:10%;'>" + "글쓴이" + "</td>";
		result += "<td style='width:10%;'>" + "조회수" + "</td>";
		result += "<td style='width:15%;'>" + "등록 시간" + "</td>";
		result += "<td style='width:15%;'>" + "갱신 시간" + "</td>";
		result += "<td style='display:none;'>" + "내용" + "</td>";
		result += "</tr>";
		
		$("thead").html(result);
	});
}

function createTableBody() {
	$(document).ready(function(){

	});
}

function filterPayment() {
	
}