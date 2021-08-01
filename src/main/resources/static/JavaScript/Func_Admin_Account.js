function processAjax(param0, param1, param2) {
    $.ajax({
        url: "http://" + IPstring + "/members?isApproval=1",
        data: { memberID: param0, memberName: param1, memo: param2 },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data){
        	var timezoneOffset = new Date().getTimezoneOffset() * 60000;
			var timezoneDate = new Date(Date.now() - timezoneOffset);
        	var result = "";
    		if (data.total==0) {
        		result += "<tr id='noResult'><td colspan=" + $("thead tr td").length + ">" + "검색 결과가 없습니다." + "</td></tr>";
        	}
    		else {
    			for (var i = 0; i < data.total; i++) {
        			result += "<tr onclick='openPopup()'>";
        			result += "<td>" + data[i].memberIdx + "</td>";
        			result += "<td>" + data[i].memberID + "</td>";
        			result += "<td>" + data[i].memberName + "</td>";
        			
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
        			
        			result += "<td>" + data[i].lessonCnt + "</td>";
        			result += "<td>" + data[i].practiceCnt + "</td>";
        			result += "<td>" + data[i].memo + "</td>";
        			result += "<td>" + data[i].memoAdmin + "</td>";
        			result += "<td onclick='event.cancelBubble=true'>";
        			result += "<input type='button' class='datailBtn' value='상세 보기' name='" + data[i].memberName + "' onclick='detailPayment(" + data[i].memberIdx + "," + i + "," + '"' + timezoneDate.toISOString().slice(0,7) + '"' + ")'>";
        			result += "</td>";
        			result += "<td onclick='event.cancelBubble=true'>";
        			result += "<input type='button' class='resetPW' value='재설정' name='" + data[i].memberName + "' onclick='resetPassword(" + data[i].memberIdx + "," + i + "," + data[i].memberGrade + ")'>";
        			result += "</td>";
        			result += "</tr>";
        		}
    		}
    		$("tbody").html(result);
    		$("tbody tr").fadeOut(0);
    		$("tbody tr").fadeIn(500);
    		$("#noResult").css("cursor", "default");
    		
    		$("tbody tr").not("#noResult").click(function(){
    			var resultPopup = "";
    			resultPopup += "<strong>회원 정보 변경</strong>";
    			resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
    			resultPopup += "<hr><table id='memberInfo'>";
    			resultPopup += "<tr>" + "<td>회원 번호</td>" + "<td>" + $(this).children().eq(0).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>아이디</td>" + "<td>" + $(this).children().eq(1).html() + "</td></tr>";
    			resultPopup += "<tr>" + "<td>닉네임</td>" + "<td>" + "<input type='text' id='memberName' spellcheck='false'>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>회원 등급</td>" + "<td>" + "<select id='memberGrade'></select>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>레슨</td>" + "<td>" + "<input type='button' class='changeBtn' value='-'>" + "&nbsp;" + "<input type='text' id='paymentLesson' readonly>" + "&nbsp;" +  "<input type='button' class='changeBtn' value='+'>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>연습</td>" + "<td>" + "<input type='button' class='changeBtn' value='-'>" + "&nbsp;" + "<input type='text' id='paymentPractice' readonly>" + "&nbsp;" + "<input type='button' class='changeBtn' value='+'>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>회원 메모</td>" + "<td>" + "<textarea id='memoMember' spellcheck='false'></textarea>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>관리자 메모</td>" + "<td>" + "<textarea id='memoAdmin' spellcheck='false'></textarea>" + "</td></tr>";
    			resultPopup += "</table><hr>";
    			resultPopup += "<input type='button' class='deleteBtn' value='제거'>";
    			resultPopup += "<input type='button' class='updateBtn' value='저장'>";
    			$(".popupBox").html(resultPopup);
    			
    			var beforeLesson = $(this).children().eq(4).html();
    			var beforePractice = $(this).children().eq(5).html();
    			
    			$("#memberName").val($(this).children().eq(2).html());
    			$("#paymentLesson").val(beforeLesson);
    			$("#paymentPractice").val(beforePractice);
    			$("#memoMember").val($(this).children().eq(6).html().replaceAll("<br>", "\n"));
    			$("#memoAdmin").val($(this).children().eq(7).html().replaceAll("<br>", "\n"));

    			var resultOption = "";
    			if ($(this).children().eq(3).html()=="손님") {
    				resultOption += "<option value=1 selected>" + "손님" + "</option>";
	    			resultOption += "<option value=2>" + "연습생" + "</option>";
	    			resultOption += "<option value=3>" + "레슨생" + "</option>";
    			} else if ($(this).children().eq(3).html()=="연습생") {
    				resultOption += "<option value=1>" + "손님" + "</option>";
	    			resultOption += "<option value=2 selected>" + "연습생" + "</option>";
	    			resultOption += "<option value=3>" + "레슨생" + "</option>";
    			} else if ($(this).children().eq(3).html()=="레슨생") {
    				resultOption += "<option value=1>" + "손님" + "</option>";
	    			resultOption += "<option value=2>" + "연습생" + "</option>";
	    			resultOption += "<option value=3 selected>" + "레슨생" + "</option>";
    			} else if ($(this).children().eq(3).html()=="비회원") {
    				resultOption += "<option value=0 selected>" + "비회원" + "</option>";
    				resultOption += "<option value=1>" + "손님" + "</option>";
	    			resultOption += "<option value=2>" + "연습생" + "</option>";
	    			resultOption += "<option value=3>" + "레슨생" + "</option>";
    			} else if ($(this).children().eq(3).html()=="관리자") {
    				resultOption += "<option value=99 selected>" + "관리자" + "</option>";
    				resultOption += "<option value=1>" + "손님" + "</option>";
	    			resultOption += "<option value=2>" + "연습생" + "</option>";
	    			resultOption += "<option value=3>" + "레슨생" + "</option>";
    			}
    			$("#memberGrade").append(resultOption);
    			
    			var memberIndex = $(this).children().eq(0).html();
    			var afterLesson = beforeLesson;
    			var afterPractice = beforePractice;
    			$(".updateBtn").attr("onclick", "updateMember(" + memberIndex + "," + (afterLesson-beforeLesson) + "," + (afterPractice-beforePractice) + ")");
    			$(".deleteBtn").attr("onclick", "deleteMember(" + memberIndex + ")");
    			
    			$(".changeBtn").click(function() {
    				var currentCount = Number($(this).parent().find("input[type=text]").val());
    				if ($(this).val()=="+") {
    					$(this).parent().find("input[type=text]").val(currentCount + 1);
    				}
    				else if ($(this).val()=="-") {
    					$(this).parent().find("input[type=text]").val(currentCount - 1);
    				}
    				var afterLesson = Number($("#paymentLesson").val());
    				var afterPractice = Number($("#paymentPractice").val());
    				$(".updateBtn").attr("onclick", "updateMember(" + memberIndex + "," + (afterLesson-beforeLesson) + "," + (afterPractice-beforePractice) + ")");
    			});
    		})
        }
    })
}

