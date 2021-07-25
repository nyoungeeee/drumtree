package com.nyoung.drumtree.controller;

import java.util.List;

import com.nyoung.drumtree.dto.PaymentDTO;

public interface PaymentService {
	
	/* 납부 리스트(검색/전체) */
	public List<PaymentDTO> SelectPayment(PaymentDTO param);
	/* 납부 정보 등록 */
	public int InsertPayment(PaymentDTO param);
	/* 납부 정보 수정 */
	public int UpdatePayment(PaymentDTO param);
	/* 횟수 변경 */
	public int RmnCntPayment(int payIdx, String code, int cnt);
	
}
