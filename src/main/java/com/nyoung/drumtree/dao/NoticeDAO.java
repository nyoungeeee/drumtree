package com.nyoung.drumtree.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.nyoung.drumtree.dto.NoticeDTO;

@Repository
public class NoticeDAO {
	@Autowired
	SqlSession sqlSession;
	
	/* 공지사항 출력 */
	public List<NoticeDTO> SelectNotice(NoticeDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("noticeIdx", param.getNoticeIdx());
		map.put("subject", param.getSubject());
		map.put("content", param.getContent());
		map.put("memberIdx", param.getMemberIdx());
		map.put("regDate", param.getRegDate());
		map.put("updateDate", param.getUpdateDate());
		map.put("isDelete", param.getIsDelete());
		map.put("hit", param.getHit());
		return sqlSession.selectList("com.nyoung.drumtree.NoticeMapper.selectNotice", map);
	}
	
	
}
