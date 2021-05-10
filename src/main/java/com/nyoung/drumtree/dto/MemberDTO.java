package com.nyoung.drumtree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberDTO {
	private int memberIdx;
	private String memberName;
	private String memberID;
	private String memberPW;
	private String memo;
	private String signinDate;
	private int isDelete;
	private String deleteDate;
	private String updateDate;
	private int isApproval;

}
