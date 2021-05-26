function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:5%;'>" + "번호" + "</td>";
		result += "<td style='width:10%;'>" + "구분" + "</td>";
		result += "<td style='width:10%;'>" + "글쓴이" + "</td>";
		result += "<td style='width:45%;'>" + "제목" + "</td>";
		result += "<td style='width:10%;'>" + "조회수" + "</td>";
		result += "<td style='width:10%;'>" + "등록 시간" + "</td>";
		result += "<td style='width:10%;'>" + "갱신 시간" + "</td>";
		result += "<td style='display:none;'>" + "내용" + "</td>";
		result += "</tr>";
		
		$("thead").html(result);
	});
}

function createTableBody() {
	$(document).ready(function(){
	    $.ajax({
	        url: "http://" + IPstring + "/notices",
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	    		var result = "";
	    		for (var i = 0; i < data.total; i++) {
	    			result += "<tr onclick='openPopup()'>";
	    			result += "<td>" + data[i].noticeIdx + "</td>";
	    			result += "<td>" + "일반 공지" + "</td>";
	    			result += "<td>" + data[i].memberName + "</td>";
	    			result += "<td>" + data[i].subject + "</td>";
	    			result += "<td>" + data[i].hit + "</td>";
	    			result += "<td>" + data[i].regDate + "</td>";
	    			result += "<td>" + data[i].updateDate + "</td>";
	    			result += "<td style='display:none;'>" + data[i].content + "</td>";
	    			result += "</tr>";
	    		}
	    		$("tbody").html(result);
	    		
	    		$("tbody tr").click(function(){
	    			var resultPopup = "";
	    			resultPopup += "<strong>공지사항 정보</strong>";
	    			resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
	    			resultPopup += "<br><br><hr><br>";
	    			resultPopup += "<table id='memberInfo'>";
	    			resultPopup += "<tr>" + "<td>공지 번호</td>" + "<td>" + $(this).children().eq(0).html() + "</td></tr>";
	    			resultPopup += "<tr>" + "<td>공지 구분</td>" + "<td>" + $(this).children().eq(1).html() + "</td></tr>";
	    			resultPopup += "<tr>" + "<td>글쓴이</td>" + "<td>" + $(this).children().eq(2).html() + "</td></tr>";
	    			resultPopup += "<tr>" + "<td>제목</td>" + "<td>" + "<input type='text' id='noticeSubject' spellcheck='false'>" + "</td></tr>";
	    			resultPopup += "<tr>" + "<td>내용</td>" + "<td>" + "<textarea id='noticeContent' spellcheck='false'></textarea>" + "</td></tr>";
	    			resultPopup += "</table><br><hr><br>";
	    			resultPopup += "<input type='button' class='deleteBtn' value='제거'>";
	    			resultPopup += "<input type='button' class='updateBtn' value='저장'>";
	    			$(".popupBox").html(resultPopup);
	    			
	    			$("#noticeSubject").val($(this).children().eq(3).html().replaceAll("<br>", "\n"));
	    			$("#noticeContent").val($(this).children().eq(7).html().replaceAll("<br>", "\n"));
	    			
	    			$(".updateBtn").attr("onclick", "updateNotice(" + $(this).children().eq(0).html() + ")");
	    			$(".deleteBtn").attr("onclick", "deleteNotice(" + $(this).children().eq(0).html() + ")");
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

function filterNotice() {
	var filterType = $("#filterType").val();
	var filterSubject = "";
	var filterContent = "";
	if (filterType=="subject") {
		var filterSubject = $("#filter").val();
	}
	else if (filterType=="content") {
		var filterContent = $("#filter").val();
	}

    $.ajax({
        url: "http://" + IPstring + "/notices",
        data: { subject: filterSubject, content: filterContent },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
    		var result = "";
    		for (var i = 0; i < data.total; i++) {
    			result += "<tr onclick='openPopup()'>";
    			result += "<td>" + data[i].noticeIdx + "</td>";
    			result += "<td>" + "일반 공지" + "</td>";
    			result += "<td>" + data[i].memberName + "</td>";
    			result += "<td>" + data[i].subject + "</td>";
    			result += "<td>" + data[i].hit + "</td>";
    			result += "<td>" + data[i].regDate + "</td>";
    			result += "<td>" + data[i].updateDate + "</td>";
    			result += "<td style='display:none;'>" + data[i].content + "</td>";
    			result += "</tr>";
    		}
    		$("tbody").html(result);
    		$("tbody tr").fadeOut(0);
    		$("tbody tr").fadeIn(500);
    		
    		$("tbody tr").click(function(){
    			var resultPopup = "";
    			resultPopup += "<strong>공지사항 정보</strong>";
    			resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
    			resultPopup += "<br><br><hr><br>";
    			resultPopup += "<table id='memberInfo'>";
    			resultPopup += "<tr>" + "<td>공지 번호</td>" + "<td>" + $(this).children().eq(0).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>공지 구분</td>" + "<td>" + $(this).children().eq(1).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>글쓴이</td>" + "<td>" + $(this).children().eq(2).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>제목</td>" + "<td>" + "<input type='text' id='noticeSubject' spellcheck='false'>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>내용</td>" + "<td>" + "<textarea id='noticeContent' spellcheck='false'></textarea>" + "</td></tr>";
    			resultPopup += "</table><br><hr><br>";
    			resultPopup += "<input type='button' class='deleteBtn' value='제거'>";
    			resultPopup += "<input type='button' class='updateBtn' value='저장'>";
    			$(".popupBox").html(resultPopup);
    			
    			$("#noticeSubject").val($(this).children().eq(3).html().replaceAll("<br>", "\n"));
    			$("#noticeContent").val($(this).children().eq(7).html().replaceAll("<br>", "\n"));
    			
    			$(".updateBtn").attr("onclick", "updateNotice(" + $(this).children().eq(0).html() + ")");
    			$(".deleteBtn").attr("onclick", "deleteNotice(" + $(this).children().eq(0).html() + ")");
    		})
        }
    })
}

function addNotice() {
	var resultPopup = "";
	resultPopup += "<strong>공지사항 추가</strong>";
	resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
	resultPopup += "<br><br><hr><br>";
	resultPopup += "<table id='memberInfo'>";
	resultPopup += "<tr>" + "<td>공지 구분</td>" + "<td>" + "<select id='noticeType'></select>" + "</td></tr>";
	resultPopup += "<tr>" + "<td>제목</td>" + "<td>" + "<input type='text' id='noticeSubject' spellcheck='false'>" + "</td></tr>";
	resultPopup += "<tr>" + "<td>내용</td>" + "<td>" + "<textarea id='noticeContent' spellcheck='false'></textarea>" + "</td></tr>";
	resultPopup += "</table><br><hr><br>";
	resultPopup += "<input type='button' class='resetBtn' value='초기화'>";
	resultPopup += "<input type='button' class='saveBtn' value='저장'>";
	$(".popupBox").html(resultPopup);
	
	var resultOption = "";
	resultOption += "<option value='none' selected>" + "" + "</option>";
	resultOption += "<option value=0>" + "일반 공지" + "</option>";
	resultOption += "<option value=1>" + "중요 공지" + "</option>";
	$("#noticeType").append(resultOption);
	
	$(".saveBtn").attr("onclick", "saveNotice()");
	$(".resetBtn").attr("onclick", "resetNotice()");
	
	openPopup();
}

function saveNotice() {
	var noticeType = $("#noticeType").val();
	
	$("#errorMessageType").remove();
	
	if (noticeType=="none") {
		$("#memberInfo tr").eq(0).children().eq(1).append("<a id='errorMessageType' style='color:red;'>&emsp;<strong>공지 구분 선택 필수</strong></a>");
		$("#errorMessageType").fadeOut(0);
		$("#errorMessageType").fadeIn(500);
	}
	else {
		alert("미구현 기능입니다.");
	}
}

function resetNotice() {
	$("#noticeSubject").val("");
	$("#noticeContent").val("");
	
	$("#errorMessageType").remove();
}

function updateNotice(idx) {
	alert("미구현 기능입니다.");
}

function deleteNotice(idx) {
	alert("미구현 기능입니다.");
}