function loadIPstring() {
	IPstring = "3.34.217.94:8888";
	Decode = "drumtree";
	return IPstring, Decode;
}

function noCacheImg() {
	$(document).ready(function(){
		$("img").attr("src",function(){
			return $(this).attr("src") + "?a=" + Math.random();
		});
	})
}

function checkAccessAuthority(menuNo, subMenuNo) {
	$(document).ready(function(){
		var key = document.location.href.split("?")[1];
		var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
		var gradeNo = decrypt.split("&")[2];
		
		if (menuNo==0) {
			$(".menuName").eq(menuNo).css("background-color", "#424242");
			$(".menuName").eq(menuNo).children().css("color", "#FFFFFF");
		}
		else if (menuNo==1||menuNo==2) {
			if (gradeNo==0) {
				alert("페이지 접근 권한이 없습니다.");
				location.href = "../Notice?" + key;
			}
			else {
				$(".menuName").eq(menuNo).css("background-color", "#424242");
				$(".menuName").eq(menuNo).children().css("color", "#FFFFFF");
			}
		}
		else if (menuNo==3) {
			if (gradeNo!=99) {
				alert("페이지 접근 권한이 없습니다.");
				location.href = "../Notice?" + key;
			}
			else {
				$(".menuName").eq(menuNo).css("background-color", "#424242");
				$(".menuName").eq(menuNo).children().css("color", "#FFFFFF");
				$(".subMenuName").css("visibility", "visible");
				$(".subMenuName").eq(subMenuNo).children().css("font-weight", "bold");
			}
		}
	});
}

function maskingText(text) {
	var resultText = "";
	if (text.length > 2) {
		resultText += text.substring(0,1);
		for (var i = 0; i < text.length-2; i++) { resultText += "*"; }
		resultText += text.substring(text.length-1,text.length);
	}
	else if (text.length == 2) {
		resultText += text.substring(0,1);
		resultText += "*";
	}
	else {
		resultText += text;
	}
	return resultText;
}