package com.nyoung.drumtree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
@ComponentScan(basePackages = "com.nyoung.drumtree")
@SpringBootApplication
public class DrumtreeApplication {

	public static void main(String[] args) {
		SpringApplication.run(DrumtreeApplication.class, args);
	}
}