function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:5%;'>" + "회원 번호" + "</td>";
		result += "<td style='width:10%;'>" + "아이디" + "</td>";
		result += "<td style='width:10%;'>" + "닉네임" + "</td>";
		result += "<td style='width:10%;'>" + "회원 등급" + "</td>";
		result += "<td style='width:5%;'>" + "레슨" + "</td>";
		result += "<td style='width:5%;'>" + "연습" + "</td>";
		result += "<td style='width:20%;'>" + "회원 메모" + "</td>";
		result += "<td style='width:20%;'>" + "관리자 메모" + "</td>";
		result += "<td style='width:7.5%;'>" + "납부 정보" + "</td>";
		result += "<td style='width:7.5%;'>" + "비밀번호" + "</td>";
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

function openResetPassword() {
	$('.popupResetPassword').css('display', 'inline-block');
	$('.popupBackground').css('display', 'inline-block');
	$('html, body').css('overflow', 'hidden');
}

function closeResetPassword() {
	$('.popupResetPassword').css('display', 'none');
	$('.popupBackground').css('display', 'none');
	$('html, body').css('overflow', '');
}

function resetPassword(idx, no, grade) {
	var resultResetPassword = "";
	resultResetPassword += "<strong>비밀번호 변경</strong>";
	resultResetPassword += "<input type='button' value='X' class='closeBtn' onclick='closeResetPassword()'>";
	resultResetPassword += "<hr><table id='popupInfo'>";
	resultResetPassword += "<tr>" + "<td>닉네임</td>" + "<td>" + $(".resetPW").eq(no).attr("name"); + "</td></tr>";
	resultResetPassword += "<tr>" + "<td>변경할 비밀번호</td>" + "<td>" + "<input type='password' placeholder='변경할 비밀번호를 입력해 주세요.'>" + "&emsp;" + "</td></tr>";
	resultResetPassword += "<tr>" + "<td>비밀번호 재확인</td>" + "<td>" + "<input type='password' placeholder='비밀번호를 다시 입력해 주세요.'>" + "&emsp;" + "</td></tr>";
	resultResetPassword += "</table><hr>";
	resultResetPassword += "<input type='button' class='resetBtn' value='초기화'>";
	resultResetPassword += "<input type='button' class='updateBtn' value='변경'>";
	$(".popupResetPassword").html(resultResetPassword);
	openResetPassword();
	
	$(".resetBtn").click(function() {
		$("#popupInfo input[type=password]").val("");
		
		$("#errorMessageChangePW").remove();
		$("#errorMessageCheckPW").remove();
	});
	
	$(".updateBtn").click(function() {
		var changePW = $("#popupInfo input[type=password]").eq(0).val();
		var checkPW = $("#popupInfo input[type=password]").eq(1).val();
		
		$("#errorMessageChangePW").remove();
		$("#errorMessageCheckPW").remove();
		
		if (changePW==""||changePW==null) {
			$("#popupInfo tr").eq(1).children().eq(1).append("<a id='errorMessageChangePW' class='error'>!</a>");
			$("#errorMessageChangePW").fadeOut(0);
			$("#errorMessageChangePW").fadeIn(500);
		}
		else if (changePW!=checkPW) {
			$("#popupInfo tr").eq(2).children().eq(1).append("<a id='errorMessageCheckPW' class='error'>!</a>");
			$("#errorMessageCheckPW").fadeOut(0);
			$("#errorMessageCheckPW").fadeIn(500);
		}
		else {
			$.ajax({
		        url: "http://" + IPstring + "/update-member",
		        data: {
		        	memberIdx: idx,
		        	memberPW: changePW,
		        	memberGrade : grade
		        },
		        method: "POST",
		        dataType: "JSON",
		        error: function() { alert("데이터 로드 실패"); },
		        success: function(data) {
		        	alert($(".resetPW").eq(no).attr("name") + "님의 비밀번호 재설정이 완료되었습니다.");
		        	window.location.reload();
		        }
			});
		}
	});
}

