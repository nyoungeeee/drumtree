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
	
	/* 공지사항 출력 */
	@Override
	public List<NoticeDTO> SelectNotice(NoticeDTO param) {
		return noticeDAO.SelectNotice(param);
	}
	
	
}
