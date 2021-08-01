function processAjax(param0, param1, param2) {
    $.ajax({
        url: "http://" + IPstring + "/payments",
        data: { memberName: param0, memo: param1, payDate: param2 },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data){
        	var result = "";
        	if (data.total==0) {
        		result += "<tr id='noResult'><td colspan=" + $("thead tr td").length + ">" + "검색 결과가 없습니다." + "</td></tr>";
        	}
        	else {
        		for (var i = 0; i < data.total; i++) {
        			result += "<tr onclick='openPopup()'>";
        			result += "<td>" + data[i].payIdx + "</td>";
        			result += "<td>" + data[i].payDate + "</td>";
        			result += "<td>" + data[i].memberName + "</td>";
        			result += "<td>" + "￦ " + data[i].fees.toLocaleString() + "</td>";
        			
        			createGraph(data[i].lessonRmnCnt, data[i].lessonCnt);
        			result += "<td name='" + data[i].lessonRmnCnt + "'>" + resultGraph + "</td>";
        			
        			createGraph(data[i].practiceRmnCnt, data[i].practiceCnt);
        			result += "<td name='" + data[i].practiceRmnCnt + "'>" + resultGraph + "</td>";
        			
        			result += "<td>" + data[i].memo.replaceAll("\n", "<br>") + "</td>";
        			result += "<td style='display:none;'>" + data[i].memberIdx + "</td>";
        			result += "</tr>";
        		}
        	}
    		$("tbody").html(result);
    		$("tbody tr").fadeOut(0);
    		$("tbody tr").fadeIn(500);
    		$("#noResult").css("cursor", "default");
    		
    		$("tbody tr").not("#noResult").click(function() {
    			var resultPopup = "";
    			resultPopup += "<strong>납부 정보</strong>";
    			resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
    			resultPopup += "<hr><table id='paymentInfo'>";
    			resultPopup += "<tr>" + "<td>납부 일자</td>" + "<td>" + "<input type='date' id='paymentDate'>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>납부 회원</td>" + "<td>" + "<input type='text' id='paymentMember' readonly>" + "&emsp;" + "<input type='button' class='findBtn' value='찾기' onclick='findMember()'>" + "&emsp;" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>수강료</td>" + "<td>" + "<input type='text' id='paymentFee' readonly>" + "&emsp;" + "<input type='button' class='feeBtn' value='주 2회'>" + "&nbsp;" + "<input type='button' class='feeBtn' value='주 3회'>" + "&nbsp;" + "<input type='button' class='feeBtn' value='주 5회'>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>남은 레슨 횟수</td>" + "<td>" + "<input type='button' class='changeBtn' value='-'>" + "&nbsp;" + "<input type='text' id='paymentLesson' value=0 readonly>" + "&nbsp;" +  "<input type='button' class='changeBtn' value='+'>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>남은 연습 횟수</td>" + "<td>" + "<input type='button' class='changeBtn' value='-'>" + "&nbsp;" + "<input type='text' id='paymentPractice' value=0 readonly>" + "&nbsp;" + "<input type='button' class='changeBtn' value='+'>" + "</td></tr>";
    			resultPopup += "<tr>" + "<td>메모</td>" + "<td>" + "<textarea id='paymentMemo' spellcheck=false></textarea>" + "</td></tr>";
    			resultPopup += "</table><hr>";
    			resultPopup += "<input type='button' class='deleteBtn' value='제거'>";
    			resultPopup += "<input type='button' class='updateBtn' value='저장'>";
    			$(".popupBox").html(resultPopup);
    			
    			var beforeLesson = $(this).children().eq(4).attr("name");
    			var beforePractice = $(this).children().eq(5).attr("name");
    			
    			$("#paymentDate").val($(this).children().eq(1).html());
    			$("#paymentMember").val($(this).children().eq(2).html());
    			$("#paymentMember").attr("name", $(this).children().eq(7).html());
    			$("#paymentFee").val($(this).children().eq(3).html());
    			$("#paymentLesson").val(beforeLesson);
    			$("#paymentPractice").val(beforePractice);
    			$("#paymentMemo").val($(this).children().eq(6).html().replaceAll("<br>", "\n"));
    			
    			var payIdx = $(this).children().eq(0).html();
    			var afterLesson = beforeLesson;
    			var afterPractice = beforePractice;
    			$(".updateBtn").attr("onclick", "updatePayment(" + payIdx + "," + (afterLesson-beforeLesson) + "," + (afterPractice-beforePractice) + ")");
    			$(".deleteBtn").attr("onclick", "deletePayment(" + payIdx + ")");
    			
    			$(".feeBtn").click(function() {
    				if ($(this).val()=="주 2회") {
    					var selectFee = 180000; 
    				}
    				else if ($(this).val()=="주 3회") {
    					var selectFee = 200000; 
    				}
    				else if ($(this).val()=="주 5회") {
    					var selectFee = 220000; 
    				}
    				$(this).parent().find("input[type=text]").val("￦ " + selectFee.toLocaleString());
    			});
    			
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
    				$(".updateBtn").attr("onclick", "updatePayment(" + payIdx + "," + (afterLesson-beforeLesson) + "," + (afterPractice-beforePractice) + ")");
    			});
    		});
        }
    })
}

