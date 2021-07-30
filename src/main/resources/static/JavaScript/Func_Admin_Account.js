function processAjax(param0, param1, param2) {
    $.ajax({
        url: "http://" + IPstring + "/members?isApproval=1",
        data: { memberID: param0, memberName: param1, memo: param2 },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data){
    		var result = "";
    		for (var i = 0; i < data.total; i++) {
    			result += "<tr onclick='openPopup()'>";
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
    			result += "<td onclick='event.cancelBubble=true'>";
    			result += "<input type='button' class='datailBtn' value='상세 보기' name='" + data[i].memberName + "' onclick='detailPayment(" + data[i].memberIdx + "," + i + ")'>";
    			result += "</td>";
    			result += "</tr>";
    		}
    		$("tbody").html(result);
    		$("tbody tr").fadeOut(0);
    		$("tbody tr").fadeIn(500);
    		
    		$("tbody tr").click(function(){
    			var resultPopup = "";
    			resultPopup += "<strong>회원 정보 변경</strong>";
    			resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
    			resultPopup += "<hr><table id='memberInfo'>";
    			resultPopup += "<tr>" + "<td>회원 번호</td>" + "<td>" + $(this).children().eq(0).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>아이디</td>" + "<td>" + $(this).children().eq(2).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>닉네임</td>" + "<td>" + "<input type='text' id='memberName' spellcheck='false'>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>회원 메모</td>" + "<td>" + "<textarea id='memoMember' spellcheck='false'></textarea>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>회원 등급</td>" + "<td>" + "<select id='memberGrade'></select>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>관리자 메모</td>" + "<td>" + "<textarea id='memoAdmin' spellcheck='false'></textarea>" + "</td></tr>";
    			resultPopup += "</table><hr>";
    			resultPopup += "<input type='button' class='deleteBtn' value='제거'>";
    			resultPopup += "<input type='button' class='updateBtn' value='저장'>";
    			$(".popupBox").html(resultPopup);
    			
    			$("#memberName").val($(this).children().eq(3).html());
    			$("#memoMember").val($(this).children().eq(4).html().replaceAll("<br>", "\n"));
    			$("#memoAdmin").val($(this).children().eq(5).html().replaceAll("<br>", "\n"));

    			var resultOption = "";
    			if ($(this).children().eq(1).html()=="손님") {
    				resultOption += "<option value=1 selected>" + "손님" + "</option>";
	    			resultOption += "<option value=2>" + "연습생" + "</option>";
	    			resultOption += "<option value=3>" + "레슨생" + "</option>";
    			} else if ($(this).children().eq(1).html()=="연습생") {
    				resultOption += "<option value=1>" + "손님" + "</option>";
	    			resultOption += "<option value=2 selected>" + "연습생" + "</option>";
	    			resultOption += "<option value=3>" + "레슨생" + "</option>";
    			} else if ($(this).children().eq(1).html()=="레슨생") {
    				resultOption += "<option value=1>" + "손님" + "</option>";
	    			resultOption += "<option value=2>" + "연습생" + "</option>";
	    			resultOption += "<option value=3 selected>" + "레슨생" + "</option>";
    			} else if ($(this).children().eq(1).html()=="비회원") {
    				resultOption += "<option value=0 selected>" + "비회원" + "</option>";
    				resultOption += "<option value=1>" + "손님" + "</option>";
	    			resultOption += "<option value=2>" + "연습생" + "</option>";
	    			resultOption += "<option value=3>" + "레슨생" + "</option>";
    			} else if ($(this).children().eq(1).html()=="관리자") {
    				resultOption += "<option value=99 selected>" + "관리자" + "</option>";
    				resultOption += "<option value=1>" + "손님" + "</option>";
	    			resultOption += "<option value=2>" + "연습생" + "</option>";
	    			resultOption += "<option value=3>" + "레슨생" + "</option>";
    			}
    			$("#memberGrade").append(resultOption);
    			
    			$(".updateBtn").attr("onclick", "updateMember(" + $(this).children().eq(0).html() + ")");
    			$(".deleteBtn").attr("onclick", "deleteMember(" + $(this).children().eq(0).html() + ")");
    		})
        }
    })
}

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
		result += "<td style='width:10%;'>" + "납부 정보" + "</td>";
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

function openDetailPayment() {
	$('.popupDetailPayment').css('display', 'inline-block');
	$('.popupBackground').css('display', 'inline-block');
	$('html, body').css('overflow', 'hidden');
}

function closeDetailPayment() {
	$('.popupDetailPayment').css('display', 'none');
	$('.popupBackground').css('display', 'none');
	$('html, body').css('overflow', '');
}

