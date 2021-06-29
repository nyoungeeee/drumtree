package com.nyoung.drumtree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RsvDTO {
	private int rsvIdx;
	private int memberIdx;
	private int rsvType;
	private int roomType;
	private int isApproval;
	private int isDelete;
	private String start;
	private String end;
	private String regDate;
	private String updateDate;
	private String memo;
}
