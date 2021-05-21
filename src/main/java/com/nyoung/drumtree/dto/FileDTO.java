package com.nyoung.drumtree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FileDTO {
	private int fileIdx;
	private int noticeIdx;
	private String fileName;
	private String uuid;
	private String filePath;
	private String fileType;
	private String regDate;
}
