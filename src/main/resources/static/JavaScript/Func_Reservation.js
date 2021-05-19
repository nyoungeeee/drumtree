function selectCurrentMenu() {
	$(document).ready(function(){
		$(".menuName").eq(2).css("background-color", "#BDBDBD");
		$(".menuName").eq(2).children().css("color", "#000000");
	});
}