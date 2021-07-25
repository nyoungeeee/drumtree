function processAjax(param0, param1) {
    $.ajax({
        url: "http://" + IPstring + "/notices",
        data: { subject: param0, content: param1 },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	var today = new Date();
			today.setHours(9, 0, 0, 0);
    		var result = "";
    		for (var i = 0; i < data.total; i++) {
    			result += "<tr onclick='openPopup()'>";
    			result += "<td>" + data[i].noticeIdx + "</td>";
    			
    			if (data[i].isImport==1) { result += "<td style='text-align:left;'>" + "<div id='important'>중요</div>&emsp;" + "<a>" + data[i].subject + "</a>" + "</td>"; }
    			else if (data[i].isImport==0) { result += "<td style='text-align:left;'>" + "<a>" + data[i].subject + "</a>" + "</td>"; }
    			
    			result += "<td>" + data[i].memberName + "</td>";
    			result += "<td>" + data[i].hit + "</td>";
    			
    			var regDay = new Date(data[i].regDate.split(" ")[0]);
    			if (today.getTime()==regDay.getTime()) { result += "<td name='" + data[i].regDate.split(" ")[0] + "'>" + data[i].regDate.split(" ")[1].substring(0,5) + "</td>"; }
    			else { result += "<td name='" + data[i].regDate.split(" ")[0] + "'>" + data[i].regDate.split(" ")[0] + "</td>"; }
    			
    			var updateDay = new Date(data[i].updateDate.split(" ")[0]);
    			if (today.getTime()==updateDay.getTime()) { result += "<td name='" + data[i].updateDate.split(" ")[0] + "'>" + data[i].updateDate.split(" ")[1].substring(0,5) + "</td>"; }
    			else { result += "<td name='" + data[i].updateDate.split(" ")[0] + "'>" + data[i].updateDate.split(" ")[0] + "</td>"; }
    			
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
    			resultPopup += "<br><hr><table id='memberInfo'>";
    			resultPopup += "<tr>" + "<td>공지 번호</td>" + "<td>" + $(this).children().eq(0).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>글쓴이</td>" + "<td>" + $(this).children().eq(2).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>공지 구분</td>" + "<td>" + "<select id='noticeType'></select>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>제목</td>" + "<td>" + "<input type='text' id='noticeSubject' spellcheck='false'>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>내용</td>" + "<td>" + "<textarea id='noticeContent'></textarea>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>파일 첨부</td>" + "<td>" + "<div id='fileList'><strong>첨부 파일 목록</strong><br><hr></div>" + "</td></tr>";
    			resultPopup += "</table><hr>";
    			resultPopup += "<input type='button' class='deleteBtn' value='제거'>";
    			resultPopup += "<input type='button' class='updateBtn' value='저장'>";
    			$(".popupBox").html(resultPopup);
    			loadEditor("#noticeContent");
    			
    			$("#memberInfo tr").eq(5).find("td").eq(1).prepend("<br>");
    			$("#memberInfo tr").eq(5).find("td").eq(1).prepend("<label class='clearBtn' onclick='clearFile()'>지우기</label>");
    			$("#memberInfo tr").eq(5).find("td").eq(1).prepend("<label class='uploadBtn' onclick='uploadFile()'>첨부</label>");
    			$("#memberInfo tr").eq(5).find("td").eq(1).prepend("<label class='fileName'><a>첨부할 파일을 선택해 주세요.</a></label>");
    			$("#memberInfo tr").eq(5).find("td").eq(1).prepend("<input type='file' id='noticeFile' style='display:none;'>");
    			$("#memberInfo tr").eq(5).find("td").eq(1).prepend("<label class='fileBtn' for='noticeFile'>파일 선택</label>");
    			$("#memberInfo #fileList").html($(this).children().eq(6).find("#fileList").html());
    			
    			$("#noticeFile").on('change',function(){
    				$(".fileName a").html($("#noticeFile")[0].files[0].name);
    				$(".fileName a").fadeOut(0);
    				$(".fileName a").fadeIn(500);
    			})
    			
    			var resultOption = "";
    			if ($(this).children().eq(1).find("#important").length==0) {
        			resultOption += "<option value=0 selected>" + "일반 공지" + "</option>";
        			resultOption += "<option value=1>" + "중요 공지" + "</option>";
    			} else if ($(this).children().eq(1).find("#important").length==1) {
        			resultOption += "<option value=0>" + "일반 공지" + "</option>";
        			resultOption += "<option value=1 selected>" + "중요 공지" + "</option>";
    			}
    			$("#noticeType").append(resultOption);
    			
    			$("#noticeSubject").val($(this).children().eq(1).find("a").html());
    			var startToDelete = $(this).children().eq(6).html().indexOf("<div");
    			var endToDelete = $(this).children().eq(6).html().indexOf("div>") + 4;
    			var toDeleteString = $(this).children().eq(6).html().substring(startToDelete, endToDelete);
    			$("#noticeContent").val($(this).children().eq(6).html().replaceAll(toDeleteString, ""));
    			
    			$(".updateBtn").attr("onclick", "updateNotice(" + $(this).children().eq(0).html() + ")");
    			$(".deleteBtn").attr("onclick", "deleteNotice(" + $(this).children().eq(0).html() + ")");
    		})
        }
    })
}

function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:10%;'>" + "번호" + "</td>";
		result += "<td style='width:40%;'>" + "제목" + "</td>";
		result += "<td style='width:10%;'>" + "글쓴이" + "</td>";
		result += "<td style='width:10%;'>" + "조회수" + "</td>";
		result += "<td style='width:15%;'>" + "등록 일자" + "</td>";
		result += "<td style='width:15%;'>" + "갱신 일자" + "</td>";
		result += "<td style='display:none;'>" + "내용" + "</td>";
		result += "</tr>";
		
		$("thead").html(result);
	});
}

