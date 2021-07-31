package com.nyoung.drumtree.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.nyoung.drumtree.dto.MemberDTO;

@Repository
public class MemberDAO {
	@Autowired
	SqlSession sqlSession;
	
	/*멤버 리스트(검색/전체)*/
	public List<MemberDTO> SelectMember(MemberDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", param.getMemberIdx());
		map.put("memberName", param.getMemberName());
		map.put("memberID", param.getMemberID());
		map.put("memberPW", param.getMemberPW());
		map.put("memo", param.getMemo());
		map.put("isApproval", param.getIsApproval());
		map.put("memberGrade", param.getMemberGrade());
		return sqlSession.selectList("com.nyoung.drumtree.MemberMapper.selectMember", map);
	}
	
	/*회원 등록*/
	public int SignIn(MemberDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberName", param.getMemberName());
		map.put("memberID", param.getMemberID());
		map.put("memberPW", param.getMemberPW());
		map.put("memo", param.getMemo());
		return sqlSession.insert("com.nyoung.drumtree.MemberMapper.signIn", map);
	}
	
	/*회원 정보 수정*/
	public int UpdateMember(MemberDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", param.getMemberIdx());
		map.put("memberName", param.getMemberName());
		map.put("memberID", param.getMemberID());
		map.put("memberPW", param.getMemberPW());
		map.put("memo", param.getMemo());
		map.put("memoAdmin", param.getMemoAdmin());
		map.put("memberGrade", param.getMemberGrade());
		return sqlSession.update("com.nyoung.drumtree.MemberMapper.updateMember", map);
	}
	
	/*회원 정보 삭제*/
	public int DeleteMember(int memberIdx) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", memberIdx);
		return sqlSession.update("com.nyoung.drumtree.MemberMapper.deleteMember", map);
	}
	
	/*회원 승인*/
	public int ApprovalMember(int memberIdx, int memberGrade) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", memberIdx);
		map.put("memberGrade", memberGrade);
		return sqlSession.update("com.nyoung.drumtree.MemberMapper.approvalMember", map);
	}
	
	/*잔여 횟수 수정*/
	public int UpdateCnt(int memberIdx, String code, int cnt) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", memberIdx);
		map.put("code", code);
		map.put("cnt", cnt);
		return sqlSession.update("com.nyoung.drumtree.MemberMapper.updateCnt", map);
	}
	
	
	
	
	
	
	
}
