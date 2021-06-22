package com.nyoung.drumtree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NoticeDTO {
	private int noticeIdx;
	private String subject;
	private String content;
	private int memberIdx;
	private String regDate;
	private String updateDate;
	private int isDelete;
	private int hit;
	private int isImport;
}
