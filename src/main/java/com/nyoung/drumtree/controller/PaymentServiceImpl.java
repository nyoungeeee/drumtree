package com.nyoung.drumtree.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.nyoung.drumtree.dao.PaymentDAO;
import com.nyoung.drumtree.dto.PaymentDTO;

@Service
public class PaymentServiceImpl implements PaymentService {
	
	@Autowired
	PaymentDAO paymentDAO;
	
	/* 납부 리스트(검색/전체) */
	@Override
	public List<PaymentDTO> SelectPayment(PaymentDTO param) {
		return paymentDAO.SelectPayment(param);
	}

	/* 납부 정보 등록 */
	@Override
	public int InsertPayment(PaymentDTO param) {
		// TODO Auto-generated method stub
		return paymentDAO.InsertPayment(param);
	}

	/* 납부 정보 수정 */
	@Override
	public int UpdatePayment(PaymentDTO param) {
		// TODO Auto-generated method stub
		return paymentDAO.UpdatePayment(param);
	}
	
	/* 횟수 변경 */
	@Override
	public int RmnCntPayment(int memberIdx, String code, int cnt) {
		// TODO Auto-generated method stub
		return paymentDAO.RmnCntPayment(memberIdx, code, cnt);
	}
	
	/* 멤버 테이블의 횟수 변경 */
	@Override
	public int ChangeCntMember(int memberIdx, String code) {
		// TODO Auto-generated method stub
		return paymentDAO.ChangeCntMember(memberIdx, code);
	}
	
}
