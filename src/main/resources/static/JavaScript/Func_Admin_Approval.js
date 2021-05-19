function selectCurrentMenu() {
	$(document).ready(function(){
		$(".menuName").eq(3).css("background-color", "#BDBDBD");
		$(".menuName").eq(3).children().css("color", "#000000");
		$(".subMenuName").css("visibility", "visible");
		$(".subMenuName").eq(1).children().css("font-weight", "bold");
	});
}

function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:10%;'>" + "요청 시간" + "</td>";
		result += "<td style='width:10%;'>" + "회원 번호" + "</td>";
		result += "<td style='width:15%;'>" + "닉네임" + "</td>";
		result += "<td style='width:45%;'>" + "메모" + "</td>";
		result += "<td style='width:10%;'>" + "승인" + "</td>";
		result += "<td style='width:10%;'>" + "반려" + "</td>";
		result += "</tr>";
		
		$("thead").html(result);
	});
}

function createTableBody() {
	$(document).ready(function(){
	    $.ajax({
	        url: "http://" + IPstring + "/members?isApproval=0"
	        ,method: "POST"
	        ,success: function(data){
	    		var result = "";
	    		for (var i = 0; i < data.total; i++) {
	    			result += "<tr>";
	    			result += "<td>" + data[i].signinDate + "</td>";
	    			result += "<td>" + data[i].memberIdx + "</td>";
	    			result += "<td>" + data[i].memberID + "</td>";
	    			result += "<td>" + data[i].memo + "</td>";
	    			result += "<td>" + "<input type='button' class='approvalBtn' value='승인' onclick='approvalMember(" + data[i].memberIdx + ")'>" + "</td>";
	    			result += "<td>" + "<input type='button' class='rejectBtn' value='반려' onclick='rejectMember(" + data[i].memberIdx + ")'>" + "</td>";
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

function approvalMember(arg) {
    $.ajax({
        url: "http://" + IPstring + "/approval-member"
        ,data: { memberIdx: arg }
        ,method: "POST"
        ,success: function(){
        	alert("회원 등록 요청 성공 ^^!");
        	window.location.reload();
        }
    	,error: function(){
    		alert("회원 등록 요청 실패 ㅠㅠ");
        }
    })
}

function rejectMember(arg) {
    $.ajax({
        url: "http://" + IPstring + "/delete-member"
        ,data: { memberIdx: arg }
        ,method: "POST"
        ,success: function(){
        	alert("회원 등록 반려 성공 ^^!");
        	window.location.reload();
        }
    	,error: function(){
    		alert("회원 등록 반려 실패 ㅠㅠ");
        }
    })
}