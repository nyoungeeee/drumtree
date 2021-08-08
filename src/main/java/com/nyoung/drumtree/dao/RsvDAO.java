package com.nyoung.drumtree.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.nyoung.drumtree.dto.RsvDTO;

@Repository
public class RsvDAO {
	@Autowired
	SqlSession sqlSession;

	/*예약 리스트(검색/전체)*/
	public List<RsvDTO> SelectRsv(RsvDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", param.getMemberIdx());
		map.put("rsvType", param.getRsvType());
		map.put("roomType", param.getRoomType());
		map.put("start", param.getStart());
		map.put("end", param.getEnd());
		map.put("memo", param.getMemo());
		map.put("isApproval", param.getIsApproval());
		return sqlSession.selectList("com.nyoung.drumtree.ReservationMapper.selectRsv", map);
	}

	/*예약 등록*/
	public int WriteRsv(RsvDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("memberIdx", param.getMemberIdx());
		map.put("rsvType", param.getRsvType());
		map.put("roomType", param.getRoomType());
		map.put("start", param.getStart());
		map.put("end", param.getEnd());
		map.put("memo", param.getMemo());
		map.put("isApproval", param.getIsApproval());
		return sqlSession.insert("com.nyoung.drumtree.ReservationMapper.writeRsv", map);
	}

	/*예약 수정*/
	public int UpdateRsv(RsvDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("rsvIdx", param.getRsvIdx());
		map.put("memberIdx", param.getMemberIdx());
		map.put("rsvType", param.getRsvType());
		map.put("roomType", param.getRoomType());
		map.put("start", param.getStart());
		map.put("end", param.getEnd());
		map.put("memo", param.getMemo());
		map.put("isApproval", param.getIsApproval());
		map.put("isDelete", param.getIsDelete());
		return sqlSession.insert("com.nyoung.drumtree.ReservationMapper.updateRsv", map);
	}

	/*예약 취소*/
	public int DeleteRsv(RsvDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("rsvIdx", param.getRsvIdx());
		return sqlSession.insert("com.nyoung.drumtree.ReservationMapper.deleteRsv", map);
	}

	/*예약 승인, 승인 취소*/
	public int ApprovalRsv(RsvDTO param) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("rsvIdx", param.getRsvIdx());
		map.put("isApproval", param.getIsApproval());
		return sqlSession.insert("com.nyoung.drumtree.ReservationMapper.approvalRsv", map);
	}
	
	/*사용 완료된 예약 내역*/
	public List<RsvDTO> UsedRsvList(String usedRsvIdx) {
		return sqlSession.selectList("com.nyoung.drumtree.ReservationMapper.usedRsv", usedRsvIdx);
	}

}
