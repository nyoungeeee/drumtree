package com.nyoung.drumtree.controller;

import java.util.List;

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
		String memberID = null;
		String memberName = null;
		String memo = null;
		memberID = request.getParameter("memberID");
		memberName = request.getParameter("memberName");
		memo = request.getParameter("memo");
		// 결과값 세팅
		List<MemberDTO> list = null;
		String rt = null;
		int totalAll = 0;
		int total = 0;

		// 쿼리 실행
		MemberDTO member1 = new MemberDTO(0, memberName, memberID, null, memo);
		list = memberService.SelectMember(member1);
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
		String memberID = null;
		String memberName = null;
		String memberPW = null;
		String memo = null;
		memberID = request.getParameter("memberID");
		memberName = request.getParameter("memberName");
		memberPW = request.getParameter("memberPW");
		memo = request.getParameter("memo");
		
		// 결과값 세팅
		String rt = null;
		List<MemberDTO> list = null;
		
		// 쿼리 실행 -- 이미 등록된 회원인지 체크(ID체크)
		MemberDTO param =new MemberDTO(0, null, memberID, null, null);
		list = memberService.SelectMember(param);
		
		// 쿼리 실행 -- 회원 등록 진행
		if(list.size() > 0) {
			rt = "SignIn_FAIL001";
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
				rt = "SignIn_FAIL002";
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

}