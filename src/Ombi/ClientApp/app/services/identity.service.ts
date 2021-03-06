﻿import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ServiceAuthHelpers } from './service.helpers';
import { IUser, IUpdateLocalUser, ICheckbox, IIdentityResult, IResetPasswordToken } from '../interfaces/IUser';


@Injectable()
export class IdentityService extends ServiceAuthHelpers {
    constructor(http: AuthHttp, private regularHttp: Http) {
        super(http, '/api/v1/Identity/');
    }
    createWizardUser(username: string, password: string): Observable<boolean> {
        return this.regularHttp.post(`${this.url}Wizard/`, JSON.stringify({ username: username, password: password }), { headers: this.headers }).map(this.extractData);
    }

    getUser(): Observable<IUser> {
        return this.http.get(this.url).map(this.extractData);
    }

    getUserById(id: string): Observable<IUser> {
        return this.http.get(`${this.url}User/${id}`).map(this.extractData);
    }

    getUsers(): Observable<IUser[]> {
        return this.http.get(`${this.url}Users`).map(this.extractData);
    }

    getAllAvailableClaims(): Observable<ICheckbox[]> {
        return this.http.get(`${this.url}Claims`).map(this.extractData);
    }

    createUser(user: IUser): Observable<IIdentityResult> {
        return this.http.post(this.url, JSON.stringify(user), { headers: this.headers }).map(this.extractData);
    }

    updateUser(user: IUser): Observable<IIdentityResult> {
        return this.http.put(this.url, JSON.stringify(user), { headers: this.headers }).map(this.extractData);
    }     
    updateLocalUser(user: IUpdateLocalUser): Observable<IIdentityResult> {
        return this.http.put(this.url + 'local', JSON.stringify(user), { headers: this.headers }).map(this.extractData);
    }    
    
    deleteUser(user: IUser): Observable<IIdentityResult> {
        return this.http.delete(`${this.url}/${user.id}`, { headers: this.headers }).map(this.extractData);
    }

    submitResetPassword(email:string): Observable<IIdentityResult>{
        return this.regularHttp.post(this.url + 'reset', JSON.stringify({email:email}), { headers: this.headers }).map(this.extractData);
    }

    resetPassword(token: IResetPasswordToken):Observable<IIdentityResult>{
        return this.regularHttp.post(this.url + 'resetpassword', JSON.stringify(token), { headers: this.headers }).map(this.extractData);
    }

    hasRole(role: string): boolean {
        var roles = localStorage.getItem("roles") as string[] | null;
        if (roles) {
            if (roles.indexOf(role) > -1) {
                return true;
            }
            return false;
        }
        return false;
    }
}