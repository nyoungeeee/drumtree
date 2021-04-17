function selectCurrentMenu() {
	$(document).ready(function(){
		$(".menuName").eq(3).css("background-color", "#CFBEB7");
		$(".menuName").eq(3).children().css("color", "#603D06");
		$(".subMenuName").css("display", "block");
		$(".subMenuName").eq(1).css("background-color", "#DFD5B3");
		$(".subMenuName").eq(1).children().css("color", "#603D06");
	});
}