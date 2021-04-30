package com.nyoung.drumtree.dao;

import java.util.List;

import com.nyoung.drumtree.dto.MemberDTO;

public interface MemberDAO {
	List<MemberDTO> selectMember(MemberDTO param) throws Exception;
}
