package com.nyoung.drumtree.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nyoung.drumtree.dao.RsvDAO;
import com.nyoung.drumtree.dto.RsvDTO;

@Service
public class RsvServiceImpl implements RsvService {
	
	@Autowired
	RsvDAO rsvDAO;
	
	@Override
	public List<RsvDTO> SelectRsv(RsvDTO param) {
		return rsvDAO.SelectRsv(param);
	}

	@Override
	public int WriteRsv(RsvDTO param) {
		return rsvDAO.WriteRsv(param);
	}

	@Override
	public int UpdateRsv(RsvDTO param) {
		return rsvDAO.UpdateRsv(param);
	}

	@Override
	public int DeleteRsv(RsvDTO param) {
		return rsvDAO.DeleteRsv(param);
	}

	@Override
	public int ApprovalRsv(RsvDTO param) {
		return rsvDAO.ApprovalRsv(param);
	}

	@Override
	public List<RsvDTO> UsedRsvList(String usedRsvIdx) {
		return rsvDAO.UsedRsvList(usedRsvIdx);
	}

}
