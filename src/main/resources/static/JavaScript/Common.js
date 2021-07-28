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

function loadEditor(id) {
	ClassicEditor
    .create(document.querySelector(id), {
    	toolbar: {
    		items: [
    			'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor',
				'|',
				'alignment', 'bold', 'italic', 'strikeThrough', 'underline',
				'|',
				'link', 'insertImage', 'insertTable', 'mediaEmbed', 'specialCharacters'
    		]
    	},
    	
    	image: {
    		toolbar: [
    			'imageStyle:inline',
                'imageStyle:block'
    		]
    	},
    	
    	table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableProperties',
                'tableCellProperties'
            ]
        },
    	
    	simpleUpload: {
            uploadUrl: 'http://3.34.217.94:8888/upload',
            withCredentials: false,
            headers: {
                'X-CSRF-TOKEN': 'CSRF-Token',
                Authorization: 'Bearer <JSON Web Token>',
            }
        }
    })
    .then(newEditor => {
        editor = newEditor;
    })
    .catch(error => {
        console.error(error);
    });
}

function checkAccessAuthority(menuNo, subMenuNo) {
	$(document).ready(function(){
		var key = $.cookie("loginInfo");
		var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
		var gradeNo = decrypt.split("&")[2];
		
		if (menuNo==0) {
			$(".menuName").eq(menuNo).css("background-color", "#424242");
			$(".menuName").eq(menuNo).children().css("color", "#FFFFFF");
		}
		else if (menuNo==1||menuNo==2) {
			if (gradeNo==0) {
				alert("페이지 접근 권한이 없습니다.");
				location.href = "../Notice";
			}
			else {
				$(".menuName").eq(menuNo).css("background-color", "#424242");
				$(".menuName").eq(menuNo).children().css("color", "#FFFFFF");
			}
		}
		else if (menuNo==3) {
			if (gradeNo!=99) {
				alert("페이지 접근 권한이 없습니다.");
				location.href = "../Notice";
			}
			else {
				$(".menuName").eq(menuNo).css("background-color", "#424242");
				$(".menuName").eq(menuNo).children().css("color", "#FFFFFF");
				$(".subMenuName").css("visibility", "visible");
				$(".subMenuName").eq(subMenuNo).children().css("font-weight", "bold");
			}
		}
		
		$("#filter").keypress(function(event) {
			if (event.keyCode==13) {
				event.preventDefault();
				$(".searchBtn").click();
			}
		})
	});
}

function maskingText(text) {
	var key = $.cookie("loginInfo");
	var decrypt = CryptoJS.AES.decrypt(key, Decode).toString(CryptoJS.enc.Utf8);
	var currentName = decrypt.split("&")[1];
	
	var resultText = "";
	if (text=="삭제된 회원") {
		resultText += text;
	}
	else if (text==currentName) {
		resultText += text;
	}
	else if (text.length > 2) {
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

function createGraph(remain, total) {
	resultGraph = "";
	if (remain==0&&total==0) {
		resultGraph += "<a>" + "-" + "</a>";
	}
	else if (remain==total) {
		resultGraph += "<div class='graphTotal' style='background-color:#424242;color:#FFFFFF;'>";
		resultGraph += "<a>" + remain + " / " + total + "</a>";
		resultGraph += "</div>";
	}
	else if (remain==0&&total!=0) {
		resultGraph += "<div class='graphTotal'>";
		resultGraph += "<a>" + remain + " / " + total + "</a>";
		resultGraph += "</div>";
	}
	else {
		if ((remain/total)>1) { var ratio = 100; }
		else if ((remain/total)<0) { var ratio = 0; }
		else { var ratio = (remain/total)*100 }
		
		if (ratio>=50) {
			resultGraph += "<div class='graphTotal'>";
			resultGraph += "<div class='graphBar' style='float:left;width:" + ratio + "%'>";
			resultGraph += "<a>" + remain + " / " + total + "</a>";
			resultGraph += "</div>";
			resultGraph += "</div>";
		}
		else {
			resultGraph += "<div class='graphTotal'>";
			resultGraph += "<div class='graphBar' style='float:left;width:" + ratio + "%'>";
			resultGraph += "</div>";
			resultGraph += "<a>" + remain + " / " + total + "</a>";
			resultGraph += "</div>";
		}
	}
	
	return resultGraph;
}