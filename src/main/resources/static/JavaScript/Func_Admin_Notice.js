function selectCurrentMenu() {
	$(document).ready(function(){
		$(".menuName").eq(3).css("background-color", "#424242");
		$(".menuName").eq(3).children().css("color", "#FFFFFF");
		$(".subMenuName").css("visibility", "visible");
		$(".subMenuName").eq(0).children().css("font-weight", "bold");
	});
}