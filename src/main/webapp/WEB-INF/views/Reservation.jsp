<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>드럼트리</title>

<link rel="stylesheet" type="text/css" href="resources\CSS\Style_Common.css">
<link rel="stylesheet" type="text/css" href="resources\CSS\Style_Reservation.css">
<script type="text/javascript" src="resources\JavaScript\Menubar.js"></script>
<script type="text/javascript" src="resources\JavaScript\Func_Reservation.js"></script>
<script type="text/javascript" src="resources\JQuery\jquery-3.5.1.min.js"></script>
<script type="text/javascript">selectCurrentMenu();</script>
<style>
    /* Calendar 위치 대신 (높이값 변경 시, mainSheet 크기 변경 요청)*/
    .mainScreen{
        height: 800px;
        border: 1px solid transparent;
    }

    .mainSheet{
        width: 600px;
        height: 700px;
        border: 1px solid #000;
        margin: 0 auto;
        margin-top: 50px;
        border-radius: 50px;
        text-align: center;
        list-style-type: none;
    }
    .mainSheet ul{
        margin: 0;
        padding: 0;
    }
    .mainSheet li{
        list-style-type: none;
        text-align: center;
    }
    .button{
        width: 150px;
        height: 50px;
        margin-bottom: 20px;
        border-radius: 30px;
    }
    .mainSheet li input{
        width: 300px;
        height: 30px;
        margin-bottom: 20px;
    }
    
    .mainSheet li textarea{
        width: 300px;
        margin-bottom: 20px;
    }
</style>
</head>

<body>
<div class="menuBar"><script>createMenubar();</script></div>
<input type="button" class="hideButton" value="≡" onclick="hideMenubar()">

<div class="mainScreen">
    <div class="mainSheet">
        <ul>
            <h1>예약 신청</h1>
            <li><input type="text" name="name" id="name" placeholder="예약자 성함"></li>
            <li><input type="text" name="lessonable" id="lessonable" placeholder="예약 구분"></li>
            <li><input type="date" name="date" id="date" placeholder="예약 일자"></li>
            <li><input type="time" name="time" id="time" placeholder="예약 시간"></li>
            <li><textarea name="memo" id="memo" cols="40" rows="5"></textarea></li>
            <li><input type="date" name="register" id="register" placeholder="등록일시"></li>
            <li><h4>신청중</h4></li>
            <li><input type="file" accept=".pdf"></li>
        </ul>
        <input type="submit" value="승인" class="button">
        <input type="reset" value="취소" class="button">
    </div>
</div>
</body>
</html>