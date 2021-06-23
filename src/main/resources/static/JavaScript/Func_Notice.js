function processAjax(param0, param1) {
    $.ajax({
        url: "http://" + IPstring + "/notices",
        data: { subject: param0, content: param1 },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
    		var result = "";
    		for (var i = 0; i < data.total; i++) {
    			result += "<tr class='noticeList' name='noticeNo." + data[i].noticeIdx + "'>";
    			result += "<td>" + data[i].noticeIdx + "</td>";
    			
    			if (data[i].isImport==0) { result += "<td>" + "일반 공지" + "</td>"; }
    			else if (data[i].isImport==1) { result += "<td>" + "중요 공지" + "</td>"; }
    			
    			result += "<td>" + data[i].memberName + "</td>";
    			result += "<td>" + data[i].subject + "</td>";
    			result += "<td>" + data[i].hit + "</td>";
    			result += "<td>" + data[i].regDate + "</td>";
    			result += "<td>" + data[i].updateDate + "</td>";
    			result += "</tr>";
    			
    			result += "<tr class='threadList' name='threadNo." + data[i].noticeIdx + "'>";
    			result += "<td colspan=7>";
    			result += "<div id='noticeSubject'>" + data[i].subject + "</div>";
    			result += "<br><hr>";
    			result += "<div id='noticeName'>" + "<strong>글쓴이:</strong>&nbsp;" + data[i].memberName + "</div>";
    			result += "<div id='noticeSeparator'>" + "&nbsp;│&nbsp;" + "</div>";
    			result += "<div id='noticeHit'>" + "<strong>조회수:</strong>&nbsp;" + data[i].hit + "</div>";
    			result += "<div id='noticeSeparator'>" + "&nbsp;│&nbsp;" + "</div>";
    			result += "<div id='noticeDate'>" + data[i].updateDate + "</div>";
    			result += "<br><br>";
    			result += "<div id='noticeContent'>" + data[i].content + "</div>";
    			result += "</td>";
    			result += "</tr>";
    		}
    		$("tbody").html(result);
    		$("tbody .noticeList").fadeOut(0);
    		$("tbody .noticeList").fadeIn(500);
    		
    		$("tbody .noticeList").click(function(){
    			$(".threadList").css("display", "none");
    			$(".noticeList").css("background-color", "#FFFFFF");
    			$(".noticeList").children().css("color", "#000000");
    			
    			var threadNo = "threadNo." + $(this).children().eq(0).html();
    			$(this).css("background-color", "#585858");
    			$(this).children().css("color", "#FFFFFF");
    			$(".threadList[name='" + threadNo + "']").css("display", "table-row");
    			$(".threadList[name='" + threadNo + "'] td").fadeOut(0);
    			$(".threadList[name='" + threadNo + "'] td").fadeIn(250);
    			
    			$.ajax({
	    			url: "http://" + IPstring + "/notices",
	    			data: { noticeIdx: $(this).children().eq(0).html() },
	    			method: "POST",
					dataType: "JSON",
					error: function() { alert("데이터 로드 실패"); },
					success: function(data) {
						$(".noticeList[name='" + "noticeNo." + data[0].noticeIdx + "']").children().eq(4).html(data[0].hit);
						$(".threadList[name='" + "threadNo." + data[0].noticeIdx + "']").find("#noticeHit").html("<strong>조회수:</strong>&nbsp;" + data[0].hit);
					}
    			})
    		})
        }
    })
}

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