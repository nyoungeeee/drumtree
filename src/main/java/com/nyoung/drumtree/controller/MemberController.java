package com.nyoung.drumtree.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.nyoung.drumtree.dao.MemberDAO;
import com.nyoung.drumtree.dto.MemberDTO;

@RestController
@MapperScan(basePackages = "com.nyoung.drumtree.dao")
public class MemberController {
	@Autowired
	MemberServiceImpl memberService;

	/*멤버 리스트(검색/전체)*/
	@RequestMapping(value = "/members")
	public ModelAndView Members(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberID = request.getParameter("memberID")==null ? "" : request.getParameter("memberID");
		String memberName = request.getParameter("memberName")==null ? "" : request.getParameter("memberName");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String memberPW = request.getParameter("memberPW")==null ? "" : request.getParameter("memberPW");
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		int memberIdx = 0;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}

		// 결과값 세팅
		List<MemberDTO> list = null;
		String rt = null;
		int totalAll = 0;
		int total = 0;

		// 쿼리 실행
		MemberDTO param = new MemberDTO();
		param.setMemberIdx(memberIdx);
		param.setMemberName(memberName);
		param.setMemberID(memberID);
		param.setMemberPW(memberPW);
		param.setMemo(memo);
		list = memberService.SelectMember(param);
		total = list.size();
		if(total > 0) {
			rt = "MemberList_OK";
		} else {
			rt = "MemberList_FAIL001";
		}

		// JSON 세팅
		JSONObject json = new JSONObject();
		json.put("rt", rt);
		json.put("total", total);
		json.put("totalAll",totalAll);
		if(total > 0) {
			JSONArray item = new JSONArray();
			for(int i=0; i<list.size(); i++) {
				JSONObject temp = new JSONObject();
				MemberDTO member = list.get(i);
				temp.put("memberIdx", member.getMemberIdx());
				temp.put("memberName", member.getMemberName());
				temp.put("memberID", member.getMemberID());
				temp.put("memberPW",  member.getMemberPW());
				temp.put("memo",  member.getMemo());
				temp.put("signinDate", member.getSigninDate());
				temp.put("isDelete", member.getIsDelete());
				temp.put("deleteDate", member.getDeleteDate());
				temp.put("updateDate", member.getUpdateDate());
				temp.put("isApproval", member.getIsApproval());
				//jsonArray에 추가
				item.put(temp);
				//json에 추가
				json.put("item", item);
			}
		}

