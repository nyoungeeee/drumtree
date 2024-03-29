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
@CrossOrigin("*")
@RestController
public class MemberController {
	@Autowired
	MemberServiceImpl memberService;

	/*멤버 리스트(검색/전체)*/
	@RequestMapping(value = "/members")
	public Map<Object, Object> Members(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String reqCode = request.getParameter("reqCode")==null ? "" : request.getParameter("reqCode");
		String memberID = request.getParameter("memberID")==null ? "" : request.getParameter("memberID");
		String memberName = request.getParameter("memberName")==null ? "" : request.getParameter("memberName");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String memoAdmin = request.getParameter("memoAdmin")==null ? "" : request.getParameter("memoAdmin");
		String memberPW = request.getParameter("memberPW")==null ? "" : request.getParameter("memberPW");
		String isApprovalStr = request.getParameter("isApproval")==null ? "" : request.getParameter("isApproval");
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String memberGradeStr = request.getParameter("memberGrade")==null ? "" : request.getParameter("memberGrade");

		int memberIdx = 0;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}
		int isApproval = -1;
		if(!isApprovalStr.equals("")) {
			isApproval = Integer.parseInt(request.getParameter("isApproval"));
		}
		int memberGrade = -1;
		if(!memberGradeStr.equals("")) {
			memberGrade = Integer.parseInt(request.getParameter("memberGrade"));
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
		param.setIsApproval(isApproval);
		param.setMemoAdmin(memoAdmin);
		param.setMemberGrade(memberGrade);
		list = memberService.SelectMember(param);
		total = list.size();
		if(total > 0) {
			rt = "MemberList_OK";
		} else {
			rt = "MemberList_FAIL001";
		}

		//Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);
		data.put("total", total);
		data.put("totalAll", totalAll);

		if(reqCode.equals("0")) {	// 요청코드가 0(PW 일치여부 확인)
			for (int i=0; i<list.size(); i++) {
				Map<String, Object> member = new HashMap<>();
				MemberDTO member1 = list.get(i);
				member.put("memberIdx", member1.getMemberIdx());
				member.put("memberName", member1.getMemberName());
				member.put("memberID", member1.getMemberID());
				member.put("memberPW", member1.getMemberPW());
				member.put("memo", member1.getMemo());
				member.put("signinDate", member1.getSigninDate());
				member.put("deleteDate", member1.getDeleteDate());
				member.put("updateDate", member1.getUpdateDate());
				member.put("isDelete", member1.getIsDelete());
				member.put("isApproval", member1.getIsApproval());
				member.put("memoAdmin", member1.getMemoAdmin());
				member.put("memberGrade", member1.getMemberGrade());
				member.put("lessonCnt", member1.getLessonCnt());
				member.put("practiceCnt", member1.getPracticeCnt());
				data.put(i, member);
			}
		} else {	//일반적인 경우, PW 노출하지 않음
			for (int i=0; i<list.size(); i++) {
				Map<String, Object> member = new HashMap<>();
				MemberDTO member1 = list.get(i);
				member.put("memberIdx", member1.getMemberIdx());
				member.put("memberName", member1.getMemberName());
				member.put("memberID", member1.getMemberID());
				member.put("memo", member1.getMemo());
				member.put("signinDate", member1.getSigninDate());
				member.put("deleteDate", member1.getDeleteDate());
				member.put("updateDate", member1.getUpdateDate());
				member.put("isDelete", member1.getIsDelete());
				member.put("isApproval", member1.getIsApproval());
				member.put("memoAdmin", member1.getMemoAdmin());
				member.put("memberGrade", member1.getMemberGrade());
				member.put("lessonCnt", member1.getLessonCnt());
				member.put("practiceCnt", member1.getPracticeCnt());
				data.put(i, member);
			}
		}

		return data;
	}

	/*회원 등록*/
	@RequestMapping("/signin")
	public Map<Object, Object> SignIn(HttpServletRequest request) throws Exception {

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
		param.setMemberGrade(-1);
		param.setIsApproval(-1);
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
		

		//Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);

		return data;
	}

	/*회원 정보 수정*/
	@RequestMapping("/update-member")
	public Map<Object, Object> UpdateMember(HttpServletRequest request) throws Exception {

		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberID = request.getParameter("memberID")==null ? "" : request.getParameter("memberID");
		String memberName = request.getParameter("memberName")==null ? "" : request.getParameter("memberName");
		String memoAdmin = request.getParameter("memoAdmin")==null ? "" : request.getParameter("memoAdmin");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String memberPW = request.getParameter("memberPW")==null ? "" : request.getParameter("memberPW");
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String memberGradeStr = request.getParameter("memberGrade")==null ? "" : request.getParameter("memberGrade");
		int memberIdx = 0;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}
		int memberGrade = 0;
		if(!memberGradeStr.equals("")) {
			memberGrade = Integer.parseInt(request.getParameter("memberGrade"));
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
		param.setMemoAdmin("");
		param.setIsApproval(-1);
		param.setMemberGrade(-1);
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
			if(!memoAdmin.equals("")) {
				param.setMemoAdmin(memoAdmin);
			} else {
				param.setMemoAdmin(list.get(0).getMemoAdmin());
			}
			if(memberGrade!=-1) {
				param.setMemberGrade(memberGrade);
			} else {
				param.setMemberGrade(list.get(0).getMemberGrade());
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

		//Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);

		return data;

	}


	/*회원 정보 삭제*/
	@RequestMapping("/delete-member")
	public Map<Object, Object> DeleteMember(HttpServletRequest request) throws Exception {

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
		param.setIsApproval(-1);
		param.setMemberGrade(-1);
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

		//Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);

		return data;
	}

	/*회원 승인*/
	@RequestMapping(value = "/approval-member")
	public Map<Object, Object> ApprovalMember(HttpServletRequest request) throws Exception {

		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String memberGradeStr = request.getParameter("memberGrade")==null ? "" : request.getParameter("memberGrade");
		String memoAdmin = request.getParameter("memoAdmin")==null ? "" : request.getParameter("memoAdmin");
		int memberIdx = 0;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}
		int memberGrade = 0;
		if(!memberGradeStr.equals("")) {
			memberGrade = Integer.parseInt(request.getParameter("memberGrade"));
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
		param.setMemoAdmin("");
		param.setMemberGrade(-1);
		list = memberService.SelectMember(param);
		if(list.size() > 0) {
			// 쿼리 실행 -- 승인 쿼리 실행
			memberService.ApprovalMember(memberIdx, memberGrade);
			// 쿼리 실행 -- 정보 업데이트 쿼리 실행
			param.setMemoAdmin(memoAdmin);
			memberService.UpdateMember(param);
			// 쿼리 실행 -- 삭제가 정상적으로 되었는지 체크
			param.setIsApproval(-1);

			list = memberService.SelectMember(param);
			if(list.get(0).getIsApproval() == 1) {
				rt = "ApprovalMember_OK";
			} else {
				rt = "ApprovalMember_FAIL002";
			}
		} else {
			rt = "ApprovalMember_FAIL001";
		}

		//Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);

		return data;
	}

}