function detailPayment(idx, no) {
	var resultDetailPayment = "";
	resultDetailPayment += "<strong>납부 정보 상세</strong>";
	resultDetailPayment += "<input type='button' value='X' class='closeBtn' onclick='closeDetailPayment()'>";
	resultDetailPayment += "<hr><select id='selectInfoType'></select>";
	resultDetailPayment += "<input type='text' id='inputPaymentInfo' spellcheck=false placeholder='검색어를 입력해 주세요.' autocomplete='off'>";
	resultDetailPayment += "<input type='button' id='searchPaymentInfo' value='검색'><br><br>";
	resultDetailPayment += "<table><thead>";
	resultDetailPayment += "<tr>";
	resultDetailPayment += "<td style='width:10%;'>납부 번호</td>";
	resultDetailPayment += "<td style='width:10%;'>납부 일자</td>";
	resultDetailPayment += "<td style='width:10%;'>닉네임</td>";
	resultDetailPayment += "<td style='width:10%;'>수강료</td>";
	resultDetailPayment += "<td style='width:15%;'>레슨</td>";
	resultDetailPayment += "<td style='width:15%;'>연습</td>";
	resultDetailPayment += "<td style='width:30%;'>메모</td>";
	resultDetailPayment += 	"</tr>";
	resultDetailPayment += "</thead><tbody></tbody></table>";
	$(".popupDetailPayment").html(resultDetailPayment);
	
	var detailPaymentOption = "";
	detailPaymentOption += "<option value='memo'>" + "메모" + "</option>";
	$("#selectInfoType").append(detailPaymentOption);
	
	$("#inputPaymentInfo").keypress(function(event) {
		if (event.keyCode==13) {
			event.preventDefault();
			$("#searchPaymentInfo").click();
		}
	})
	var name = $(".datailBtn").eq(no).attr("name");
	loadPaymentData(idx, name, "");
	openDetailPayment();
	
	$("#searchPaymentInfo").click(function() {
		var selectInfoType = $("#selectInfoType").val();
		var searchMemo = "";
		if (selectInfoType=="memo") {
			var searchMemo = $("#inputPaymentInfo").val();
		}
		loadPaymentData(idx, name, searchMemo)
	})	
}

function loadPaymentData(idx, name, memo) {
	$.ajax({
	    url: "http://" + IPstring + "/payments",
	    data: { memberIdx: idx, memo: memo },
	    method: "POST",
	    dataType: "JSON",
	    error: function() { alert("데이터 로드 실패"); },
	    success: function(data){
	    	var result = "";
	    	if (data.total==0) {
	    		result += "<tr><td colspan=7>" + name + "님의 납부 정보가 없습니다." + "</td></tr>";
	    	}
	    	else {
	    		for (var i = 0; i < data.total; i++) {
					result += "<tr>";
					result += "<td>" + data[i].payIdx + "</td>";
					result += "<td>" + data[i].payDate + "</td>";
					result += "<td>" + data[i].memberName + "</td>";
					result += "<td>" + "￦ " + data[i].fees.toLocaleString() + "</td>";
					
					createGraph(data[i].lessonRmnCnt, data[i].lessonCnt);
					result += "<td name='" + data[i].lessonRmnCnt + "'>" + resultGraph + "</td>";
					
					createGraph(data[i].practiceRmnCnt, data[i].practiceCnt);
					result += "<td name='" + data[i].practiceRmnCnt + "'>" + resultGraph + "</td>";
					
					result += "<td>" + data[i].memo.replaceAll("\n", "<br>") + "</td>";
					result += "</tr>";
				}
	    	}
			$(".popupDetailPayment tbody").html(result);
			$(".popupDetailPayment tbody tr").fadeOut(0);
			$(".popupDetailPayment tbody tr").fadeIn(500);
			$(".popupDetailPayment tbody tr").css("cursor", "default");
	    }
	})
}

function updateMember(idx) {
	var name = $("#memberName").val();
	var grade = $("#memberGrade").val();
	var memo1 = $("#memoMember").val().replaceAll("\n", "<br>");
	var memo2 = $("#memoAdmin").val().replaceAll("\n", "<br>");
	$.ajax({
        url: "http://" + IPstring + "/update-member",
        data: { memberIdx: idx, memberName: name, memberGrade: grade, memo: memo1, memoAdmin: memo2 },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	if (data.rt=="UpdateMember_FAIL001") {
        		alert("존재하지 않는 회원 번호입니다.");
        	}
        	else if (data.rt=="UpdateMember_FAIL002") {
        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
        	}
        	else if (data.rt=="UpdateMember_OK") {
            	alert("회원 정보 변경이 정상적으로 완료되었습니다.");
            	window.location.reload();
        	}
        }
	})
}

function deleteMember(idx) {
	if (confirm("회원 정보를 제거 하시겠습니까?")==true) {
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
	            	alert("회원 제거가 정상적으로 완료되었습니다.");
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