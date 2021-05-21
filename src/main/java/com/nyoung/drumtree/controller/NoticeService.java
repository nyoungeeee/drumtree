package com.nyoung.drumtree.controller;

import java.util.List;

import com.nyoung.drumtree.dto.NoticeDTO;

public interface NoticeService {
	
	/* 공지사항 출력 */
	public List<NoticeDTO> SelectNotice(NoticeDTO param);
}
