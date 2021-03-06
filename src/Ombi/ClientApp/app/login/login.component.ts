﻿import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../auth/auth.service';
import { StatusService } from '../services/status.service';
import { NotificationService } from '../services/notification.service';
import { SettingsService } from '../services/settings.service';
import { ICustomizationSettings } from '../interfaces/ISettings';

import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';


@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


    constructor(private authService: AuthService, private router: Router, private notify: NotificationService, private status: StatusService,
        private fb: FormBuilder, private settingsService: SettingsService, private images: ImageService, private sanitizer: DomSanitizer) {
        this.form = this.fb.group({
            username: ["", [Validators.required]],
            password: ["", [Validators.required]]
        });

        this.status.getWizardStatus().subscribe(x => {
            if (!x.result) {
                this.router.navigate(['Wizard']);
            }
        });
    }
    
    form: FormGroup;
    customizationSettings : ICustomizationSettings;
    background: any;

    ngOnInit(): void {
        this.settingsService.getCustomization().subscribe(x => this.customizationSettings = x);
        this.images.getRandomBackground().subscribe(x => {
            this.background = this.sanitizer.bypassSecurityTrustStyle('linear-gradient(-10deg, transparent 20%, rgba(0,0,0,0.7) 20.0%, rgba(0,0,0,0.7) 80.0%, transparent 80%),url(' + x.url + ')');
        });
    }


    onSubmit(form: FormGroup): void {
        if (form.invalid) {
            this.notify.error("Validation", "Please check your entered values");
            return
        }
        var value = form.value;
        this.authService.login({ password: value.password, username: value.username })
            .subscribe(x => {
                localStorage.setItem("id_token", x.access_token);

                if (this.authService.loggedIn()) {
                    this.router.navigate(['search']);
                } else {
                    this.notify.error("Could not log in", "Incorrect username or password");
                }


            }, err => this.notify.error("Could not log in", "Incorrect username or password"));
    }
}