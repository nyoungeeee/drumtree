package com.nyoung.drumtree.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.nyoung.drumtree.dto.PaymentDTO;

@Repository
public class PaymentDAO {
	@Autowired
	SqlSession sqlSession;
	
	/* 납부 리스트(검색/전체) */
	public List<PaymentDTO> SelectPayment(PaymentDTO param){
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("payIdx", param.getPayIdx());
		map.put("memberIdx", param.getMemberIdx());
		map.put("payCode", param.getPayCode());
		map.put("lessonCnt", param.getLessonCnt());
		map.put("practiceCnt", param.getPracticeCnt());
		map.put("payDate", param.getPayDate());
		map.put("lessonRmnCnt", param.getLessonRmnCnt());
		map.put("practiceRmnCnt", param.getPracticeRmnCnt());
		map.put("memo", param.getMemo());
		map.put("usedRsvIdx", param.getUsedRsvIdx());
		map.put("fees", param.getFees());
		return sqlSession.selectList("com.nyoung.drumtree.PaymentMapper.selectPayment", map);
	}
	
	/* 납부 정보 등록 */
	public int InsertPayment(PaymentDTO param) {
		System.out.println("진입");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", param.getMemberIdx());
		map.put("payCode", param.getPayCode());
		map.put("lessonCnt", param.getLessonCnt());
		map.put("practiceCnt", param.getPracticeCnt());
		map.put("payDate", param.getPayDate());
		map.put("lessonRmnCnt", param.getLessonRmnCnt());
		map.put("practiceRmnCnt", param.getPracticeRmnCnt());
		map.put("memo", param.getMemo());
		map.put("fees", param.getFees());
		return sqlSession.insert("com.nyoung.drumtree.PaymentMapper.insertPayment", map);
	};

	/* 납부 정보 수정 */
	public int UpdatePayment(PaymentDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("payIdx", param.getPayIdx());
		map.put("memberIdx", param.getMemberIdx());
		map.put("payCode", param.getPayCode());
		map.put("lessonCnt", param.getLessonCnt());
		map.put("practiceCnt", param.getPracticeCnt());
		map.put("payDate", param.getPayDate());
		map.put("memo", param.getMemo());
		map.put("usedRsvIdx", param.getUsedRsvIdx());
		map.put("fees", param.getFees());
		map.put("isDelete", param.getIsDelete());
		return sqlSession.update("com.nyoung.drumtree.PaymentMapper.updatePayment", map);
	};

	/* 횟수 변경 */
	public int RmnCntPayment(int memberIdx, String code, int cnt) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", memberIdx);
		map.put("code", code);
		map.put("cnt", cnt);
		return sqlSession.update("com.nyoung.drumtree.PaymentMapper.changeCntPayment", map);
	};
	
	/* 멤버 테이블의 횟수 변경 */
	public int ChangeCntMember(int memberIdx, String code) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", memberIdx);
		map.put("code", code);
		return sqlSession.update("com.nyoung.drumtree.PaymentMapper.changeCntMember", map);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
