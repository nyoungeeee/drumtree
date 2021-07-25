package com.nyoung.drumtree.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin("*")
@RestController
public class FileUploadController {
	@Autowired
	FileUploadService fileUploadService;

	@RequestMapping( "/form" )
	public String form() {
		return "form";
	}

	@RequestMapping(value = "/upload")
	public String upload(
			@RequestParam("file1") MultipartFile file) {

		String url = fileUploadService.restore(file);
		System.out.println("url : "+url);
		
		return url;
	}
}
