package com.nyoung.drumtree.controller;

import java.util.List;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nyoung.drumtree.dao.MemberDAO;
import com.nyoung.drumtree.dto.MemberDTO;

@RestController
@MapperScan(basePackages = "com.nyoung.drumtree.dao")
public class MemberController {
	@Autowired
	private MemberDAO memberDAO;
	
	@RequestMapping("/members")
	public List<MemberDTO> members(@RequestParam(value = "memberID", defaultValue = "")String memberID) throws Exception {
		final MemberDTO param = new MemberDTO(0, null, memberID, null, null);
		final List<MemberDTO> memberList = memberDAO.selectMember(param);
		
		return memberList;
	}

}
