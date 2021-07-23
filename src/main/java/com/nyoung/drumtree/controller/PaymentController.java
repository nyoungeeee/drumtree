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
import com.nyoung.drumtree.dto.PaymentDTO;

@CrossOrigin("*")
@RestController
public class PaymentController {
	@Autowired
	MemberServiceImpl memberService;
	@Autowired
	PaymentServiceImpl paymentService;

	/* 납부 리스트(검색/전체) */
	@RequestMapping(value = "/payments")
	public Map<Object, Object> Payments(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String payIdxStr = request.getParameter("payIdx")==null ? "" : request.getParameter("payIdx");
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String payCodeStr = request.getParameter("payCode")==null ? "" : request.getParameter("payCode");
		String lessonCntStr = request.getParameter("lessonCnt")==null ? "" : request.getParameter("lessonCnt");
		String practiceCntStr = request.getParameter("practiceCnt")==null ? "" : request.getParameter("practiceCnt");
		String payDate = request.getParameter("payDate")==null ? "" : request.getParameter("payDate");
		String lessonRmnCntStr = request.getParameter("lessonRmnCnt")==null ? "" : request.getParameter("lessonRmnCnt");
		String practiceRmnCntStr = request.getParameter("practiceRmnCnt")==null ? "" : request.getParameter("practiceRmnCnt");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String usedRsvIdx = request.getParameter("usedRsvIdx")==null ? "" : request.getParameter("usedRsvIdx");
		String feesStr = request.getParameter("fees")==null ? "" : request.getParameter("fees");
		String memberName = request.getParameter("memberName")==null ? "" : request.getParameter("memberName");
		int payIdx = -1;
		if(!payIdxStr.equals("")) {
			payIdx = Integer.parseInt(request.getParameter("payIdx"));
		}
		int memberIdx = -1;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}
		int payCode = -1;
		if(!payCodeStr.equals("")) {
			payCode = Integer.parseInt(request.getParameter("payCode"));
		}
		int lessonCnt = -1;
		if(!lessonCntStr.equals("")) {
			lessonCnt = Integer.parseInt(request.getParameter("lessonCnt"));
		}
		int practiceCnt = -1;
		if(!practiceCntStr.equals("")) {
			practiceCnt = Integer.parseInt(request.getParameter("practiceCnt"));
		}
		int lessonRmnCnt = -1;
		if(!lessonRmnCntStr.equals("")) {
			lessonRmnCnt = Integer.parseInt(request.getParameter("lessonRmnCnt"));
		}
		int practiceRmnCnt = -1;
		if(!practiceRmnCntStr.equals("")) {
			practiceRmnCnt = Integer.parseInt(request.getParameter("practiceRmnCnt"));
		}

		int fees = -1;
		if(!feesStr.equals("")) {
			fees = Integer.parseInt(request.getParameter("fees"));
		}

		// 결과값 세팅
		List<PaymentDTO> list = null;
		List<MemberDTO> memberList = null;
		String rt = "";
		int totalAll = 0;
		int total = 0;
		
		// 쿼리 실행 -- 회원이름 >> 회원번호로 변환
		if(!memberName.equals("")) {
			List<MemberDTO> searchMemberList = null;
			MemberDTO searchMember = new MemberDTO();
			searchMember.setMemberIdx(0);
			searchMember.setMemberID("");
			searchMember.setMemberPW("");
			searchMember.setMemo("");
			searchMember.setMemberGrade(-1);
			searchMember.setIsApproval(-1);
			searchMember.setMemberName(memberName);
			searchMemberList = memberService.SelectMember(searchMember);
			if(searchMemberList.size() > 0) {
				memberIdx = searchMemberList.get(0).getMemberIdx();
			} else {
				rt = "PaymentList_FAIL002";	//검색된 회원 이름이 없음
			}
			
		}
		
		// 쿼리 실행
		PaymentDTO param = new PaymentDTO();
		param.setPayIdx(payIdx);
		param.setMemberIdx(memberIdx);
		param.setPayCode(payCode);
		param.setLessonCnt(lessonCnt);
		param.setPracticeCnt(practiceCnt);
		param.setPayDate(payDate);
		param.setLessonRmnCnt(lessonRmnCnt);
		param.setPracticeRmnCnt(practiceRmnCnt);
		param.setMemo(memo);
		param.setUsedRsvIdx(usedRsvIdx);
		param.setFees(fees);
		list = paymentService.SelectPayment(param);
		total = list.size();
		if(total > 0) {
			rt = "PaymentList_OK";
		} else {
			if(!rt.equals("PaymentList_FAIL002")) {
				rt = "PaymentList_FAIL001";
			}
		}

		//Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);
		data.put("total", total);
		data.put("totalAll", totalAll);
		for(int i=0; i<list.size(); i++){
			Map<String, Object> payment = new HashMap<String, Object>();
			PaymentDTO dto = list.get(i);
			// 납부 정보 넣기
			payment.put("payIdx", dto.getPayIdx());
			payment.put("memberIdx", dto.getMemberIdx());
			payment.put("payCode", dto.getPayCode());
			payment.put("lessonCnt", dto.getLessonCnt());
			payment.put("practiceCnt", dto.getPracticeCnt());
			payment.put("payDate", dto.getPayDate());
			payment.put("lessonRmnCnt", dto.getLessonRmnCnt());
			payment.put("practiceRmnCnt", dto.getPracticeRmnCnt());
			payment.put("memo", dto.getMemo());
			payment.put("usedRsvIdxStr", dto.getUsedRsvIdx());
			payment.put("fees", dto.getFees());
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
				payment.put("memberName", memberList.get(0).getMemberName());
				payment.put("memberGrade", memberList.get(0).getMemberGrade());
			} else {
				payment.put("memberName", "삭제된 회원");
				payment.put("memberGrade", "-1");
			}
			
			data.put(i, payment);
		}
		return data;
	}


	/* 납부 정보 등록 */

	/* 납부 정보 수정 */

	/* 납부 정보 삭제 */
}
