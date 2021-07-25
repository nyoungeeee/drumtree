package com.nyoung.drumtree.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
	private int payIdx;				//payment 고유번호
	private int memberIdx;			//연관 멤버 Idx
	private int payCode;			//납부 분류 : 
	private int lessonCnt;			//추가된 레슨 횟수
	private int practiceCnt;		//추가된 연습 횟수
	private String payDate;			//추가된 날짜
	private int lessonRmnCnt;		//잔여 레슨 횟수
	private int practiceRmnCnt;		//잔여 연습 횟수
	private String memo;			//납부 메모
	private String usedRsvIdx;		//사용된 예약 건 배열
	private int fees;				//납부 금액
	private int isDelete;			//삭제여부
	private String updateDate;		//수정일시
}
