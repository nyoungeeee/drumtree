package com.nyoung.drumtree.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nyoung.drumtree.dao.NoticeDAO;
import com.nyoung.drumtree.dto.NoticeDTO;

@Service
public class NoticeServiceImpl implements NoticeService {
	@Autowired
	NoticeDAO noticeDAO;
	
	/* 공지사항 등록 */
	@Override
	public int WriteNotice(NoticeDTO param) {
		return noticeDAO.WriteNotice(param);
	}

	/* 조회수 증가 */
	@Override
	public int UpdateHit(NoticeDTO param) {
		return noticeDAO.UpdateHit(param);
	}
	
	/* 공지사항 삭제 */
	@Override
	public int DeleteNotice(NoticeDTO param) {
		return noticeDAO.DeleteNotice(param);
	}
	
	/* 공지사항 수정 */	
	@Override
	public int UpdateNotice(NoticeDTO param) {
		return noticeDAO.UpdateNotice(param);
	}
	
	/* 공지사항 출력 */
	@Override
	public List<NoticeDTO> SelectNotice(NoticeDTO param) {
		return noticeDAO.SelectNotice(param);
	}

}
