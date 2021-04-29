function selectCurrentMenu() {
	$(document).ready(function(){
		$(".menuName").eq(2).css("background-color", "#CFBEB7");
		$(".menuName").eq(2).children().css("color", "#481B07");
	});
}