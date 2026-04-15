package com.bitaqa.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
            "/",
            "/login",
            "/register",
            "/dashboard",
            "/dashboard/**",
            "/p/{username}"
    })
    public String spa() {
        return "forward:/index.html";
    }
}
