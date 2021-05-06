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

	//멤버 리스트(검색/전체)
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
		String quary ="";
		MemberDTO member1 = new MemberDTO(0, null, memberID, null, null);
		quary = "where memberID";
//		System.out.println(quary);
		list = memberService.SelectMember(member1, quary);
		total = list.size();
		if(total > 0) {
			rt = "MemberList_OK";
		} else {
			rt = "MemberList_FAIL";
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


	//	/*Member List*/
	//	@RequestMapping("/members")
	//	public List<MemberDTO> members(@RequestParam(value = "memberID", defaultValue = "")String memberID) throws Exception {
	//		final MemberDTO param = new MemberDTO(0, null, memberID, null, null);
	//		final List<MemberDTO> memberList = memberDAO.SelectMember(param);
	//		
	//		return memberList;
	//	}
	//	
	/*회원 등록*/
	@RequestMapping("/signin")
	public String signIn(
			@RequestParam(value = "memberName", defaultValue = "") String memberName, 
			@RequestParam(value = "memberID", defaultValue = "") String memberID,
			@RequestParam(value = "memberPW", defaultValue = "") String memberPW,
			@RequestParam(value = "memo", defaultValue = "") String memo
			) throws Exception  {

		//유효여부 체크
		boolean isCorrect = true;

		//가져온 값 체크
		if(memberName.equals("")) {
			isCorrect = false;
		}
		if(memberID.equals("")) {
			isCorrect = false;
		}
		if(memberPW.equals("")) {
			isCorrect = false;
		}


		//DTO에 넣기
		final MemberDTO param = new MemberDTO(0, memberName, memberID, memberPW, memo);

		//SQL 처리
		String result = "";

		if(isCorrect==true) {
			int quaryResult = 0;

		} else {
			result = "값이 없습니다.";
		}


		return result;
	}
}
