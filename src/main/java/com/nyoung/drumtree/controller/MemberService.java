package com.nyoung.drumtree.controller;

import java.util.List;

import com.nyoung.drumtree.dto.MemberDTO;

public interface MemberService {
	/*멤버 리스트(검색/전체)*/
	public List<MemberDTO> SelectMember(MemberDTO param);
	/*회원 등록*/
	public int SignIn(MemberDTO param);
	/*회원 정보 수정*/
	public int UpdateMember(MemberDTO param);
	/*회원 정보 삭제*/
	public int DeleteMember(int memberIdx);
	/*회원 승인*/
	public int ApprovalMember(int memberIdx, int memberGrade);
	/*잔여 횟수 수정*/
	public int UpdateCnt(int memberIdx, String code, int cnt);
}
