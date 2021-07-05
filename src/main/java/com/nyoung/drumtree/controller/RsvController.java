package com.nyoung.drumtree.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nyoung.drumtree.dto.MemberDTO;
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
		int memberIdx = -1;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}
		int rsvType = -1;
		if(!rsvTypeStr.equals("")) {
			rsvType = Integer.parseInt(request.getParameter("rsvType"));
		}
		int roomType = -1;
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

	/*예약 리스트(검색/전체)*/
	@RequestMapping(value = "/list-rsv")
	public Map<Object, Object> SelectRsv(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String memberName = request.getParameter("memberName")==null ? "" : request.getParameter("memberName");
		String rsvTypeStr = request.getParameter("rsvType")==null ? "" : request.getParameter("rsvType");
		String roomTypeStr = request.getParameter("roomType")==null ? "" : request.getParameter("roomType");
		String start = request.getParameter("start")==null ? "" : request.getParameter("start");
		String end = request.getParameter("end")==null ? "" : request.getParameter("end");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String isApprovalStr = request.getParameter("isApproval")==null ? "" : request.getParameter("isApproval");

		int memberIdx = -1;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}
		int rsvType = -1;
		if(!rsvTypeStr.equals("")) {
			rsvType = Integer.parseInt(request.getParameter("rsvType"));
		}
		int roomType = -1;
		if(!roomTypeStr.equals("")) {
			roomType = Integer.parseInt(request.getParameter("roomType"));
		}
		int isApproval = -1;
		if(!isApprovalStr.equals("")) {
			isApproval = Integer.parseInt(request.getParameter("isApproval"));
		}

		// 결과값 세팅
		List<RsvDTO> list = null;
		List<MemberDTO> memberList = null;
		String rt = null;
		int totalAll = 0;
		int total = 0;

		// 쿼리 실행
		RsvDTO param = new RsvDTO();
		if(memberName.equals("")) { //memberName 검색 아닐 경우
			memberName = "";
		} else {	//memberName 검색일 경우 : memberIdx 값 넣기
			MemberDTO param2 = new MemberDTO();
			param2.setMemberIdx(0);
			param2.setMemberID("");
			param2.setMemberName(memberName);
			param2.setMemo("");
			param2.setMemberPW("");
			param2.setIsApproval(-1);
			param2.setMemberGrade(-1);
			List<MemberDTO> searchNameList = memberService.SelectMember(param2);
			if(searchNameList.size() > 0) {
				memberIdx = searchNameList.get(0).getMemberIdx();
			} else {
				rt = "RsvList_FAIL002";	//이름와 일치하는 멤버가 없음
			}

		}
		param.setMemberIdx(memberIdx);
		param.setRsvType(rsvType);
		param.setRoomType(roomType);
		param.setIsApproval(isApproval);
		param.setStart(start);
		param.setEnd(end);
		param.setMemo(memo);
		param.setIsApproval(isApproval);
		list = rsvService.SelectRsv(param);
		total = list.size();
		if(total > 0) {
			rt = "RsvList_OK";
		} else {
			rt = "RsvList_FAIL001";
		}

		// Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);
		data.put("total", total);
		data.put("totalAll", totalAll);
		for(int i=0; i<list.size(); i++){
			Map<String, Object> rsv = new HashMap<String, Object>();
			// 예약 정보 넣기
			RsvDTO dto = list.get(i);
			rsv.put("rsvIdx", dto.getRsvIdx());
			rsv.put("rsvType", dto.getRsvType());
			rsv.put("roomType", dto.getRoomType());
			rsv.put("start", dto.getStart());
			rsv.put("end", dto.getEnd());
			rsv.put("regDate", dto.getRegDate());
			rsv.put("updateDate", dto.getUpdateDate());
			rsv.put("memo", dto.getMemo());
			rsv.put("isApproval", dto.getIsApproval());
			rsv.put("memberIdx", dto.getMemberIdx());
			// 회원 정보 넣기
			memberList = null;
			MemberDTO memberParam = new MemberDTO();
			memberParam.setMemberIdx(dto.getMemberIdx());
			memberParam.setMemberID("");
			memberParam.setMemberName("");
			memberParam.setMemo("");
			memberParam.setMemberPW("");
			memberParam.setIsApproval(-1);
			memberParam.setMemberGrade(-1);
			memberList = memberService.SelectMember(memberParam);
			if(memberList.size()>0) {
				rsv.put("memberName", memberList.get(0).getMemberName());
				rsv.put("memberGrade", memberList.get(0).getMemberGrade());
			} else {
				rsv.put("memberName", "삭제된 회원");
				rsv.put("memberGrade", "-1");
			}

			data.put(i, rsv);
		}
		return data;
	}


	/*예약 수정*/
	@RequestMapping(value = "/update-rsv")
	public Map<Object, Object> UpdateRsv(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String rsvIdxStr = request.getParameter("rsvIdx")==null ? "" : request.getParameter("rsvIdx");
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String rsvTypeStr = request.getParameter("rsvType")==null ? "" : request.getParameter("rsvType");
		String roomTypeStr = request.getParameter("roomType")==null ? "" : request.getParameter("roomType");
		String start = request.getParameter("start")==null ? "" : request.getParameter("start");
		String end = request.getParameter("end")==null ? "" : request.getParameter("end");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String isApprovalStr = request.getParameter("isApproval")==null ? "" : request.getParameter("isApproval");
		String isDeleteStr = request.getParameter("isDelete")==null ? "" : request.getParameter("isDelete");
		int rsvIdx = -1;
		if(!rsvIdxStr.equals("")) {
			rsvIdx = Integer.parseInt(request.getParameter("rsvIdx"));
		}
		int memberIdx = -1;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}
		int rsvType =-1;
		if(!rsvTypeStr.equals("")) {
			rsvType = Integer.parseInt(request.getParameter("rsvType"));
		}
		int roomType = -1;
		if(!roomTypeStr.equals("")) {
			roomType = Integer.parseInt(request.getParameter("roomType"));
		}
		int isApproval = -1;
		if(!isApprovalStr.equals("")) {
			isApproval = Integer.parseInt(request.getParameter("isApproval"));
		}
		int isDelete = -1;
		if(!isDeleteStr.equals("")) {
			isDelete = Integer.parseInt(request.getParameter("isDelete"));
		}

		// 결과값 세팅
		String rt = null;
		int total = 0;

		// 쿼리 실행
		RsvDTO param = new RsvDTO();
		param.setRsvIdx(rsvIdx);
		param.setMemberIdx(memberIdx);
		param.setRsvType(rsvType);
		param.setRoomType(roomType);
		param.setStart(start);
		param.setEnd(end);
		param.setMemo(memo);
		param.setIsApproval(isApproval);
		param.setIsDelete(isDelete);
		total = rsvService.UpdateRsv(param);
		if(total > 0) {
			rt = "UpdateRsv_OK";
		} else {
			rt = "UpdateRsv_FAIL001";
		}

		// Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);

		return data;
	}


}
