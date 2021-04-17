package com.nyoung.drumtree.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
	@RequestMapping(value="/")
	public String main() {
		return "Login";
	}
	
	@RequestMapping(value="/gamza")
	public String gamza() {
		return "gamza";
	}
	
	@RequestMapping(value="/Admin_Account")
	public String admin_account() {
		return "Admin_Account";
	}
	
	@RequestMapping(value="/Admin_Approval")
	public String admin_approval() {
		return "Admin_Approval";
	}
	
	@RequestMapping(value="/Admin_Notice")
	public String admin_notice() {
		return "Admin_Notice";
	}
	
	@RequestMapping(value="/Calendar")
	public String calendar() {
		return "Calendar";
	}
	
	@RequestMapping(value="/Notice")
	public String notice() {
		return "Notice";
	}
	
	@RequestMapping(value="/Reservation")
	public String reservation() {
		return "Reservation";
	}
}
