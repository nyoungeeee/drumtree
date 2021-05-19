function selectCurrentMenu() {
	$(document).ready(function(){
		$(".menuName").eq(3).css("background-color", "#BDBDBD");
		$(".menuName").eq(3).children().css("color", "#000000");
		$(".subMenuName").css("visibility", "visible");
		$(".subMenuName").eq(2).children().css("font-weight", "bold");
	});
}

function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:10%;'>" + "회원 번호" + "</td>";
		result += "<td style='width:10%;'>" + "닉네임" + "</td>";
		result += "<td style='width:50%;'>" + "메모" + "</td>";
		result += "<td style='width:15%;'>" + "정보 변경" + "</td>";
		result += "<td style='width:15%;'>" + "제거" + "</td>";
		result += "</tr>";
		
		$("thead").html(result);
	});
}

function createTableBody(IPstring) {
	$(document).ready(function(){
	    $.ajax({
	        url: "http://" + IPstring + "/members?isApproval=1"
	        ,method: "POST"
	        ,success: function(data){
	    		var result = "";
	    		for (var i = 0; i < data.total; i++) {
	    			result += "<tr>";
	    			result += "<td>" + data[i].memberIdx + "</td>";
	    			result += "<td>" + data[i].memberID + "</td>";
	    			result += "<td>" + data[i].memo + "</td>";
	    			result += "<td>" + "<input type='button' class='editBtn' value='정보 변경'" + "</td>";
	    			result += "<td>" + "<input type='button' class='deleteBtn' value='제거'>" + "</td>";
	    			result += "</tr>";
	    		}
	    		$("tbody").html(result);
	        }
	    	,error: function(){
	    		alert("데이터 로드 실패");
	        }
	    })
	});
}