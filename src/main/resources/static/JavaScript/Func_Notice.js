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
	    $.ajax({
	        url: "http://" + IPstring + "/notices",
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	    		var result = "";
	    		for (var i = 0; i < data.total; i++) {
	    			result += "<tr class='noticeList'>";
	    			result += "<td>" + data[i].noticeIdx + "</td>";
	    			result += "<td>" + "일반 공지" + "</td>";
	    			result += "<td>" + data[i].memberName + "</td>";
	    			result += "<td>" + data[i].subject + "</td>";
	    			result += "<td>" + data[i].hit + "</td>";
	    			result += "<td>" + data[i].regDate + "</td>";
	    			result += "<td>" + data[i].updateDate + "</td>";
	    			result += "</tr>";
	    			
	    			result += "<tr class='threadList' name='noticeNo." + data[i].noticeIdx + "'>";
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
	    		
	    		$("tbody .noticeList").click(function(){
	    			$(".threadList").css("display", "none");
	    			$(".noticeList").css("background-color", "#FFFFFF");
	    			$(".noticeList").children().css("color", "#000000");
	    			
	    			var noticeNo = "noticeNo." + $(this).children().eq(0).html();
	    			$(this).css("background-color", "#585858");
	    			$(this).children().css("color", "#FFFFFF");
	    			$("tbody [name='" + noticeNo + "']").css("display", "table-row");
	    			$("tbody [name='" + noticeNo + "'] td").fadeOut(0);
	    			$("tbody [name='" + noticeNo + "'] td").fadeIn(250);
	    		})
	        }
	    })
	});
}