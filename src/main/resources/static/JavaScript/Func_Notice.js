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
    			result += "<tr class='noticeList' name='noticeNo." + data[i].noticeIdx + "'>";
    			result += "<td>" + data[i].noticeIdx + "</td>";
    			
    			if (data[i].isImport==1) { result += "<td style='text-align:left;'>" + "<div>중요</div>&emsp;" + "<a>" + data[i].subject + "</a>" + "</td>"; }
    			else if (data[i].isImport==0) { result += "<td style='text-align:left;'>" + "<a>" + data[i].subject + "</a>" + "</td>"; }
    			
    			result += "<td>" + data[i].memberName + "</td>";
    			result += "<td>" + data[i].hit + "</td>";
    			
    			var regDay = new Date(data[i].regDate.split(" ")[0]);
    			if (today.getTime()==regDay.getTime()) { result += "<td name='" + data[i].regDate.split(" ")[0] + "'>" + data[i].regDate.split(" ")[1].substring(0,5) + "</td>"; }
    			else { result += "<td name='" + data[i].regDate.split(" ")[0] + "'>" + data[i].regDate.split(" ")[0] + "</td>"; }
    			
    			var updateDay = new Date(data[i].updateDate.split(" ")[0]);
    			if (today.getTime()==updateDay.getTime()) { result += "<td name='" + data[i].updateDate.split(" ")[0] + "'>" + data[i].updateDate.split(" ")[1].substring(0,5) + "</td>"; }
    			else { result += "<td name='" + data[i].updateDate.split(" ")[0] + "'>" + data[i].updateDate.split(" ")[0] + "</td>"; }
    			result += "</tr>";
    			
    			result += "<tr class='threadList' name='threadNo." + data[i].noticeIdx + "'>";
    			result += "<td colspan=6>";
    			result += "<div id='noticeSubject'>" + data[i].subject + "</div>";
    			result += "<br><hr>";
    			result += "<div id='noticeName'>" + "<strong>글쓴이:</strong>&nbsp;" + data[i].memberName + "</div>";
    			result += "<div id='noticeSeparator'>" + "&nbsp;│&nbsp;" + "</div>";
    			result += "<div id='noticeHit'>" + "<strong>조회수:</strong>&nbsp;" + data[i].hit + "</div>";
    			result += "<div id='noticeSeparator'>" + "&nbsp;│&nbsp;" + "</div>";
    			result += "<div id='noticeDate'>" + data[i].updateDate.substring(0,16) + "</div>";
    			result += "<br><br>";
    			result += "<div id='noticeContent'>" + data[i].content + "</div>";
    			result += "</td>";
    			result += "</tr>";
    		}
    		$("tbody").html(result);
    		$("tbody .noticeList").fadeOut(0);
    		$("tbody .noticeList").fadeIn(500);
    		
    		
    		
    		$("tbody .noticeList").click(function(){
    			var threadNo = "threadNo." + $(this).children().eq(0).html();
    			
    			if ($(".threadList[name='" + threadNo + "']").css("display")=="table-row") {
    				$(this).css("background-color", "");
    				$(this).css("border", "");
    				$(this).css("border-bottom", "1px solid #A4A4A4");
    				$(this).children().css("color", "");
    				$(".threadList[name='" + threadNo + "']").css("display", "none");
    			}
    			else {
    				var fileCount = $(".threadList[name='" + threadNo + "'] #fileList span").length;
    				if (fileCount==0) {
						$(".threadList[name='" + threadNo + "'] #fileList").css("display", "none");
					}
    				
    				$(".threadList").css("display", "none");
        			$(".noticeList").css("background-color", "");
        			$(".noticeList").css("border", "");
        			$(".noticeList").css("border-bottom", "1px solid #A4A4A4");
        			$(".noticeList").children().css("color", "");
        			$(this).css("background-color", "#585858");
        			$(this).css("border-top", "2px solid #585858");
        			$(this).css("border-bottom", "1px solid #585858");
        			$(this).css("border-left", "1px solid #585858");
        			$(this).css("border-right", "1px solid #585858");
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
    						$(".noticeList[name='" + "noticeNo." + data[0].noticeIdx + "']").children().eq(3).html(data[0].hit);
    						$(".threadList[name='" + "threadNo." + data[0].noticeIdx + "']").find("#noticeHit").html("<strong>조회수:</strong>&nbsp;" + data[0].hit);
    					}
        			})
    			}
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