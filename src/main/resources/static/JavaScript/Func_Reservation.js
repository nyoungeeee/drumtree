function selectCurrentMenu() {
	$(document).ready(function(){
		$(".menuName").eq(2).css("background-color", "#424242");
		$(".menuName").eq(2).children().css("color", "#FFFFFF");
	});
}