function processAjax(param0, param1, param2) {
    $.ajax({
        url: "http://" + IPstring + "/members?isApproval=0",
        data: { memberID: param0, memberName: param1, memo: param2 },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	var today = new Date();
			today.setHours(9, 0, 0, 0);
    		var result = "";
    		for (var i = 0; i < data.total; i++) {
    			result += "<tr onclick='openPopup()'>";
    			
    			var signinDay = new Date(data[i].signinDate.split(" ")[0]);
    			if (today.getTime()==signinDay.getTime()) { result += "<td name='" + data[i].signinDate.substring(0,16) + "'>" + data[i].signinDate.split(" ")[1].substring(0,5) + "</td>"; }
    			else { result += "<td name='" + data[i].signinDate.substring(0,16) + "'>" + data[i].signinDate.split(" ")[0] + "</td>"; }
    			
    			result += "<td>" + data[i].memberIdx + "</td>";
    			result += "<td>" + data[i].memberID + "</td>";
    			result += "<td>" + data[i].memberName + "</td>";
    			result += "<td>" + data[i].memo + "</td>";
    			result += "</tr>";
    		}
    		$("tbody").html(result);
    		$("tbody tr").fadeOut(0);
    		$("tbody tr").fadeIn(500);
    		
    		$("tbody tr").click(function(){
    			var resultPopup = "";
    			resultPopup += "<strong>회원 정보</strong>";
    			resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
    			resultPopup += "<br><br><hr><br>";
    			resultPopup += "<table id='memberInfo'>";
    			resultPopup += "<tr>" + "<td>요청 일자</td>" + "<td>" + $(this).children().eq(0).attr("name") + "</td></tr>";
    			resultPopup += "<tr>" + "<td>회원 번호</td>" + "<td>" + $(this).children().eq(1).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>아이디</td>" + "<td>" + $(this).children().eq(2).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>닉네임</td>" + "<td>" + $(this).children().eq(3).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>회원 메모</td>" + "<td>" + $(this).children().eq(4).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>회원 등급</td>" + "<td>" + "<select id='memberGrade'></select>" + "&emsp;" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>관리자 메모</td>" + "<td>" + "<textarea id='memoAdmin' spellcheck='false'></textarea>" + "</td></tr>";
    			resultPopup += "</table><br><hr><br>";
    			resultPopup += "<input type='button' class='rejectBtn' value='반려'>";
    			resultPopup += "<input type='button' class='approvalBtn' value='승인'>";
    			$(".popupBox").html(resultPopup);
    			
    			var resultOption = "";
    			resultOption += "<option value='none' selected>" + "" + "</option>";
    			resultOption += "<option value=1>" + "손님" + "</option>";
    			resultOption += "<option value=2>" + "연습생" + "</option>";
    			resultOption += "<option value=3>" + "레슨생" + "</option>";
    			$("#memberGrade").append(resultOption);
    			
    			$(".approvalBtn").attr("onclick", "approvalMember(" + $(this).children().eq(1).html() + ")");
    			$(".rejectBtn").attr("onclick", "rejectMember(" + $(this).children().eq(1).html() + ")");
    		})
        }
    })
}

function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:15%;'>" + "요청 일자" + "</td>";
		result += "<td style='width:15%;'>" + "회원 번호" + "</td>";
		result += "<td style='width:15%;'>" + "아이디" + "</td>";
		result += "<td style='width:15%;'>" + "닉네임" + "</td>";
		result += "<td style='width:55%;'>" + "회원 메모" + "</td>";
		result += "</tr>";
		
		$("thead").html(result);
	});
}

function createTableBody() {
	$(document).ready(function(){
		var filterID = "";
		var filterName = "";
		var filterMemo = "";
		processAjax(filterID, filterName, filterMemo);
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

function approvalMember(idx) {
	var grade = $("#memberGrade").val();
	var memo = $("#memoAdmin").val().replaceAll("\n", "<br>");
	
	$("#errorMessageGrade").remove();
	
	if (grade=="none") {
		$("#memberInfo tr").eq(5).children().eq(1).append("<a id='errorMessageGrade' class='error'>!</a>");
		$("#errorMessageGrade").fadeOut(0);
		$("#errorMessageGrade").fadeIn(500);
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/approval-member",
	        data: { memberIdx: idx, memberGrade: grade, memoAdmin: memo },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="ApprovalMember_FAIL001") {
	        		alert("존재하지 않는 회원 번호입니다.");
	        	}
	        	else if (data.rt=="ApprovalMember_FAIL002") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="ApprovalMember_OK") {
	            	alert("승인이 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
		})
	}
}

function rejectMember(idx) {
	if (confirm("회원 등록 요청을 반려 하시겠습니까?")==true) {
	    $.ajax({
	        url: "http://" + IPstring + "/delete-member",
	        data: { memberIdx: idx },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="DeleteMember_FAIL001") {
	        		alert("존재하지 않는 회원 번호입니다.");
	        	}
	        	else if (data.rt=="DeleteMember_FAIL002") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="DeleteMember_OK") {
	            	alert("반려가 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
	    })
	}
}

function filterMember() {
	var filterType = $("#filterType").val();
	var filterID = "";
	var filterName = "";
	var filterMemo = "";
	if (filterType=="id") {
		var filterID = $("#filter").val();
	}
	else if (filterType=="name") {
		var filterName = $("#filter").val();
	}
	else if (filterType=="memo") {
		var filterMemo = $("#filter").val();
	}
	processAjax(filterID, filterName, filterMemo);
}