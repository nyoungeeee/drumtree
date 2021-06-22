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
	
	/* 공지사항 등록 */
	public int WriteNotice(NoticeDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("noticeIdx", param.getNoticeIdx());
		map.put("subject", param.getSubject());
		map.put("content", param.getContent());
		map.put("memberIdx", param.getMemberIdx());
		map.put("regDate", param.getRegDate());
		map.put("updateDate", param.getUpdateDate());
		map.put("isDelete", param.getIsDelete());
		map.put("hit", param.getHit());
		map.put("isImport", param.getIsImport());
		return sqlSession.insert("com.nyoung.drumtree.NoticeMapper.writeNotice", map);
	}
	
	/* 조회수 증가 */
	public int UpdateHit(NoticeDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("noticeIdx", param.getNoticeIdx());
		map.put("subject", param.getSubject());
		map.put("content", param.getContent());
		map.put("memberIdx", param.getMemberIdx());
		map.put("regDate", param.getRegDate());
		map.put("updateDate", param.getUpdateDate());
		map.put("isDelete", param.getIsDelete());
		map.put("hit", param.getHit());
		map.put("isImport", param.getIsImport());
		return sqlSession.insert("com.nyoung.drumtree.NoticeMapper.updateHit", map);
	}
	
	/* 공지사항 삭제 */
	public int DeleteNotice(NoticeDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("noticeIdx", param.getNoticeIdx());
		map.put("subject", param.getSubject());
		map.put("content", param.getContent());
		map.put("memberIdx", param.getMemberIdx());
		map.put("regDate", param.getRegDate());
		map.put("updateDate", param.getUpdateDate());
		map.put("isDelete", param.getIsDelete());
		map.put("hit", param.getHit());
		map.put("isImport", param.getIsImport());
		return sqlSession.delete("com.nyoung.drumtree.NoticeMapper.deleteNotice", map);
	}
	
	/* 공지사항 수정 */	
	public int UpdateNotice(NoticeDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("noticeIdx", param.getNoticeIdx());
		map.put("subject", param.getSubject());
		map.put("content", param.getContent());
		map.put("memberIdx", param.getMemberIdx());
		map.put("regDate", param.getRegDate());
		map.put("updateDate", param.getUpdateDate());
		map.put("isDelete", param.getIsDelete());
		map.put("hit", param.getHit());
		map.put("isImport", param.getIsImport());
		return sqlSession.update("com.nyoung.drumtree.NoticeMapper.updateNotice", map);
	}
	
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
		map.put("isImport", param.getIsImport());
		return sqlSession.selectList("com.nyoung.drumtree.NoticeMapper.selectNotice", map);
	}
	
	
}
