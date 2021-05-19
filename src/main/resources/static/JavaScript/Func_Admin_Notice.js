function selectCurrentMenu() {
	$(document).ready(function(){
		$(".menuName").eq(3).css("background-color", "#BDBDBD");
		$(".menuName").eq(3).children().css("color", "#000000");
		$(".subMenuName").css("visibility", "visible");
		$(".subMenuName").eq(0).children().css("font-weight", "bold");
	});
}