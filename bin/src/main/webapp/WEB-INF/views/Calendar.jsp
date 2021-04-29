<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>드럼트리</title>

<link rel="stylesheet" type="text/css" href="resources\CSS\Style_Common.css">
<link rel="stylesheet" type="text/css" href="resources\CSS\Style_Calendar.css">
<script type="text/javascript" src="resources\JavaScript\Menubar.js"></script>
<script type="text/javascript" src="resources\JavaScript\Func_Calendar.js"></script>
<script type="text/javascript" src="resources\JQuery\jquery-3.5.1.min.js"></script>
<script type="text/javascript">
	selectCurrentMenu();
	selectMonth();
</script>
</head>

<body>
<div class="menuBar"><script>createMenubar();</script></div>
<input type="button" class="hideButton" value="≡" onclick="hideMenubar()">
<div class="headerBar"><a>달력</a><hr></div>
<div class="mainScreen">
	<input type="button" id="rightArrow" value="▶" onclick="clickArrow(1)">
	<input type="month" id="month">
	<input type="button" id="leftArrow" value="◀" onclick="clickArrow(-1)">
	<table>
		<thead></thead>
		<tbody></tbody>
	</table>
</div>
</body>
</html>