		// MV 세팅
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("json", json);
		modelAndView.setViewName("view-json");
		return modelAndView;
	}

	/*회원 등록*/
	@RequestMapping("/signin")
	public ModelAndView SignIn(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberID = request.getParameter("memberID")==null ? "" : request.getParameter("memberID");
		String memberName = request.getParameter("memberName")==null ? "" : request.getParameter("memberName");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String memberPW = request.getParameter("memberPW")==null ? "" : request.getParameter("memberPW");

		// 결과값 세팅
		String rt = null;
		List<MemberDTO> list = null;

		// 쿼리 실행 -- 이미 등록된 회원인지 체크(ID체크)
		MemberDTO param =new MemberDTO();
		param.setMemberIdx(0);
		param.setMemberID(memberID);
		param.setMemberName("");
		param.setMemberPW("");
		param.setMemo("");
		list = memberService.SelectMember(param);

		// 쿼리 실행 -- 회원 등록 진행
		if(list.size() > 0) {
			rt = "SignIn_FAIL001";	// 이미 등록된 회원
		} else {
			param.setMemberName(memberName);
			param.setMemo(memo);
			param.setMemberPW(memberPW);
			memberService.SignIn(param);
			// 쿼리 실행 -- 등록이 정상적으로 되었는지 체크
			list = memberService.SelectMember(param);
			if(list.size() >= 1) {
				rt = "SignIn_OK";
			} else {
				rt = "SignIn_FAIL002";	// sql 오류로 실패
			}
		}

		// JSON 세팅
		JSONObject json = new JSONObject();
		json.put("rt", rt);

		// MV 세팅
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("json", json);
		modelAndView.setViewName("view-json");
		return modelAndView;
	}

	/*회원 정보 수정*/
	@RequestMapping("/update-member")
	public ModelAndView UpdateMember(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberID = request.getParameter("memberID")==null ? "" : request.getParameter("memberID");
		String memberName = request.getParameter("memberName")==null ? "" : request.getParameter("memberName");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String memberPW = request.getParameter("memberPW")==null ? "" : request.getParameter("memberPW");
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		int memberIdx = 0;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}

		// 결과값 세팅
		String rt = null;
		List<MemberDTO> list = null;

		// 쿼리 실행 -- 정상적으로 등록된 회원인지 체크
		MemberDTO param =new MemberDTO();
		param.setMemberIdx(memberIdx);
		param.setMemberID("");
		param.setMemberName("");
		param.setMemberPW("");
		param.setMemo("");
		list = memberService.SelectMember(param);

		if(list.size()>0) {
			// 전송된 정보 여부에 따라 조회값이나 전송정보 중 1개 채우기
			if(memberIdx!=0) {
				param.setMemberIdx(memberIdx);
			} else {
				param.setMemberIdx(list.get(0).getMemberIdx());
			}
			if(!(memberID.equals("") || memberID==null)) {
				param.setMemberID(memberID);
			} else {
				param.setMemberID(list.get(0).getMemberID());
			}
			if(!memberName.equals("")) {
				param.setMemberName(memberName);
			} else {
				param.setMemberName(list.get(0).getMemberName());
			}
			if(!memberPW.equals("")) {
				param.setMemberPW(memberPW);
			} else {
				param.setMemberPW(list.get(0).getMemberPW());
			}
			if(!memo.equals("")) {
				param.setMemo(memo);
			} else {
				param.setMemo(list.get(0).getMemo());
			}
			// 쿼리 실행 -- 변경된 정보로 쿼리 실행
			memberService.UpdateMember(param);
			// 쿼리 실행 -- 등록이 정상적으로 되었는지 체크
			list = memberService.SelectMember(param);
			if(list.size() >= 1) {
				rt = "UpdateMember_OK";
			} else {
				rt = "UpdateMember_FAIL002";
			}

		} else {
			rt = "UpdateMember_FAIL001";
		}

		// JSON 세팅
		JSONObject json = new JSONObject();
		json.put("rt", rt);
		// MV 세팅
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("json", json);
		modelAndView.setViewName("view-json");
		return modelAndView;
	}

	/*회원 정보 삭제*/
	@RequestMapping("/delete-member")
	public ModelAndView DeleteMember(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		int memberIdx = 0;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}
		System.out.println("memberIdxStr : " + memberIdxStr);

		// 결과값 세팅
		String rt = null;
		List<MemberDTO> list = null;

		// 쿼리 실행 -- 정상적으로 등록된 회원인지 체크
		MemberDTO param =new MemberDTO();
		param.setMemberIdx(memberIdx);
		param.setMemberID("");
		param.setMemberName("");
		param.setMemberPW("");
		param.setMemo("");
		list = memberService.SelectMember(param);
		if(list.size() > 0) {
			// 쿼리 실행 -- 쿼리 실행
			memberService.DeleteMember(memberIdx);
			// 쿼리 실행 -- 삭제가 정상적으로 되었는지 체크
			list = memberService.SelectMember(param);
			if(list.size() < 1) {
				rt = "DeleteMember_OK";
			} else {
				rt = "DeleteMember_FAIL002";
			}
		} else {
			rt = "DeleteMember_FAIL001";
		}

		// JSON 세팅
		JSONObject json = new JSONObject();
		json.put("rt", rt);

		// MV 세팅
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("json", json);
		modelAndView.setViewName("view-json");
		return modelAndView;
	}

	/*RestFul API 테스트*/
	@RequestMapping(value = "/membertest")
	public Map<Integer, Object> testByResponseBody(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberID = request.getParameter("memberID")==null ? "" : request.getParameter("memberID");
		String memberName = request.getParameter("memberName")==null ? "" : request.getParameter("memberName");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String memberPW = request.getParameter("memberPW")==null ? "" : request.getParameter("memberPW");
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		int memberIdx = 0;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}

		// 결과값 세팅
		List<MemberDTO> list = null;
		String rt = null;
		int totalAll = 0;
		int total = 0;
		
		// 쿼리 실행
		MemberDTO param = new MemberDTO();
		param.setMemberIdx(memberIdx);
		param.setMemberName(memberName);
		param.setMemberID(memberID);
		param.setMemberPW(memberPW);
		param.setMemo(memo);
		list = memberService.SelectMember(param);
		total = list.size();
		if(total > 0) {
			rt = "MemberList_OK";
		} else {
			rt = "MemberList_FAIL001";
		}

		//Map 세팅
		Map<Integer, Object> data = new HashMap<>();
		for (int i=0; i<list.size(); i++) {
			Map<String, Object> member = new HashMap<>();
			MemberDTO member1 = list.get(i);
			member.put("memberIdx", member1.getMemberIdx());
			member.put("memberID", member1.getMemberID());
			data.put(i, member);
		}

		return data;
	}
}