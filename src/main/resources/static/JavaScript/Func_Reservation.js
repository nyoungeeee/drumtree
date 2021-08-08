function processAjax(param0, param1, param2, param3) {
	var thisYear = param0.getFullYear();
	var thisMonth = param0.getMonth();
	var thisDay = param0.getDate();
	
	if (thisMonth<9) {
		var month = "0" + (thisMonth+1);
	} else {
		var month = (thisMonth+1);
	}
	if (thisDay<10) {
		var day = "0" + thisDay;
	} else {
		var day = thisDay;
	}
	var filterStart = thisYear + "-" + month + "-" + day;
	
    $.ajax({
        url: "http://" + IPstring + "/list-rsv?isApproval=1",
        data: { start: filterStart },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	var startArray = [];
        	var endArray = [];
        	var rsvTypeArray = [];
        	var roomTypeArray = [];
        	var memberNameArray = [];
        	var memoArray = [];
        	var rsvIdxArray = [];
        	var memberIdxArray = [];
        	
        	for (var jsonIdx = 0; jsonIdx < data.total; jsonIdx++) {
            	startArray.push(data[jsonIdx].start);
            	endArray.push(data[jsonIdx].end);
            	rsvTypeArray.push(data[jsonIdx].rsvType);
            	roomTypeArray.push(data[jsonIdx].roomType);
            	memberNameArray.push(data[jsonIdx].memberName);
            	memoArray.push(data[jsonIdx].memo);
            	rsvIdxArray.push(data[jsonIdx].rsvIdx);
            	memberIdxArray.push(data[jsonIdx].memberIdx);
        	}
        	
        	var roomName = [ "레슨", "연습실 3번", "연습실 4번<br>(미니드럼)", "연습실 5번" ];
        	var resultBody = "";
        	for (var i = 0; i < roomName.length; i++) {
        		resultBody += "<tr>";
        		resultBody += "<td>" + roomName[i] + "</td>";
        		for (var j = 0; j < 30; j++) { resultBody += "<td class='timeTable' onclick='openPopup()'>" + "<div class='hoverBall'></div>" + "</td>"; }
        		resultBody += "</tr>";
        	}
        	$("tbody").html(resultBody);
        	
        	var key = $.cookie("loginInfo");
        	var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
        	var loginName = decrypt.split("&")[1];
        	var loginGrade = decrypt.split("&")[2];
    		var loginMember = decrypt.split("&")[3];
    		
        	for (var arrayIdx = 0; arrayIdx < startArray.length; arrayIdx++) {
        		var startDate = new Date(startArray[arrayIdx]);
        		var endDate = new Date(endArray[arrayIdx]);
        		var room = roomTypeArray[arrayIdx];
        		var member = memberNameArray[arrayIdx];
        		var memo = memoArray[arrayIdx];
        		var rsvIdx = rsvIdxArray[arrayIdx];
        		var memberIdx = memberIdxArray[arrayIdx];
        		var timeDifference = endDate.getTime() - startDate.getTime();
        		var timeCount = ((timeDifference/1000)/60)/30;
        		
        		var thisDate = new Date(thisYear, thisMonth, thisDay, 8, 0, 0);
        		
        		if (startDate.getTime() >= thisDate.getTime()) {
        			var startPoint = ((((startDate.getTime() - thisDate.getTime())/1000)/60)/30)+1;
        			$("tbody tr").eq(room).find("td").eq(startPoint).attr("colspan", timeCount);
        			$("tbody tr").eq(room).find("td").eq(startPoint).attr("id", "reserved");
        			$("tbody tr").eq(room).find("td").eq(startPoint).removeAttr("onclick");
        			
        			var isFiltered = true;
            		if (param3==1 && memberIdx!=loginMember) { var isFiltered = false; }
            		if (param1!="" && member.indexOf(param1)<0) { var isFiltered = false; }
            		if (param2!="" && memo.indexOf(param2)<0) { var isFiltered = false; }
            		
            		if (isFiltered==true) {
            			if (memberIdx!=loginMember&&loginGrade!=99) {
                			$("tbody tr").eq(room).find("td").eq(startPoint).html("<div id='reservation' name='noPopup'>" + maskingText(member) + "</div>");
            			}
            			else {
                			$("tbody tr").eq(room).find("td").eq(startPoint).html("<div id='reservation' name='" + arrayIdx + "' onclick='openPopup()'>" + maskingText(member) + "</div>");
            			}
            		}
            		else {
            			$("tbody tr").eq(room).find("td").eq(startPoint).html("<div class='filteredRsv'>" + maskingText(member) + "</div>");
            		}
        			
        			for (var k = 1; k < timeCount; k++) {
        				$("tbody tr").eq(room).find("td").eq(startPoint+k).css("display", "none");
        				$("tbody tr").eq(room).find("td").eq(startPoint+k).removeAttr("onclick");
        			}
        		}
        	}
        	$("div #reservation[name='noPopup']").css("cursor", "default");
        	$("tbody tr").fadeOut(0);
        	$("tbody tr").fadeIn(500);
        	
        	$("div #reservation").not("[name='noPopup']").click(function() {
        		var resultPopup = "";
        		resultPopup += "<strong>예약 정보</strong>";
        		resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
        		resultPopup += "<hr><table id='reservationInfo'>";
        		resultPopup += "<tr>" + "<td>예약 회원</td>" + "<td>" + "<input type='text' id='selectMember' readonly>";
        		resultPopup += "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 구분</td>" + "<td>" + "<select id='selectType'></select>&emsp;" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 장소</td>" + "<td>" + "<select id='selectRoom'></select>&emsp;" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 날짜</td>" + "<td>" + "<input type='date' id='selectDate'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 시간</td>" + "<td>" + "<select id='selectStartTime'></select>" + "&emsp;" + "<select id='selectEndTime'></select>" + "&emsp;" + "<input type='button' class='checkFlag' value='체크' onclick='checkTime(" + rsvIdxArray[$(this).attr("name")] + ")'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>메모</td>" + "<td>" + "<textarea id='reservationMemo' spellcheck='false'></textarea>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>파일 첨부</td>" + "<td>" + "<div id='fileList'><strong>첨부 파일 목록</strong><br><hr></div>" + "</td></tr>";
        		resultPopup += "</table><hr>";
        		resultPopup += "<input type='button' class='deleteBtn' value='예약취소'>";
        		resultPopup += "<input type='button' class='updateBtn' value='변경'>";
        		$(".popupBox").html(resultPopup);
        		$("#selectDate").val($("#date").val());
        		$("#selectMember").attr("name", memberIdxArray[$(this).attr("name")]);
        		$("#selectMember").val(maskingText(memberNameArray[$(this).attr("name")]));
        		
        		$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<br>");
    			$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<label class='clearBtn' onclick='clearFile()'>지우기</label>");
    			$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<label class='uploadBtn' onclick='uploadFile()'>첨부</label>");
    			$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<label class='fileName'><a>첨부할 파일을 선택해 주세요.</a></label>");
    			$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<input type='file' id='reservationFile' style='display:none;'>");
    			$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<label class='fileBtn' for='reservationFile'>파일 선택</label>");
    			var startHTML = "<div id='fileList'>";
    			var startToFile = memoArray[$(this).attr("name")].indexOf(startHTML) + startHTML.length;
    			var endToFile = memoArray[$(this).attr("name")].indexOf("</div>");
    			var toFileString = memoArray[$(this).attr("name")].substring(startToFile, endToFile);
    			$("#reservationInfo #fileList").html(toFileString);
    			
    			$("#reservationFile").on('change',function(){
    				$(".fileName a").html($("#reservationFile")[0].files[0].name);
    				$(".fileName a").fadeOut(0);
    				$(".fileName a").fadeIn(500);
    			})
    			
    			var startToDelete = memoArray[$(this).attr("name")].indexOf("<div");
    			var endToDelete = memoArray[$(this).attr("name")].indexOf("div>") + 4;
    			var toDeleteString = memoArray[$(this).attr("name")].substring(startToDelete, endToDelete);
    			$("#reservationMemo").val(memoArray[$(this).attr("name")].replaceAll(toDeleteString, "").replaceAll("<br>", "\n"));
        		
        		var resultStartTime = "";
        		var resultEndTime = "";
        		for (var k = 0; k < 30; k++) {
        			if (parseInt(k/2)+8 > 9) { var startHour = parseInt(k/2)+8; }
        			else { var startHour = "0" + (parseInt(k/2)+8); }
        			if ((k%2)*30 > 0) { var startMin = (k%2)*30; }
        			else { var startMin = "0" + (k%2)*30; }
        			
        			resultStartTime += "<option value='" + startHour + ":" + startMin + "'>"
        			resultStartTime += startHour + ":" + startMin;
        			resultStartTime += "</option>";
        			
        			if (parseInt((k+1)/2)+8 > 9) { var endHour = parseInt((k+1)/2)+8; }
        			else { var endHour = "0" + (parseInt((k+1)/2)+8); }
        			if (((k+1)%2)*30 > 0) { var endMin = ((k+1)%2)*30; }
        			else { var endMin = "0" + ((k+1)%2)*30; }
        			
        			resultEndTime += "<option value='" + endHour + ":" + endMin + "'>"
        			resultEndTime += endHour + ":" + endMin;
        			resultEndTime += "</option>";
        		}
        		$("#selectStartTime").append(resultStartTime);
        		$("#selectEndTime").append(resultEndTime);
        		
        		var rsvStartTime = startArray[$(this).attr("name")].split(" ")[1].substring(0,5);
        		var rsvEndTime = endArray[$(this).attr("name")].split(" ")[1].substring(0,5);
        		$("#selectStartTime").val(rsvStartTime).prop("selected", true);
        		$("#selectEndTime").val(rsvEndTime).prop("selected", true);
        		
        		$("#selectStartTime").change(function(){
        			var thisStartTime = $("#selectStartTime").val().split(":")[0];
        			if ((Number(thisStartTime)+1)<10) { var thisEndTime = "0" + (Number(thisStartTime)+1) + ":" + $("#selectStartTime").val().split(":")[1]; }
        			else { var thisEndTime = (Number(thisStartTime)+1) + ":" + $("#selectStartTime").val().split(":")[1]; }
        			$("#selectEndTime").val(thisEndTime).prop("selected", true);
        			
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		$("#selectEndTime").change(function(){
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		var resultType = "";
        		resultType += "<option value=0>" + "레슨" + "</option>";
        		resultType += "<option value=1>" + "연습" + "</option>";
        		$("#selectType").append(resultType);
        		if (roomTypeArray[$(this).attr("name")]>1) { var thisType = 1; }
        		else { var thisType = roomTypeArray[$(this).attr("name")]; }
        		$("#selectType").val(thisType).prop("selected", true);
        		
        		var resultRoom = "";
        		if ($("#selectType").val()==0) {
        			resultRoom += "<option value='none'>" + "" + "</option>";
        			resultRoom += "<option value=0>" + "레슨실" + "</option>";
        		}
        		else {
        			resultRoom += "<option value='none'>" + "" + "</option>";
        			resultRoom += "<option value=1>" + "연습실 3번" + "</option>";
        			resultRoom += "<option value=2>" + "연습실 4번" + "</option>";
        			resultRoom += "<option value=3>" + "연습실 5번" + "</option>";
        		}
        		$("#selectRoom").append(resultRoom);
        		var thisRoom = roomTypeArray[$(this).attr("name")];
        		$("#selectRoom").val(thisRoom).prop("selected", true);
        		
        		var reservationIdx = rsvIdxArray[$(this).attr("name")];
        		var originalRsv = thisType;
        		$(".updateBtn").attr("onclick", "updateReservation(" + originalRsv + "," + $("#selectMember").attr("name") + "," + reservationIdx + "," + "'" + $("#selectDate").val() + "'" + ")");
        		$(".deleteBtn").attr("onclick", "deleteReservation(" + originalRsv + "," + $("#selectMember").attr("name") + "," + reservationIdx + "," + "'" + $("#selectDate").val() + "'" + ")");
        		
        		$("#selectDate").change(function() {
        			$(".updateBtn").attr("onclick", "updateReservation(" + originalRsv + "," + $("#selectMember").attr("name") + "," + reservationIdx + "," + "'" + $("#selectDate").val() + "'" + ")");
            		$(".deleteBtn").attr("onclick", "deleteReservation(" + originalRsv + "," + $("#selectMember").attr("name") + "," + reservationIdx + "," + "'" + $("#selectDate").val() + "'" + ")");
            		$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		});
        		
        		$("#selectType").change(function(){
        			$("#selectRoom option").remove();
        			var resultRoom = "";
        			if ($("#selectType").val()==0) {
        				resultRoom += "<option value='none'>" + "" + "</option>";
        				resultRoom += "<option value=0>" + "레슨실" + "</option>";
        			}
        			else {
        				resultRoom += "<option value='none'>" + "" + "</option>";
        				resultRoom += "<option value=1>" + "연습실 3번" + "</option>";
        				resultRoom += "<option value=2>" + "연습실 4번" + "</option>";
        				resultRoom += "<option value=3>" + "연습실 5번" + "</option>";
        			}
        			$("#selectRoom").append(resultRoom);
        			
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		$("#selectRoom").change(function(){
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        	})
        	
        	$("tbody tr .timeTable").not("#reserved").click(function(){
        		var resultPopup = "";
        		resultPopup += "<strong>예약하기</strong>";
        		resultPopup += "<input type='button' value='X' class='closeBtn' onclick='closePopup()'>";
        		resultPopup += "<hr><table id='reservationInfo'>";
        		resultPopup += "<tr>" + "<td>예약 회원</td>" + "<td>" + "<input type='text' id='selectMember' readonly>";
        		if (loginGrade==99) { resultPopup += "&emsp;" + "<input type='button' class='findBtn' value='찾기'>"; }
        		resultPopup += "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 구분</td>" + "<td>" + "<select id='selectType'></select>&emsp;" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 장소</td>" + "<td>" + "<select id='selectRoom'></select>&emsp;" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 날짜</td>" + "<td>" + "<input type='date' id='selectDate'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>예약 시간</td>" + "<td>" + "<select id='selectStartTime'></select>" + "&emsp;" + "<select id='selectEndTime'></select>" + "&emsp;" + "<input type='button' class='checkFlag' value='체크' onclick='checkTime(-1)'>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>메모</td>" + "<td>" + "<textarea id='reservationMemo' spellcheck='false'></textarea>" + "</td></tr>";
        		resultPopup += "<tr>" + "<td>파일 첨부</td>" + "<td>" + "<div id='fileList'><strong>첨부 파일 목록</strong><br><hr></div>" + "</td></tr>";
        		resultPopup += "</table><hr>";
        		resultPopup += "<input type='button' class='resetBtn' value='초기화'>";
        		resultPopup += "<input type='button' class='saveBtn' value='신청'>";
        		$(".popupBox").html(resultPopup);
        		$("#selectDate").val($("#date").val());
        		$(".saveBtn").attr("onclick", "saveReservation('" + $("#selectDate").val() + "')");
        		$(".resetBtn").attr("onclick", "resetReservation()");
        		$(".findBtn").attr("onclick", "findMember()");
        		$("#selectMember").attr("name", loginMember);
        		$("#selectMember").val(maskingText(loginName));
        		
        		$("#selectDate").change(function() {
        			$(".saveBtn").attr("onclick", "saveReservation('" + $("#selectDate").val() + "')");
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		});
        		
        		$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<br>");
    			$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<label class='clearBtn' onclick='clearFile()'>지우기</label>");
    			$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<label class='uploadBtn' onclick='uploadFile()'>첨부</label>");
    			$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<label class='fileName'><a>첨부할 파일을 선택해 주세요.</a></label>");
    			$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<input type='file' id='reservationFile' style='display:none;'>");
    			$("#reservationInfo tr").eq(6).find("td").eq(1).prepend("<label class='fileBtn' for='reservationFile'>파일 선택</label>");
    			
    			$("#reservationFile").on('change',function(){
    				$(".fileName a").html($("#reservationFile")[0].files[0].name);
    				$(".fileName a").fadeOut(0);
    				$(".fileName a").fadeIn(500);
    			})
        		
        		var resultStartTime = "";
        		var resultEndTime = "";
        		for (var k = 0; k < 30; k++) {
        			if (parseInt(k/2)+8 > 9) { var startHour = parseInt(k/2)+8; }
        			else { var startHour = "0" + (parseInt(k/2)+8); }
        			if ((k%2)*30 > 0) { var startMin = (k%2)*30; }
        			else { var startMin = "0" + (k%2)*30; }
        			
        			resultStartTime += "<option value='" + startHour + ":" + startMin + "'>"
        			resultStartTime += startHour + ":" + startMin;
        			resultStartTime += "</option>";
        			
        			if (parseInt((k+1)/2)+8 > 9) { var endHour = parseInt((k+1)/2)+8; }
        			else { var endHour = "0" + (parseInt((k+1)/2)+8); }
        			if (((k+1)%2)*30 > 0) { var endMin = ((k+1)%2)*30; }
        			else { var endMin = "0" + ((k+1)%2)*30; }
        			
        			resultEndTime += "<option value='" + endHour + ":" + endMin + "'>"
        			resultEndTime += endHour + ":" + endMin;
        			resultEndTime += "</option>";
        		}
        		$("#selectStartTime").append(resultStartTime);
        		$("#selectEndTime").append(resultEndTime);
        		
        		if (parseInt(($(this).index()-1)/2)+8 > 9) { var thisStartHour = parseInt(($(this).index()-1)/2)+8; }
        		else { var thisStartHour = "0" + (parseInt(($(this).index()-1)/2)+8); }
        		if ((($(this).index()-1)%2)*30 > 0) { var thisStartMin = (($(this).index()-1)%2)*30; }
        		else { var thisStartMin = "0" + (($(this).index()-1)%2)*30; }
        		$("#selectStartTime").val(thisStartHour + ":" + thisStartMin).prop("selected", true);
        		
        		if (parseInt(($(this).index()-1)/2)+9 > 9) { var thisEndHour = parseInt(($(this).index()-1)/2)+9; }
        		else { var thisEndHour = "0" + (parseInt(($(this).index()-1)/2)+9); }
        		if (thisStartHour==22&&thisStartMin==30) { var thisEndMin = "00"; }
        		else { var thisEndMin = thisStartMin; }
        		$("#selectEndTime").val(thisEndHour + ":" + thisEndMin).prop("selected", true);
        		
        		$("#selectStartTime").change(function(){
        			var thisStartTime = $("#selectStartTime").val().split(":")[0];
        			if ((Number(thisStartTime)+1)<10) { var thisEndTime = "0" + (Number(thisStartTime)+1) + ":" + $("#selectStartTime").val().split(":")[1]; }
        			else { var thisEndTime = (Number(thisStartTime)+1) + ":" + $("#selectStartTime").val().split(":")[1]; }
        			$("#selectEndTime").val(thisEndTime).prop("selected", true);
        			
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		$("#selectEndTime").change(function(){
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		var resultType = "";
        		resultType += "<option value=0>" + "레슨" + "</option>";
        		resultType += "<option value=1>" + "연습" + "</option>";
        		$("#selectType").append(resultType);
        		if ($(this).parent().index()>1) { var thisType = 1; }
        		else { var thisType = $(this).parent().index(); }
        		$("#selectType").val(thisType).prop("selected", true);
        		
        		var resultRoom = "";
        		if ($("#selectType").val()==0) {
        			resultRoom += "<option value='none'>" + "" + "</option>";
        			resultRoom += "<option value=0>" + "레슨실" + "</option>";
        		}
        		else {
        			resultRoom += "<option value='none'>" + "" + "</option>";
        			resultRoom += "<option value=1>" + "연습실 3번" + "</option>";
        			resultRoom += "<option value=2>" + "연습실 4번" + "</option>";
        			resultRoom += "<option value=3>" + "연습실 5번" + "</option>";
        		}
        		$("#selectRoom").append(resultRoom);
        		var thisRoom = $(this).parent().index();
        		$("#selectRoom").val(thisRoom).prop("selected", true);
        		
        		$("#selectType").change(function(){
        			$("#selectRoom option").remove();
        			var resultRoom = "";
        			if ($("#selectType").val()==0) {
        				resultRoom += "<option value='none'>" + "" + "</option>";
        				resultRoom += "<option value=0>" + "레슨실" + "</option>";
        			}
        			else {
        				resultRoom += "<option value='none'>" + "" + "</option>";
        				resultRoom += "<option value=1>" + "연습실 3번" + "</option>";
        				resultRoom += "<option value=2>" + "연습실 4번" + "</option>";
        				resultRoom += "<option value=3>" + "연습실 5번" + "</option>";
        			}
        			$("#selectRoom").append(resultRoom);
        			
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        		
        		$("#selectRoom").change(function(){
        			$(".checkFlag").val("체크");
            		$(".checkFlag").removeClass("checkTrue");
            		$(".checkFlag").removeClass("checkFalse");
        		})
        	})
        }
    })
}

function openFindMember() {
	$('.popupFindMember').css('display', 'inline-block');
	$('.popupBackground').css('z-index', '7');
}

function closeFindMember() {
	$('.popupFindMember').css('display', 'none');
	$('.popupBackground').css('z-index', '5');
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
		    			var confirmMessage = "아래 회원 정보로 변경하시겠습니까?" + "\n";
		    			confirmMessage += "\n" + "· 아이디: " + $(this).children().eq(2).html();
		    			confirmMessage += "\n" + "· 닉네임: " + $(this).children().eq(3).html();
		    			confirmMessage += "\n" + "· 회원 등급: " + $(this).children().eq(1).html();
		    			
		    			if(confirm(confirmMessage)==true) {
		    				var selectIdx = $(this).children().eq(0).html();
		    				var selectName = $(this).children().eq(3).html();
		    				$("#selectMember").attr("name", selectIdx);
		    				$("#selectMember").val(maskingText(selectName));
		    				closeFindMember();
		    			}
		    			
		    		});
		        }
		    })
		}
	});
	
	openFindMember();
}

function selectDate() {
	$(document).ready(function(){
		if (window.location.href.indexOf("?date=")>0) {
			var dateParam = window.location.href.split("?date=");
			var currentDate = new Date(dateParam[1]);
			$("#date").val(currentDate.toISOString().slice(0,10));
		}
		else {
			var currentDate = new Date();
			var timezoneOffset = new Date().getTimezoneOffset() * 60000;
			var timezoneDate = new Date(Date.now() - timezoneOffset);
			$("#date").val(timezoneDate.toISOString().slice(0,10));
		}
		createTimeTable(currentDate);

		$('#date').change(function(){
			var currentDate = new Date($("#date").val());
			createTimeTable(currentDate);
		})
	});
}

function clickArrow(addValue) {
	var currentDate = new Date($("#date").val());
	currentDate.setDate(currentDate.getDate()+addValue);
	$("#date").val(currentDate.toISOString().slice(0,10));
	createTimeTable(currentDate);
}

function createTimeTable(currentDate) {
	var weekDay = currentDate.getDay();
	var weekDayString = [ "(일)", "(월)", "(화)", "(수)", "(목)", "(금)", "(토)" ];
	var currentDateString = $("#date").val().split("-");
	var resultHead = "";
	resultHead += "<tr>";
	resultHead += "<td style='width:7.5%;'>" + currentDateString[1] + "월" + "&nbsp;" + currentDateString[2] + "일" + weekDayString[weekDay] + "</td>";
	for (var headIdx = 8; headIdx < 23; headIdx++) {
		if (headIdx > 9) {
			resultHead += "<td colspan=2 style='text-align:left;'>" + headIdx + ":00" + "</td>";
		}
		else {
			resultHead += "<td colspan=2 style='text-align:left;'>" + "0" + headIdx + ":00" + "</td>";
		}
	}
	resultHead += "</tr>";
	$("thead").html(resultHead);
	filterReservation();
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

function saveReservation(date) {
	var rsv = $("#selectType").val();	
	var room = $("#selectRoom").val();
	var startTime = $("#selectDate").val() + " " + $("#selectStartTime").val() + ":00";
	var endTime = $("#selectDate").val() + " " + $("#selectEndTime").val() + ":00";
	var rsvMemo = "<div id='fileList'>" + $("#reservationInfo #fileList").html() + "</div>" + $("#reservationMemo").val();
	var rsvMember = $("#selectMember").attr("name");
	
	if ($(".checkFlag").val()=="체크") {
		alert("예약 가능 시간을 체크해주세요.");
	}
	else if ($(".checkFlag").val()=="불가") {
		alert("변경할 수 없는 시간대입니다.");
	}
	else {
		var key = $.cookie("loginInfo");
    	var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
    	var loginGrade = decrypt.split("&")[2];
    	
    	if (loginGrade==99) {
    		var approval = 1;
    	}
    	else {
    		var approval = 0;
    	}
		
		$.ajax({
	        url: "http://" + IPstring + "/write-rsv",
	        data: { isApproval: approval, memberIdx: rsvMember, rsvType: rsv, roomType: room, start: startTime, end: endTime, memo: rsvMemo },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="WriteRsv_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="WriteRsv_OK") {
	        		if (loginGrade==99) {
	        			if (rsv==0) {
	        				changeRemainCount(rsvMember, 1, -1);
	        			}
	        			else if (rsv==1) {
	        				changeRemainCount(rsvMember, 2, -1);
	        			}
	        			alert("승인이 정상적으로 완료되었습니다.");
	            	}
	            	else {
	            		alert("예약 신청이 접수되었습니다.\n관리자에게 승인을 요청해 주세요.");
	            	}
	            	location.href = "../Reservation?date=" + date;
	        	}
	        }
		})
	}
}

function resetReservation() {
	$("#selectType").val("");
	$("#selectRoom").val("");
	$("#selectStartTime").val("");
	$("#selectEndTime").val("");
	$("#reservationMemo").val("");
	
	$("#errorMessageType").remove();
	$("#errorMessageRoom").remove();
	
	$(".checkFlag").val("체크");
	$(".checkFlag").removeClass("checkTrue");
	$(".checkFlag").removeClass("checkFalse");
}

function updateReservation(type, member, idx, date) {
	var rsv = $("#selectType").val();
	var room = $("#selectRoom").val();
	var startTime = $("#selectDate").val() + " " + $("#selectStartTime").val() + ":00";
	var endTime = $("#selectDate").val() + " " + $("#selectEndTime").val() + ":00";
	var rsvMemo = "<div id='fileList'>" + $("#reservationInfo #fileList").html() + "</div>" + $("#reservationMemo").val();
	
	if ($(".checkFlag").val()=="체크") {
		alert("예약 가능 시간을 체크해주세요.");
	}
	else if ($(".checkFlag").val()=="불가") {
		alert("변경할 수 없는 시간대입니다.");
	}
	else {
		var key = $.cookie("loginInfo");
    	var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
    	var loginGrade = decrypt.split("&")[2];
    	
		$.ajax({
	        url: "http://" + IPstring + "/update-rsv",
	        data: { isApproval: 4, rsvIdx: idx, rsvType: rsv, roomType: room, start: startTime, end: endTime, memo: rsvMemo },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="UpdateRsv_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="UpdateRsv_OK") {
	        		if (type==0) {
	        			changeRemainCount(member, 1, 1);
	        		}
	        		else if (type==1) {
	        			changeRemainCount(member, 2, 1);
	        		}
	        		
	        		if (loginGrade==99) {
	        			approvalReservation(idx, member, date);
	        		}
	        		else {
	        			alert("변경 신청이 접수되었습니다.\n관리자에게 승인을 요청해 주세요.");
		            	location.href = "../Reservation?date=" + date;
	        		}
	        	}
	        }
		})
	}
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

function approvalReservation(idx, member, date) {
	var rsv = $("#selectType").val();	
	var room = $("#selectRoom").val();
	var startTime = $("#selectDate").val() + " " + $("#selectStartTime").val() + ":00";
	var endTime = $("#selectDate").val() + " " + $("#selectEndTime").val() + ":00";
	var rsvMemo = "<div id='fileList'>" + $("#reservationInfo #fileList").html() + "</div>" + $("#reservationMemo").val();
	
	$.ajax({
        url: "http://" + IPstring + "/update-rsv",
        data: { rsvIdx: idx, isApproval: 1, rsvType: rsv, roomType: room, start: startTime, end: endTime, memo: rsvMemo },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	if (data.rt=="UpdateRsv_FAIL001") {
        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
        	}
        	else if (data.rt=="UpdateRsv_OK") {
        		if (rsv==0) {
    				changeRemainCount(member, 1, -1);
    			}
    			else if (rsv==1) {
    				changeRemainCount(member, 2, -1);
    			}
    			alert("승인이 정상적으로 완료되었습니다.");
    			location.href = "../Reservation?date=" + date;
        	}
        }
	})
}

function deleteReservation(type, member, idx, date) {
	if (confirm("예약을 취소 하시겠습니까?")==true) {
		$.ajax({
	        url: "http://" + IPstring + "/update-rsv",
	        data: { rsvIdx: idx, isApproval: 3 },
	        method: "POST",
	        dataType: "JSON",
	        error: function() { alert("데이터 로드 실패"); },
	        success: function(data) {
	        	if (data.rt=="UpdateRsv_FAIL001") {
	        		alert("알 수 없는 오류. 관리자에게 문의해 주세요.");
	        	}
	        	else if (data.rt=="UpdateRsv_OK") {
	        		if (type==0) {
	        			changeRemainCount(member, 1, 1);
	        		}
	        		else if (type==1) {
	        			changeRemainCount(member, 2, 1);
	        		}
	            	alert("예약 취소가 정상적으로 완료되었습니다.");
	            	location.href = "../Reservation?date=" + date;
	        	}
	        }
		})
	}
}

function checkTime(reservationIndex) {
	$.ajax({
		url: "http://" + IPstring + "/list-rsv?isApproval=1",
        data: { start: $("#selectDate").val() },
        method: "POST",
        dataType: "JSON",
        error: function() { alert("데이터 로드 실패"); },
        success: function(data) {
        	var startCheckArray = [];
        	var endCheckArray = [];
        	var roomTypeCheckArray = [];
        	var rsvIdxCheckArray = [];
        	
        	for (var jsonIdx = 0; jsonIdx < data.total; jsonIdx++) {
        		startCheckArray.push(data[jsonIdx].start);
        		endCheckArray.push(data[jsonIdx].end);
        		roomTypeCheckArray.push(data[jsonIdx].roomType);
        		rsvIdxCheckArray.push(data[jsonIdx].rsvIdx);
        	}
        	
        	if (reservationIndex != -1) {
        		var thisIdx = rsvIdxCheckArray.indexOf(reservationIndex);
        		if (thisIdx > 0) {
        			startCheckArray.splice(thisIdx, 1);
            		endCheckArray.splice(thisIdx, 1);
            		roomTypeCheckArray.splice(thisIdx, 1);
            		rsvIdxCheckArray.splice(thisIdx, 1);
        		}
        	}
        	
        	$("#errorMessageType").remove();
        	$("#errorMessageRoom").remove();
        	
        	var rsv = $("#selectType").val();
        	var room = $("#selectRoom").val();
        	var startTime = $("#selectDate").val() + " " + $("#selectStartTime").val() + ":00";
        	var endTime = $("#selectDate").val() + " " + $("#selectEndTime").val() + ":00";
        	var startGetTime = new Date(startTime);
        	var endGetTime = new Date(endTime);
        	
        	if (rsv==null) {
        		$("#reservationInfo tr").eq(0).children().eq(1).append("<a id='errorMessageType' class='error'>!</a>");
        		$("#errorMessageType").fadeOut(0);
        		$("#errorMessageType").fadeIn(500);
        	}
        	else if (room==null||room=="none") {
        		$("#reservationInfo tr").eq(1).children().eq(1).append("<a id='errorMessageRoom' class='error'>!</a>");
        		$("#errorMessageRoom").fadeOut(0);
        		$("#errorMessageRoom").fadeIn(500);
        		
        		$(".checkFlag").val("불가");
        		$(".checkFlag").addClass("checkFalse");
        	}
        	else if ($("#selectStartTime").val()==null||$("#selectEndTime").val()==null) {
        		$(".checkFlag").val("불가");
        		$(".checkFlag").addClass("checkFalse");
        	}
        	else if (startGetTime.getTime()>=endGetTime.getTime()) {
        		$(".checkFlag").val("불가");
        		$(".checkFlag").addClass("checkFalse");
        	}
        	else {
        		var checkFlag = true;
	        	for (var arrayIdx = 0; arrayIdx < startCheckArray.length; arrayIdx++) {
	        		var startDateCheck = new Date(startCheckArray[arrayIdx]);
	        		var endDateCheck = new Date(endCheckArray[arrayIdx]);
	        		var roomCheck = roomTypeCheckArray[arrayIdx];
	        		
	        		var selectDate = new Date($("#selectDate").val());
	        		selectDate.setHours($("#selectStartTime").val().split(":")[0], $("#selectStartTime").val().split(":")[1], 0, 0);
	        		if (roomCheck==$("#selectRoom").val()&&startDateCheck.getTime()<=selectDate.getTime()&&endDateCheck.getTime()>selectDate.getTime()) {
	        			var checkFlag = false;
	        		}
	        		
	        		selectDate.setHours($("#selectEndTime").val().split(":")[0], $("#selectEndTime").val().split(":")[1], 0, 0);
	        		if (roomCheck==$("#selectRoom").val()&&startDateCheck.getTime()<selectDate.getTime()&&endDateCheck.getTime()>=selectDate.getTime()) {
	        			var checkFlag = false;
	        		}
	        	}
        	}

        	if (checkFlag==true) {
        		$(".checkFlag").val("가능");
        		$(".checkFlag").addClass("checkTrue");
        	}
        	else {
        		$(".checkFlag").val("불가");
        		$(".checkFlag").addClass("checkFalse");
        	}
        }
	})
}

function filterReservation() {
	var currentDate = new Date($("#date").val());
	
	var filterType = $("#filterType").val();
	var filterName = "";
	var filterMemo = "";
	if (filterType=="name") {
		var filterName = $("#filter").val();
	}
	else if (filterType=="memo") {
		var filterMemo = $("#filter").val();
	}
	
	var isOnOff = 0;
	if ($(".myScheduleArea").hasClass("myScheduleOn")==true) { var isOnOff = 1; }
	
	processAjax(currentDate, filterName, filterMemo, isOnOff);
}

function mySchedule() {
	var on = $(".myScheduleArea").hasClass("myScheduleOn");
	
	if (on==false) {
		$(".myScheduleArea").addClass("myScheduleOn");
		$(".myScheduleBtn").val("나의 일정");
	}
	else if (on==true) {
		$(".myScheduleArea").removeClass("myScheduleOn");
		$(".myScheduleBtn").val("모든 일정");
	}
	filterReservation();
}

function uploadFile() {
	var formData = new FormData();
	var fileData = $("#reservationFile")[0].files[0];
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
	        	$("#reservationInfo #fileList").append(fileList);
	        }
		})
	}
}

function clearFile() {
	$("#reservationInfo #fileList span").remove();
}