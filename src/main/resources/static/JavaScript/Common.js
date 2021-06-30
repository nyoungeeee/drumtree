function loadIPstring() {
	IPstring = "3.34.217.94:8888";
	return IPstring;
}

function selectCurrentMenu(menuNo, subMenuNo) {
	$(document).ready(function(){
		if (menuNo==3) {
			$(".menuName").eq(menuNo).css("background-color", "#424242");
			$(".menuName").eq(menuNo).children().css("color", "#FFFFFF");
			$(".subMenuName").css("visibility", "visible");
			$(".subMenuName").eq(subMenuNo).children().css("font-weight", "bold");
		}
		else {
			$(".menuName").eq(menuNo).css("background-color", "#424242");
			$(".menuName").eq(menuNo).children().css("color", "#FFFFFF");
		}
	});
}

function noCacheImg() {
	$(document).ready(function(){
		$("img").attr("src",function(){
			return $(this).attr("src") + "?a=" + Math.random();
		});
	})
}