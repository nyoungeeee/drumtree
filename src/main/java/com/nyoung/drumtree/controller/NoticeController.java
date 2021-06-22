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
import com.nyoung.drumtree.dto.NoticeDTO;

@CrossOrigin("*")
@RestController
public class NoticeController {
	@Autowired
	MemberServiceImpl memberService;
	@Autowired
	NoticeServiceImpl noticeService;

	/* 공지사항 등록 */
	@RequestMapping(value = "/write-notice")
	public Map<Object, Object> WriteNotice(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String subject = request.getParameter("subject")==null ? "" : request.getParameter("subject");
		String content = request.getParameter("content")==null ? "" : request.getParameter("content");
		String isImportStr = request.getParameter("isImport")==null ? "" : request.getParameter("isImport");
		
		int memberIdx = 0;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}
		
		int isImport = 0;
		if(!isImportStr.equals("")) {
			isImport = Integer.parseInt(request.getParameter("isImport"));
		}
		
		// 결과값 세팅
		String rt = null;
		int total = 0;
		
		// 쿼리 실행
		NoticeDTO param = new NoticeDTO();
		param.setMemberIdx(memberIdx);
		param.setSubject(subject);
		param.setContent(content);
		param.setIsImport(isImport);
		total = noticeService.WriteNotice(param);
		if(total > 0) {
			rt = "WriteNotice_OK";
		} else {
			rt = "WriteNotice_FAIL001";
		}
		
		// Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);
		
		return data;
	}

	/* 공지사항 출력 */
	@RequestMapping(value = "/notices")
	public Map<Object, Object> Members(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String subject = request.getParameter("subject")==null ? "" : request.getParameter("subject");
		String content = request.getParameter("content")==null ? "" : request.getParameter("content");

		int memberIdx = 0;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}

		// 결과값 세팅
		List<NoticeDTO> list = null;
		List<MemberDTO> memberList = null;
		String rt = null;
		int totalAll = 0;
		int total = 0;

		// 쿼리 실행
		NoticeDTO param = new NoticeDTO();
		param.setMemberIdx(memberIdx);
		param.setSubject(subject);
		param.setContent(content);
		list= noticeService.SelectNotice(param);
		total = list.size();
		if(total > 0) {
			rt = "NoticeList_OK";
		} else {
			rt = "NoticeList_FAIL001";
		}

		//Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);
		data.put("total", total);
		data.put("totalAll", totalAll);
		for(int i=0; i<list.size(); i++){
			Map<String, Object> notice = new HashMap<String, Object>();
			NoticeDTO dto = list.get(i);
			//공지사항 정보 넣기
			notice.put("content", dto.getContent());
			notice.put("hit", dto.getHit());
			notice.put("isDelete", dto.getIsDelete());
			notice.put("memberIdx", dto.getMemberIdx());
			notice.put("noticeIdx", dto.getNoticeIdx());
			notice.put("regDate", dto.getRegDate());
			notice.put("subject", dto.getSubject());
			notice.put("updateDate", dto.getUpdateDate());
			//회원 정보 넣기
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
				notice.put("memberName", memberList.get(0).getMemberName());
				notice.put("memberGrade", memberList.get(0).getMemberGrade());
			} else {
				notice.put("memberName", "삭제된 회원");
				notice.put("memberGrade", "-1");
			}

			data.put(i, notice);
		}
		return data;
	}

}
