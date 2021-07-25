package com.nyoung.drumtree.controller;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Base64;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
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
		String url = fileUploadService.restore(upload);
		return "{\"uploaded\":1, \"url\":\""+"http://3.34.217.94:8080/test/"+url+"\"}";
	}
}
