package com.nyoung.drumtree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class MemberDTO {
	private int memberIdx;
	private String memberName;
	private String memberID;
	private String memberPW;
	private String memo;
}
