function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:10%;'>" + "회원 번호" + "</td>";
		result += "<td style='width:10%;'>" + "회원 등급" + "</td>";
		result += "<td style='width:10%;'>" + "아이디" + "</td>";
		result += "<td style='width:10%;'>" + "닉네임" + "</td>";
		result += "<td style='width:25%;'>" + "회원 메모" + "</td>";
		result += "<td style='width:25%;'>" + "관리자 메모" + "</td>";
		result += "<td style='width:5%;'>" + "정보 변경" + "</td>";
		result += "<td style='width:5%;'>" + "제거" + "</td>";
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
	    			
	    			if (data[i].memberGrade==0) {
	    				var gradeString = "비회원";
	    			} else if (data[i].memberGrade==1) {
	    				var gradeString = "손님";
	    			} else if (data[i].memberGrade==2) {
	    				var gradeString = "연습생";
	    			} else if (data[i].memberGrade==3) {
	    				var gradeString = "레슨생";
	    			} else if (data[i].memberGrade==99) {
	    				var gradeString = "관리자";
	    			}
	    			
	    			result += "<td>" + gradeString + "</td>";
	    			result += "<td>" + data[i].memberID + "</td>";
	    			result += "<td>" + data[i].memberName + "</td>";
	    			result += "<td>" + data[i].memo + "</td>";
	    			result += "<td>" + data[i].memoAdmin + "</td>";
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