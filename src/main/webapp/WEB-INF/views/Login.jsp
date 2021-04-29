<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>드럼트리</title>

<link rel="stylesheet" type="text/css" href="resources/CSS/Style_Common.css">
<link rel="stylesheet" type="text/css" href="resources/CSS/Style_Login.css">
<script type="text/javascript" src="resources/JavaScript/Menubar.js"></script>
<script type="text/javascript" src="resources/JQuery/jquery-3.5.1.min.js"></script>
</head>

<body>
<div class="sectionLeft" style="background-color: #FFFFFF;">
	<p style="position: relative; height: 58em; text-align: center;">	
		<img alt="DrumTree" src="resources/Images/logo2.jpg" style="height: auto; width: 30em; position: absolute; top: 50%; transform: translateY(-50%); ">
	</p>

</div>

<div class="sectionRight">
	<table class="loginBox">
		<tr>
			<td style="text-align:right;">ID</td>
			<td><input type="text"></td>
		</tr>
		<tr>
			<td style="text-align:right;">PW</td>
			<td><input type="password"></td>
		</tr>
		<tr>
			<td colspan="2">
				<input type="submit" value="로그인">
				<input type="button" value="회원등록">
			</td>
		</tr>
	</table>
</div>
</body>
</html>