function createTableHead() {
	$(document).ready(function(){
		var result = "";
		result += "<tr>";
		result += "<td style='width:10%;'>" + "납부 번호" + "</td>";
		result += "<td style='width:10%;'>" + "납부 일자" + "</td>";
		result += "<td style='width:10%;'>" + "닉네임" + "</td>";
		result += "<td style='width:10%;'>" + "수강료" + "</td>";
		result += "<td style='width:15%;'>" + "레슨" + "</td>";
		result += "<td style='width:15%;'>" + "연습" + "</td>";
		result += "<td style='width:30%;'>" + "메모" + "</td>";
		result += "<td style='display:none;'>" + "회원 번호" + "</td>";
		result += "</tr>";
		
		$("thead").html(result);
	});
}

function createTableBody() {
	$(document).ready(function(){
		var timezoneOffset = new Date().getTimezoneOffset() * 60000;
		var timezoneDate = new Date(Date.now() - timezoneOffset);
		$("#month").val(timezoneDate.toISOString().slice(0,7));
		filterPayment(timezoneDate.toISOString().slice(0,7));
		
		$("#month").change(function(){
			filterPayment($("#month").val());
		})
		
		$(".searchBtn").click(function(){
			filterPayment($("#month").val());
		})
	});
}

function clickArrow(addValue) {
	var currentYear = Number($("#month").val().slice(0,4));
	var currentMonth = Number($("#month").val().slice(5,7))-1;
	var currentDate = new Date(currentYear, currentMonth+addValue, 1, 9, 0, 0);
	$("#month").val(currentDate.toISOString().slice(0,7));
	filterPayment(currentDate.toISOString().slice(0,7));
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

function openFindMember() {
	$('.popupFindMember').css('display', 'inline-block');
	$('.popupBackground').css('z-index', '7');
}

function closeFindMember() {
	$('.popupFindMember').css('display', 'none');
	$('.popupBackground').css('z-index', '5');
}

function filterPayment(month) {
	var filterType = $("#filterType").val();
	var filterName = "";
	var filterMemo = "";
	if (filterType=="name") {
		var filterName = $("#filter").val();
	}
	else if (filterType=="memo") {
		var filterMemo = $("#filter").val();
	}
	processAjax(filterName, filterMemo, month);
}

function addNotice() {
	var resultPopup = "";
	resultPopup += "<strong>납부 정보 추가</strong>";
	resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
	resultPopup += "<hr><table id='paymentInfo'>";
	resultPopup += "<tr>" + "<td>납부 일자</td>" + "<td>" + "<input type='date' id='paymentDate'>" + "</td></tr>";
	resultPopup += "<tr>" + "<td>납부 회원</td>" + "<td>" + "<input type='text' id='paymentMember' value='-' readonly>" + "&emsp;" + "<input type='button' class='findBtn' value='찾기' onclick='findMember()'>" + "&emsp;" + "</td></tr>";
	resultPopup += "<tr>" + "<td>수강료</td>" + "<td>" + "<input type='text' id='paymentFee' value='￦ 0' readonly>" + "&emsp;" + "<input type='button' class='feeBtn' value='주 2회'>" + "&nbsp;" + "<input type='button' class='feeBtn' value='주 3회'>" + "&nbsp;" + "<input type='button' class='feeBtn' value='주 5회'>" + "</td></tr>";
	resultPopup += "<tr>" + "<td>레슨 횟수</td>" + "<td>" + "<input type='button' class='changeBtn' value='-'>" + "&nbsp;" + "<input type='text' id='paymentLesson' value=0 readonly>" + "&nbsp;" +  "<input type='button' class='changeBtn' value='+'>" + "</td></tr>";
	resultPopup += "<tr>" + "<td>연습 횟수</td>" + "<td>" + "<input type='button' class='changeBtn' value='-'>" + "&nbsp;" + "<input type='text' id='paymentPractice' value=0 readonly>" + "&nbsp;" + "<input type='button' class='changeBtn' value='+'>" + "</td></tr>";
	resultPopup += "<tr>" + "<td>메모</td>" + "<td>" + "<textarea id='paymentMemo' spellcheck=false></textarea>" + "</td></tr>";
	resultPopup += "</table><hr>";
	resultPopup += "<input type='button' class='resetBtn' value='초기화'>";
	resultPopup += "<input type='button' class='saveBtn' value='등록'>";
	$(".popupBox").html(resultPopup);
	
	$(".saveBtn").attr("onclick", "savePayment()");
	$(".resetBtn").attr("onclick", "resetPayment()");
	
	var timezoneOffset = new Date().getTimezoneOffset() * 60000;
	var timezoneDate = new Date(Date.now() - timezoneOffset);
	$("#paymentDate").val(timezoneDate.toISOString().slice(0,10));
	
	$(".feeBtn").click(function() {
		if ($(this).val()=="주 2회") {
			var selectFee = 180000; 
		}
		else if ($(this).val()=="주 3회") {
			var selectFee = 200000; 
		}
		else if ($(this).val()=="주 5회") {
			var selectFee = 220000; 
		}
		$(this).parent().find("input[type=text]").val("￦ " + selectFee.toLocaleString());
	});
	
	$(".changeBtn").click(function() {
		var currentCount = Number($(this).parent().find("input[type=text]").val());
		if ($(this).val()=="+") {
			$(this).parent().find("input[type=text]").val(currentCount + 1);
		}
		else if ($(this).val()=="-") {
			$(this).parent().find("input[type=text]").val(currentCount - 1);
		}
	});
	
	openPopup();
}

function findMember() {
	var resultFindMember = "";
	resultFindMember += "<strong>회원 정보 찾기</strong>";
	resultFindMember += "<input type='button' value='X' class='closeBtn' onclick='closeFindMember()'>";
	resultFindMember += "<hr><select id='selectInfoType'></select>";
	resultFindMember += "<input type='text' id='inputMemberInfo' spellcheck=false placeholder='검색어를 입력해 주세요.' autocomplete='off'>";
	resultFindMember += "<input type='button' id='searchMemberInfo' value='검색'><br><br>";
	resultFindMember += "<table><thead>";
	resultFindMember += "<tr>";
	resultFindMember += "<td style='width:10%;'>회원 번호</td>";
	resultFindMember += "<td style='width:10%;'>회원 등급</td>";
	resultFindMember += "<td style='width:10%;'>아이디</td>";
	resultFindMember += "<td style='width:10%;'>닉네임</td>";
	resultFindMember += "<td style='width:25%;'>회원 메모</td>";
	resultFindMember += "<td style='width:25%;'>관리자 메모</td>";
	resultFindMember += "</tr>";
	resultFindMember += "</thead><tbody></tbody></table>";
	$(".popupFindMember").html(resultFindMember);
	
	var findMemberOption = "";
	findMemberOption += "<option value='name'>" + "닉네임" + "</option>";
	findMemberOption += "<option value='Id'>" + "아이디" + "</option>";
	findMemberOption += "<option value='memo'>" + "회원 메모" + "</option>";
	$("#selectInfoType").append(findMemberOption);
	
	$("#inputMemberInfo").keypress(function(event) {
		if (event.keyCode==13) {
			event.preventDefault();
			$("#searchMemberInfo").click();
		}
	})
	
	$("#searchMemberInfo").click(function() {
		var selectInfoType = $("#selectInfoType").val();
		var searchId = "";
		var searchName = "";
		var searchMemo = "";
		if (selectInfoType=="Id") {
			var searchId = $("#inputMemberInfo").val();
		}
		else if (selectInfoType=="name") {
			var searchName = $("#inputMemberInfo").val();
		}
		else if (selectInfoType=="memo") {
			var searchMemo = $("#inputMemberInfo").val();
		}
		
		if ($("#inputMemberInfo").val()!="") {
			$.ajax({
		        url: "http://" + IPstring + "/members?isApproval=1",
		        data: { memberID: searchId, memberName: searchName, memo: searchMemo },
		        method: "POST",
		        dataType: "JSON",
		        error: function() { alert("데이터 로드 실패"); },
		        success: function(data){
		        	var result = "";
	        		for (var i = 0; i < data.total; i++) {
		    			result += "<tr>";
		    			result += "<td>" + data[i].memberIdx + "</td>";
		    			
		    			if (data[i].memberGrade=="0") {
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
		    			result += "</tr>";
		    		}
		    		$(".popupFindMember tbody").html(result);
		    		$(".popupFindMember tbody tr").fadeOut(0);
		    		$(".popupFindMember tbody tr").fadeIn(500);
		    		
		    		$(".popupFindMember tbody tr").click(function() {
		    			var confirmMessage = "아래 회원 정보를 추가하시겠습니까?" + "\n";
		    			confirmMessage += "\n" + "· 아이디: " + $(this).children().eq(2).html();
		    			confirmMessage += "\n" + "· 닉네임: " + $(this).children().eq(3).html();
		    			confirmMessage += "\n" + "· 회원 등급: " + $(this).children().eq(1).html();
		    			
		    			if(confirm(confirmMessage)==true) {
		    				var selectIdx = $(this).children().eq(0).html();
		    				var selectName = $(this).children().eq(3).html();
		    				$("#paymentInfo #paymentMember").attr("name", selectIdx);
		    				$("#paymentInfo #paymentMember").val(selectName);
		    				closeFindMember();
		    			}
		    			
		    		});
		        }
		    })
		}
	});
	
	openFindMember();
}

function savePayment() {
	var paymentDate = $("#paymentDate").val();
	var paymentMember = Number($("#paymentMember").attr("name"));
	var paymentFee = Number($("#paymentFee").val().replaceAll("￦ ", "").replaceAll(",", ""));
	var paymentLesson = Number($("#paymentLesson").val());
	var paymentPractice = Number($("#paymentPractice").val());
	var paymentMemo = $("#paymentMemo").val();
	if (paymentLesson==0&&paymentPractice>0) { var paymentCode = 4; }
	else if (paymentFee==180000) { var paymentCode = 1; }
	else if (paymentFee==200000) { var paymentCode = 2; }
	else if (paymentFee==220000) { var paymentCode = 3; }
	else { var paymentCode = 0; }
	
	$("#errorMessageMember").remove();
	
	if (Number.isNaN(paymentMember)==true) {
		$("#paymentInfo tr").eq(1).children().eq(1).append("<a id='errorMessageMember' class='error'>!</a>");
		$("#errorMessageMember").fadeOut(0);
		$("#errorMessageMember").fadeIn(500);
	}
	else {
		$.ajax({
	        url: "http://" + IPstring + "/insert-payment",
	        data: {
	        	payDate: paymentDate,
	        	memberIdx: paymentMember,
	        	fees: paymentFee,
	        	lessonCnt: paymentLesson,
	        	lessonRmnCnt: paymentLesson,
	        	practiceCnt: paymentPractice,
	        	practiceRmnCnt: paymentPractice,
	        	memo: paymentMemo,
	        	payCode: paymentCode
	        },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="InsertPayment_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="InsertPayment_OK") {
	            	alert("납부 정보 등록이 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
		})
	}
}

function resetPayment() {
	$("#paymentMember").val("-");
	$("#paymentMember").removeAttr("name");
	$("#paymentFee").val("￦ 0");
	$("#paymentLesson").val(0);
	$("#paymentPractice").val(0);
	$("#paymentMemo").val("");
	
	$("#errorMessageMember").remove();
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

function updatePayment(idx, lesson, practice) {
	var paymentDate = $("#paymentDate").val();
	var paymentMember = Number($("#paymentMember").attr("name"));
	var paymentMemberName = $("#paymentMember").val();
	var paymentFee = Number($("#paymentFee").val().replaceAll("￦ ", "").replaceAll(",", ""));
	var paymentRmnLesson = Number($("#paymentLesson").val());
	var paymentRmnPractice = Number($("#paymentPractice").val());
	var paymentMemo = $("#paymentMemo").val();
	
	$.ajax({
        url: "http://" + IPstring + "/update-payment",
        data: {
        	payIdx: idx,
        	payDate: paymentDate,
        	memberIdx: paymentMember,
        	memberName: paymentMemberName,
        	fees: paymentFee,
        	memo: paymentMemo
        },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	if (data.rt=="UpdatePayment_FAIL001") {
        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
        	}
        	else if (data.rt=="UpdatePayment_OK") {
        		if (lesson!=0) { changeRemainCount(paymentMember, 1, lesson); }
        		if (practice!=0) { changeRemainCount(paymentMember, 2, practice); }
            	alert("납부 정보 변경이 정상적으로 완료되었습니다.");
            	window.location.reload();
        	}
        }
	})
}

function deletePayment(idx) {
	if (confirm("납부 정보를 제거 하시겠습니까?")==true) {
		$.ajax({
	        url: "http://" + IPstring + "/update-payment",
	        data: {
	        	payIdx: idx,
	        	code: 1
	        },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="UpdatePayment_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="UpdatePayment_OK") {
	            	alert("납부 정보 제거가 정상적으로 완료되었습니다.");
	            	window.location.reload();
	        	}
	        }
		})
	}
}
