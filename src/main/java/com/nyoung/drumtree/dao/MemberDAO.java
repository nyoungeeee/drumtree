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
	
	//멤버 리스트
	public List<MemberDTO> SelectMember(MemberDTO param, String quary) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberName", param.getMemberName());
		map.put("memberID", param.getMemberID());
		map.put("memberPW", param.getMemberPW());
		map.put("memo", param.getMemo());
		map.put("quary", quary);
		return sqlSession.selectList("com.nyoung.drumtree.MemberMapper.selectMember", map);
	}
	
	//멤버 추가
	public int SignIn(MemberDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberName", param.getMemberName());
		map.put("memberID", param.getMemberID());
		map.put("memberPW", param.getMemberPW());
		map.put("memo", param.getMemo());
		return sqlSession.insert("com.nyoung.drumtree.mybatis.member.selectMember",map);
	}
}
