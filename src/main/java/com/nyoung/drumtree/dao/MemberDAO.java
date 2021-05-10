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
		return sqlSession.update("com.nyoung.drumtree.MemberMapper.updateMember", map);
	}
	
	/*회원 정보 삭제*/
	public int DeleteMember(int memberIdx) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", memberIdx);
		return sqlSession.update("com.nyoung.drumtree.MemberMapper.deleteMember", map);
	}
}
