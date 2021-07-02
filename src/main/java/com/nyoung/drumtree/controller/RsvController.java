package com.nyoung.drumtree.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nyoung.drumtree.dto.RsvDTO;

@CrossOrigin("*")
@RestController

public class RsvController {

	@Autowired
	RsvServiceImpl rsvService;
	@Autowired
	MemberServiceImpl memberService;

	/*예약 등록*/
	@RequestMapping(value = "/write-rsv")
	public Map<Object, Object> WriteRsv(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String rsvTypeStr = request.getParameter("rsvType")==null ? "" : request.getParameter("rsvType");
		String roomTypeStr = request.getParameter("roomType")==null ? "" : request.getParameter("roomType");
		String start = request.getParameter("start")==null ? "" : request.getParameter("start");
		String end = request.getParameter("end")==null ? "" : request.getParameter("end");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		int memberIdx = 0;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}
		int rsvType = 0;
		if(!rsvTypeStr.equals("")) {
			rsvType = Integer.parseInt(request.getParameter("rsvType"));
		}
		int roomType = 0;
		if(!roomTypeStr.equals("")) {
			roomType = Integer.parseInt(request.getParameter("roomType"));
		}

		// 결과값 세팅
		String rt = null;
		int total = 0;

		// 쿼리 실행
		RsvDTO param = new RsvDTO();
		param.setMemberIdx(memberIdx);
		param.setRsvType(rsvType);
		param.setRoomType(roomType);
		param.setStart(start);
		param.setEnd(end);
		param.setMemo(memo);
		total = rsvService.WriteRsv(param);
		if(total > 0) {
			rt = "WriteRsv_OK";
		} else {
			rt = "WriteRsv_FAIL001";
		}

		// Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);

		return data;
	}
	
	/*예약 수정*/

	/*예약 취소*/

	/*예약 승인, 승인 취소*/

	/*예약 리스트(검색/전체)*/

}
