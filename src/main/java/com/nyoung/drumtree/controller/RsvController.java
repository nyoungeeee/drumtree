package com.nyoung.drumtree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController

public class RsvController {

	@Autowired
	RsvServiceImpl rsvService;
	@Autowired
	MemberServiceImpl memberService;
	
	/*예약 리스트(검색/전체)*/
	
	/*예약 등록*/
	
	/*예약 수정*/
	
	/*예약 취소*/
	
	/*예약 승인, 승인 취소*/
	
}
