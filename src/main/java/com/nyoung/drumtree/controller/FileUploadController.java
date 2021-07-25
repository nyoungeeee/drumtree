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
	public String upload(@RequestParam MultipartFile upload) {
		String[] url = fileUploadService.restore(upload);
		System.out.println(url[0]);
		System.out.println(url[1]);
		return "{"
				+ "\"uploaded\":1, "
				+ "\"url\":\""+"http://3.34.217.94:8080/test/"+url[0]+", "
				+ "\"name\":\""+url[1]+"\"}";
	}
}