function createTableBody() {
	$(document).ready(function(){
		var filterSubject = "";
		var filterContent = "";
		processAjax(filterSubject, filterContent);
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
	processAjax(filterSubject, filterContent);
}

function addNotice() {
	var resultPopup = "";
	resultPopup += "<strong>공지사항 추가</strong>";
	resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
	resultPopup += "<br><hr>";
	resultPopup += "<table id='memberInfo'>";
	resultPopup += "<tr>" + "<td>공지 구분</td>" + "<td>" + "<select id='noticeType'></select>" + "&emsp;" + "</td></tr>";
	resultPopup += "<tr>" + "<td>제목</td>" + "<td>" + "<input type='text' id='noticeSubject' spellcheck='false'>" + "</td></tr>";
	resultPopup += "<tr>" + "<td>내용</td>" + "<td>" + "<textarea id='noticeContent'></textarea>" + "</td></tr>";
	resultPopup += "<tr>" + "<td>파일 첨부</td>" + "<td>" + "<div id='fileList'><strong>첨부 파일 목록</strong><br><hr></div>" + "</td></tr>";
	resultPopup += "</table><hr>";
	resultPopup += "<input type='button' class='resetBtn' value='초기화'>";
	resultPopup += "<input type='button' class='saveBtn' value='등록'>";
	$(".popupBox").html(resultPopup);
	loadEditor("#noticeContent");
	
	$("#memberInfo tr").eq(3).find("td").eq(1).prepend("<br>");
	$("#memberInfo tr").eq(3).find("td").eq(1).prepend("<label class='clearBtn' onclick='clearFile()'>지우기</label>");
	$("#memberInfo tr").eq(3).find("td").eq(1).prepend("<label class='uploadBtn' onclick='uploadFile()'>첨부</label>");
	$("#memberInfo tr").eq(3).find("td").eq(1).prepend("<label class='fileName'><a>첨부할 파일을 선택해 주세요.</a></label>");
	$("#memberInfo tr").eq(3).find("td").eq(1).prepend("<input type='file' id='noticeFile' style='display:none;'>");
	$("#memberInfo tr").eq(3).find("td").eq(1).prepend("<label class='fileBtn' for='noticeFile'>파일 선택</label>");
	
	$("#noticeFile").on('change',function(){
		$(".fileName a").html($("#noticeFile")[0].files[0].name);
		$(".fileName a").fadeOut(0);
		$(".fileName a").fadeIn(500);
	})
	
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
	var key = $.cookie("loginInfo");
	var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
	
	var noticeType = $("#noticeType").val();	
	var noticeSubject = $("#noticeSubject").val();
	var noticeContent = "<div id='fileList'>" + $("#memberInfo #fileList").html() + "</div>" + editor.getData();
	var noticeMember = decrypt.split("&")[3];
	
	$("#errorMessageType").remove();
	
	if (noticeType=="none") {
		$("#memberInfo tr").eq(0).children().eq(1).append("<a id='errorMessageType' class='error'>!</a>");
		$("#errorMessageType").fadeOut(0);
		$("#errorMessageType").fadeIn(500);
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/write-notice",
	        data: { memberIdx: noticeMember, subject: noticeSubject, content: noticeContent, isImport: noticeType },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="WriteNotice_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="WriteNotice_OK") {
	            	alert("공지 등록이 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
		})
	}
}

function resetNotice() {
	$("#noticeSubject").val("");
	editor.setData("");
	
	$("#errorMessageType").remove();
}

function updateNotice(idx) {
	var noticeType = $("#noticeType").val();
	var noticeSubject = $("#noticeSubject").val();
	var noticeContent = "<div id='fileList'>" + $("#memberInfo #fileList").html() + "</div>" + editor.getData();
	
	$.ajax({
        url: "http://" + IPstring + "/update-notice",
        data: { noticeIdx: idx, subject: noticeSubject, content: noticeContent, isImport: noticeType },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	if (data.rt=="UpdateNotice_FAIL001") {
        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
        	}
        	else if (data.rt=="UpdateNotice_OK") {
            	alert("공지 변경이 정상적으로 완료되었습니다.");
            	window.location.reload();
        	}
        }
	})
}

function deleteNotice(idx) {
	if (confirm("공지를 제거 하시겠습니까?")==true) {
		$.ajax({
	        url: "http://" + IPstring + "/delete-notice",
	        data: { noticeIdx: idx },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="DeleteNotice_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="DeleteNotice_OK") {
	            	alert("공지 제거가 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
		})
	}
}

function uploadFile() {
	var formData = new FormData();
	var fileData = $("#noticeFile")[0].files[0];
	formData.append("upload", fileData);
	
	if (fileData==null) {
		$(".fileName a").fadeOut(0);
		$(".fileName a").fadeIn(500);
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/upload2",
	        data: formData,
	        contentType: false,
	        processData: false,
	        method: "POST",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	var startPoint = data.indexOf('"url":"') + 7;
	        	var endPoint = data.indexOf(', "name"');
	        	var fileURL = data.substring(startPoint, endPoint);
	        	
	        	var startName = data.indexOf('"name":"') + 8;
	        	var endName = data.indexOf('"}');
	        	var fileName = data.substring(startName, endName);
	        	
	        	var fileList = "<span>" + "[ " + "<a href='" + fileURL + "' target='_blank'>" + fileName + "</a>" + " ]" + "&emsp;" + "</span>";
	        	$("#memberInfo #fileList").append(fileList);
	        }
		})
	}
}

function clearFile() {
	$("#memberInfo #fileList span").remove();
}