function detailPayment(idx, no, month) {
	var resultDetailPayment = "";
	resultDetailPayment += "<strong>납부 정보 상세</strong>";
	resultDetailPayment += "<input type='button' value='X' class='closeBtn' onclick='closeDetailPayment()'>";
	resultDetailPayment += "<hr>";
	resultDetailPayment += "<input type='button' id='leftArrow' value='◀' onclick='clickArrow(" + idx + "," + no + "," + "-1)'>";
	resultDetailPayment += "<input type='month' id='month' onchange='changeMonth(" + idx + "," + no + ")'>";
	resultDetailPayment += "<input type='button' id='rightArrow' value='▶' onclick='clickArrow(" + idx + "," + no + "," + "1)'>";
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
	$("#month").val(month);
	
	var name = $(".datailBtn").eq(no).attr("name");
	loadPaymentData(idx, name, month);
	openDetailPayment();
}

function clickArrow(idx, no, addValue) {
	var currentYear = Number($("#month").val().slice(0,4));
	var currentMonth = Number($("#month").val().slice(5,7))-1;
	var currentDate = new Date(currentYear, currentMonth+addValue, 1, 9, 0, 0);
	detailPayment(idx, no, currentDate.toISOString().slice(0,7));
}

function changeMonth(idx, no) {
	var currentYear = Number($("#month").val().slice(0,4));
	var currentMonth = Number($("#month").val().slice(5,7))-1;
	var currentDate = new Date(currentYear, currentMonth, 1, 9, 0, 0);
	detailPayment(idx, no, currentDate.toISOString().slice(0,7));
}

function loadPaymentData(idx, name, month) {
	$.ajax({
	    url: "http://" + IPstring + "/payments",
	    data: { memberIdx: idx, payDate: month },
	    method: "POST",
	    dataType: "JSON",
	    error: function() { alert("데이터 로드 실패"); },
	    success: function(data){
	    	var result = "";
	    	if (data.total==0) {
	    		result += "<tr><td colspan=7>" + name + "님의 " + month.split("-")[0] + "년 " + month.split("-")[1] + "월 납부 정보가 없습니다." + "</td></tr>";
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

function updateMember(idx, lesson, practice) {
	var name = $("#memberName").val();
	var grade = $("#memberGrade").val();
	var memo1 = $("#memoMember").val().replaceAll("\n", "<br>");
	var memo2 = $("#memoAdmin").val().replaceAll("\n", "<br>");
	$.ajax({
        url: "http://" + IPstring + "/update-member",
        data: {
        	memberIdx: idx,
        	memberName: name,
        	memberGrade: grade,
        	memo: memo1,
        	memoAdmin: memo2
        },
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
        		if (lesson!=0) { changeRemainCount(idx, 1, lesson); }
        		if (practice!=0) { changeRemainCount(idx, 2, practice); }
            	alert("회원 정보 변경이 정상적으로 완료되었습니다.");
            	window.location.reload();
        	}
        }
	})
}

function changeRemainCount(param0, param1, param2) {
	$.ajax({
        url: "http://" + IPstring + "/change-cnt",
        data: {
        	memberIdx: param0,
        	code: param1,
        	cnt: param2
        },
        method: "POST",
        dataType: "JSON",
        error: function() { console.log("데이터 로드 실패"); }
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