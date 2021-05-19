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
	
	/*멤버 리스트(검색/전체)*/
	@Override
	public List<MemberDTO> SelectMember(MemberDTO param) {
		return memberDAO.SelectMember(param);
	}
	
	/*회원 등록*/
	@Override
	public int SignIn(MemberDTO param) {
		return memberDAO.SignIn(param);
	}
	
	/*회원 정보 수정*/
	@Override
	public int UpdateMember(MemberDTO param) {
		return memberDAO.UpdateMember(param);
	}
	
	/*회원 정보 삭제*/
	@Override
	public int DeleteMember(int memberIdx) {
		return memberDAO.DeleteMember(memberIdx);
	}

	/*회원 승인*/
	@Override
	public int ApprovalMember(int memberIdx) {
		return memberDAO.ApprovalMember(memberIdx);
	}
}
