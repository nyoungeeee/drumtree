package com.nyoung.drumtree.controller;

import java.util.List;

import com.nyoung.drumtree.dto.MemberDTO;

public interface MemberService {
	// 멤버 리스트
	public List<MemberDTO> SelectMember(MemberDTO param, String quary);
	// 멤버 등록
	public int SignIn(MemberDTO param);
}
