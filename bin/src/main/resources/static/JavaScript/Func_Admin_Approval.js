function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:15%;'>" + "요청 시간" + "</td>";
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
	    $.ajax({
	        url: "http://" + IPstring + "/members?isApproval=0",
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	    		var result = "";
	    		for (var i = 0; i < data.total; i++) {
	    			result += "<tr onclick='openPopup()'>";
	    			result += "<td>" + data[i].signinDate + "</td>";
	    			result += "<td>" + data[i].memberIdx + "</td>";
	    			result += "<td>" + data[i].memberID + "</td>";
	    			result += "<td>" + data[i].memberName + "</td>";
	    			result += "<td>" + data[i].memo + "</td>";
	    			result += "</tr>";
	    		}
	    		$("tbody").html(result);
	    		
	    		$("tbody tr").click(function(){
	    			var resultPopup = "";
	    			resultPopup += "<strong>회원 정보</strong>";
	    			resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
	    			resultPopup += "<br><br><hr><br>";
	    			resultPopup += "<table id='memberInfo'>";
	    			resultPopup += "<tr>" + "<td>요청 시간</td>" + "<td>" + $(this).children().eq(0).html() + "</td></tr>";
	    			resultPopup += "<tr>" + "<td>회원 번호</td>" + "<td>" + $(this).children().eq(1).html() + "</td></tr>";
	    			resultPopup += "<tr>" + "<td>아이디</td>" + "<td>" + $(this).children().eq(2).html() + "</td></tr>";
	    			resultPopup += "<tr>" + "<td>닉네임</td>" + "<td>" + $(this).children().eq(3).html() + "</td></tr>";
	    			resultPopup += "<tr>" + "<td>회원 메모</td>" + "<td>" + $(this).children().eq(4).html() + "</td></tr>";
	    			resultPopup += "<tr>" + "<td>회원 등급</td>" + "<td>" + "<select id='memberGrade'></select>" + "</td></tr>";
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
	    			$("select").append(resultOption);
	    			
	    			$(".approvalBtn").attr("onclick", "approvalMember(" + $(this).children().eq(1).html() + ")");
	    			$(".rejectBtn").attr("onclick", "rejectMember(" + $(this).children().eq(1).html() + ")");
	    		})
	        }
	    })
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
	if (grade=="none") {
		alert("회원 등급을 설정해 주세요.");
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/approval-member",
	        data: { memberIdx: idx, memberGrade: grade, memoAdmin: memo },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function() {
	        	alert("APPROVAL SUCCESS");
	        	window.location.reload();
	        }
		})
	}
}

function rejectMember(idx) {
    $.ajax({
        url: "http://" + IPstring + "/delete-member",
        data: { memberIdx: idx },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function() {
        	alert("REJECT SUCCESS");
        	window.location.reload();
        }
    })
}