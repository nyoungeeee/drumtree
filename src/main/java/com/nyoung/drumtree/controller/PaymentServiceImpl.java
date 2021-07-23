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
		return 0;
	}

	/* 납부 정보 수정 */
	@Override
	public int UpdatePayment(PaymentDTO param) {
		// TODO Auto-generated method stub
		return 0;
	}

	/* 납부 정보 삭제 */
	@Override
	public int DeletePayment(PaymentDTO param) {
		// TODO Auto-generated method stub
		return 0;
	}
	
}
