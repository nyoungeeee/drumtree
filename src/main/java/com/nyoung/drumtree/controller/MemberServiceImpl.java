package com.nyoung.drumtree.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nyoung.drumtree.dao.MemberDAO;
import com.nyoung.drumtree.dto.MemberDTO;

@Service
public class MemberServiceImpl implements MemberService{
	
	@Autowired
	MemberDAO memberDAO;
	
	@Override
	public List<MemberDTO> SelectMember(MemberDTO param, String quary) {
		return memberDAO.SelectMember(param, quary);
	}
	
	@Override
	public int SignIn(MemberDTO param) {
		return 0;
	}
}
