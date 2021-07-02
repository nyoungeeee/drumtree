package com.nyoung.drumtree.controller;

import java.util.List;

import com.nyoung.drumtree.dto.RsvDTO;

public interface RsvService {
	/*예약 리스트(검색/전체)*/
	public List<RsvDTO> SelectRsv(RsvDTO param);
	/*예약 등록*/
	public int WriteRsv(RsvDTO param);
	/*예약 수정*/
	public int UpdateRsv(RsvDTO param);
	/*예약 취소*/
	public int DeleteRsv(RsvDTO param);
	/*예약 승인, 승인 취소*/
	public int ApprovalRsv(RsvDTO param);
}
