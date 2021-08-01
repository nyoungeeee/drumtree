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
	@RequestMapping(value = "/insert-payment")
	public Map<Object, Object> InsertPayments(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String payCodeStr = request.getParameter("payCode")==null ? "" : request.getParameter("payCode");
		String lessonCntStr = request.getParameter("lessonCnt")==null ? "" : request.getParameter("lessonCnt");
		String practiceCntStr = request.getParameter("practiceCnt")==null ? "" : request.getParameter("practiceCnt");
		String payDate = request.getParameter("payDate")==null ? "" : request.getParameter("payDate");
		String lessonRmnCntStr = request.getParameter("lessonRmnCnt")==null ? "" : request.getParameter("lessonRmnCnt");
		String practiceRmnCntStr = request.getParameter("practiceRmnCnt")==null ? "" : request.getParameter("practiceRmnCnt");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String feesStr = request.getParameter("fees")==null ? "" : request.getParameter("fees");

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
		String rt = null;
		int total = 0;

		// 쿼리 실행
		PaymentDTO param = new PaymentDTO();
		param.setMemberIdx(memberIdx);
		param.setPayCode(payCode);
		param.setLessonCnt(lessonCnt);
		param.setPracticeCnt(practiceCnt);
		param.setPayDate(payDate);
		param.setLessonRmnCnt(lessonRmnCnt);
		param.setPracticeRmnCnt(practiceRmnCnt);
		param.setMemo(memo);
		param.setFees(fees);

		total = paymentService.InsertPayment(param);
		//레슨 횟수 추가
		memberService.UpdateCnt(memberIdx, "1", lessonCnt);
		//연습 횟수 추가
		memberService.UpdateCnt(memberIdx, "2", practiceCnt);
		if(total > 0) {
			rt = "InsertPayment_OK";
		} else {
			rt = "InsertPayment_FAIL001";
		}

		// Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);

		return data;
	}
	/* 납부 정보 수정 */
	@RequestMapping(value = "/update-payment")
	public Map<Object, Object> UpdatePayment(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String payIdxStr = request.getParameter("payIdx")==null ? "" : request.getParameter("payIdx");
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String payCodeStr = request.getParameter("payCode")==null ? "" : request.getParameter("payCode");
		String lessonCntStr = request.getParameter("lessonCnt")==null ? "" : request.getParameter("lessonCnt");
		String practiceCntStr = request.getParameter("practiceCnt")==null ? "" : request.getParameter("practiceCnt");
		String payDate = request.getParameter("payDate")==null ? "" : request.getParameter("payDate");
		String memo = request.getParameter("memo")==null ? "" : request.getParameter("memo");
		String usedRsvIdx = request.getParameter("usedRsvIdx")==null ? "" : request.getParameter("usedRsvIdx");
		String feesStr = request.getParameter("fees")==null ? "" : request.getParameter("fees");
		String code = request.getParameter("code")==null ? "" : request.getParameter("code");

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

		int fees = -1;
		if(!feesStr.equals("")) {
			fees = Integer.parseInt(request.getParameter("fees"));
		}

		int isDelete = -1;

		// 결과값 세팅
		String rt = null;
		int total = 0;

		// 쿼리 실행
		PaymentDTO param = new PaymentDTO();
		param.setPayIdx(payIdx);
		param.setMemberIdx(memberIdx);
		param.setPayCode(payCode);
		param.setLessonCnt(lessonCnt);
		param.setPracticeCnt(practiceCnt);
		param.setPayDate(payDate);
		param.setMemo(memo);
		param.setUsedRsvIdx(usedRsvIdx);
		param.setFees(fees);
		param.setIsDelete(isDelete);
		param.setLessonRmnCnt(-1);
		param.setPracticeRmnCnt(-1);
		if(code.equals("1")) {

			// 삭제 처리 전 해당 연습/레슨 횟수를 member에서 삭제
			int ilessonCnt = 0;
			int ipracticeCnt = 0;
			int imemberIdx = 0;
			ilessonCnt = -paymentService.SelectPayment(param).get(0).getLessonCnt();
			ipracticeCnt = -paymentService.SelectPayment(param).get(0).getPracticeCnt();
			imemberIdx = paymentService.SelectPayment(param).get(0).getMemberIdx();
			memberService.UpdateCnt(imemberIdx, "1", ilessonCnt);
			memberService.UpdateCnt(imemberIdx, "2", ipracticeCnt);
			
			// code가 1으로 오면 삭제 처리
			param.setIsDelete(1);

		}
		total = paymentService.UpdatePayment(param);
		if(total > 0) {
			rt = "UpdatePayment_OK";
		} else {
			rt = "UpdatePayment_FAIL001";
		}

		// Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);

		return data;
	}

	/* 횟수 변경 */
	@RequestMapping(value = "/change-cnt")
	public Map<Object, Object> RmnCntPayment(HttpServletRequest request) throws Exception {
		// 한글 인코딩 설정
		request.setCharacterEncoding("UTF-8");

		// 들어온 값
		String memberIdxStr = request.getParameter("memberIdx")==null ? "" : request.getParameter("memberIdx");
		String code = request.getParameter("code")==null ? "" : request.getParameter("code");
		String cntStr = request.getParameter("cnt")==null ? "" : request.getParameter("cnt");

		int memberIdx = -1;
		if(!memberIdxStr.equals("")) {
			memberIdx = Integer.parseInt(request.getParameter("memberIdx"));
		}

		int cnt = -1;
		if(!cntStr.equals("")) {
			cnt = Integer.parseInt(request.getParameter("cnt"));
		}

		// 결과값 세팅
		String rt = null;
		int total = 0;

		total = memberService.UpdateCnt(memberIdx, code, cnt);
		if(total > 0) {
			rt = "ChangeCntPayment_OK";
		} else {
			rt = "ChangeCntPayment_FAIL001";
		}

		// Map 세팅
		Map<Object, Object> data = new HashMap<>();;
		data.put("rt", rt);

		return data;
	}
}
