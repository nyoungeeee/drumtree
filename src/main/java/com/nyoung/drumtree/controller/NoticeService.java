package com.nyoung.drumtree.controller;

import java.util.List;

import com.nyoung.drumtree.dto.NoticeDTO;

public interface NoticeService {
	/* 공지사항 등록 */
	public int WriteNotice(NoticeDTO param);

	/* 조회수 증가 */
	public int UpdateHit(NoticeDTO param);

	/* 공지사항 삭제 */
	public int DeleteNotice(NoticeDTO param);

	/* 공지사항 수정 */	
	public int UpdateNotice(NoticeDTO param);
	
	/* 공지사항 출력 */
	public List<NoticeDTO> SelectNotice(NoticeDTO param);

}
